import dotenv from 'dotenv';
dotenv.config();
const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET, PAYPAL_API_URL } = process.env;

/**
 * Validates that all required PayPal environment variables are present
 * @throws {Error} If any required environment variables are missing
 */
function validatePayPalEnvironmentVariables() {
  const missingVars = [];

  if (!PAYPAL_CLIENT_ID) missingVars.push('PAYPAL_CLIENT_ID');
  if (!PAYPAL_APP_SECRET) missingVars.push('PAYPAL_APP_SECRET');
  if (!PAYPAL_API_URL) missingVars.push('PAYPAL_API_URL');

  if (missingVars.length > 0) {
    const errorMessage = `
❌ PayPal Configuration Error - Missing Environment Variables:

Missing variables: ${missingVars.join(', ')}

    `.trim();

    throw new Error(errorMessage);
  }
}

/**
 * Fetches an access token from the PayPal API.
 * @see {@link https://developer.paypal.com/reference/get-an-access-token/#link-getanaccesstoken}
 *
 * @returns {Promise<string>} The access token if the request is successful.
 * @throws {Error} If the request is not successful.
 *
 */
async function getPayPalAccessToken() {
  try {
    // Validate environment variables with detailed error message
    validatePayPalEnvironmentVariables();

    // Authorization header requires base64 encoding
    const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_APP_SECRET).toString(
      'base64'
    );

    const url = `${PAYPAL_API_URL}/v1/oauth2/token`;

    const headers = {
      Accept: 'application/json',
      'Accept-Language': 'en_US',
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const body = 'grant_type=client_credentials';

    console.log('Requesting PayPal access token from:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PayPal access token error:', response.status, errorText);
      throw new Error(`Failed to get access token: ${response.status} ${errorText}`);
    }

    const paypalData = await response.json();
    console.log('PayPal access token obtained successfully');

    return paypalData.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error);
    throw error;
  }
}

/**
 * Sends an authenticated request to the PayPal Orders API.
 *
 * @param {string} path - The API path, starting with a slash.
 * @param {Object} [options] - Extra fetch options. Headers are merged with the defaults.
 * @returns {Promise<Response>} The raw response.
 */
async function paypalRequest(path, { headers, ...options } = {}) {
  const accessToken = await getPayPalAccessToken();

  return fetch(`${PAYPAL_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...headers,
    },
  });
}

/**
 * Builds an Error from a failed PayPal response. PayPal's reason stays in the
 * server log and in error.issue, so it is not sent to customers by accident.
 *
 * @param {string} action - What was being attempted, for the log.
 * @param {Response} response - The failed response.
 * @param {Object} body - The parsed response body.
 * @returns {Error} An error with an 'issue' property holding PayPal's issue code.
 */
function paypalError(action, response, body) {
  console.error(`PayPal ${action} error:`, response.status, JSON.stringify(body));

  const error = new Error(`PayPal ${action} failed with status ${response.status}`);
  error.issue = body.details?.[0]?.issue;
  return error;
}

/**
 * Creates a PayPal order for the saved total of a shop order.
 * @see {@link https://developer.paypal.com/docs/api/orders/v2/#orders_create}
 *
 * @param {Object} order - The shop order.
 * @returns {Promise<string>} The PayPal order ID.
 * @throws {Error} If the request is not successful.
 */
export async function createPayPalOrder(order) {
  const response = await paypalRequest('/v2/checkout/orders', {
    method: 'POST',
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          custom_id: order._id.toString(),
          description: `Order ${order._id}`,
          amount: {
            currency_code: 'USD',
            value: order.totalPrice.toFixed(2),
          },
        },
      ],
    }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw paypalError('create order', response, body);
  }

  return body.id;
}

/**
 * Fetches a PayPal order.
 * @see {@link https://developer.paypal.com/docs/api/orders/v2/#orders_get}
 *
 * @param {string} paypalOrderId - The PayPal order ID.
 * @returns {Promise<Object|null>} The PayPal order, or null if it no longer exists.
 * @throws {Error} If the request is not successful.
 */
export async function getPayPalOrder(paypalOrderId) {
  const response = await paypalRequest(`/v2/checkout/orders/${paypalOrderId}`);

  if (response.status === 404) {
    return null;
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw paypalError('get order', response, body);
  }

  return body;
}

/**
 * Captures the money for an approved PayPal order. Safe to repeat: the request ID
 * makes PayPal treat retries as the same capture, and an order that was already
 * captured is returned as it stands.
 * @see {@link https://developer.paypal.com/docs/api/orders/v2/#orders_capture}
 *
 * @param {string} paypalOrderId - The PayPal order ID.
 * @returns {Promise<Object>} The full PayPal order, including its captures.
 * @throws {Error} If the capture fails. error.issue holds PayPal's issue code.
 */
export async function capturePayPalOrder(paypalOrderId) {
  const response = await paypalRequest(`/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      Prefer: 'return=representation',
      'PayPal-Request-Id': `capture-${paypalOrderId}`,
    },
  });

  const body = await response.json().catch(() => ({}));
  if (response.ok) {
    return body;
  }

  if (body.details?.[0]?.issue === 'ORDER_ALREADY_CAPTURED') {
    return getPayPalOrder(paypalOrderId);
  }

  throw paypalError('capture', response, body);
}

// Applies a PayPal order's capture to a shop order, marking it paid once the money
// has really arrived. Returns "paid", "pending" (PayPal is still processing it) or
// "failed" (no money was taken, so the customer can try again).
export async function settlePayment(order, paypalOrder) {
  const capture = paypalOrder.purchase_units?.[0]?.payments?.captures?.[0];

  if (capture?.status === 'PENDING') {
    return 'pending';
  }
  if (capture?.status !== 'COMPLETED') {
    return 'failed';
  }

  // Compare in whole cents to avoid floating point errors
  const paidInFull =
    capture.amount?.currency_code === 'USD' &&
    Math.round(parseFloat(capture.amount.value) * 100) === Math.round(order.totalPrice * 100);

  if (!paidInFull) {
    console.error(`Captured amount does not match order ${order._id}:`, capture.amount);
    return 'failed';
  }

  order.isPaid = true;
  // A paid order keeps its stock, even if the expiry job had claimed it
  order.stockReleased = false;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: paypalOrder.id,
    status: capture.status,
    update_time: capture.update_time,
    email_address:
      paypalOrder.payment_source?.paypal?.email_address ||
      paypalOrder.payer?.email_address ||
      'N/A',
  };
  await order.save();

  return 'paid';
}

// Checks the PayPal order stored on a shop order and applies any capture it has.
// Returns the same values as settlePayment.
export async function settleStoredPayment(order) {
  const paypalOrder = await getPayPalOrder(order.paypalOrderId);
  return paypalOrder ? settlePayment(order, paypalOrder) : 'failed';
}
