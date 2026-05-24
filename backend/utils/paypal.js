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
 * Checks if a PayPal transaction is new by comparing the transaction ID with existing orders in the database.
 *
 * @param {Mongoose.Model} orderModel - The Mongoose model for the orders in the database.
 * @param {string} paypalTransactionId - The PayPal transaction ID to be checked.
 * @returns {Promise<boolean>} Returns true if it is a new transaction (i.e., the transaction ID does not exist in the database), false otherwise.
 * @throws {Error} If there's an error in querying the database.
 *
 */
export async function checkIfNewTransaction(orderModel, paypalTransactionId) {
  try {
    // Find all documents where Order.paymentResult.id is the same as the id passed paypalTransactionId
    const orders = await orderModel.find({
      'paymentResult.id': paypalTransactionId,
    });

    // If there are no such orders, then it's a new transaction.
    return orders.length === 0;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Verifies a PayPal payment by making a request to the PayPal API.
 * @see {@link https://developer.paypal.com/docs/api/orders/v2/#orders_get}
 *
 * @param {string} paypalTransactionId - The PayPal transaction ID to be verified.
 * @returns {Promise<Object>} An object with properties 'verified' indicating if the payment is completed and 'value' indicating the payment amount.
 * @throws {Error} If the request is not successful.
 *
 */
export async function verifyPayPalPayment(paypalTransactionId) {
  try {
    /* console.log('Verifying PayPal payment for transaction ID:', paypalTransactionId); */

    const accessToken = await getPayPalAccessToken();
    const url = `${PAYPAL_API_URL}/v2/checkout/orders/${paypalTransactionId}`;

    console.log('Making PayPal verification request to:', url);

    const paypalResponse = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!paypalResponse.ok) {
      const errorText = await paypalResponse.text();
      console.error('PayPal verification error:', paypalResponse.status, errorText);
      throw new Error(`Failed to verify payment: ${paypalResponse.status} ${errorText}`);
    }

    const paypalData = await paypalResponse.json();
    console.log('PayPal verification response:', JSON.stringify(paypalData, null, 2));

    const isCompleted = paypalData.status === 'COMPLETED';
    const paymentValue = paypalData.purchase_units?.[0]?.amount?.value;

    if (!paymentValue) {
      throw new Error('Payment amount not found in PayPal response');
    }

    console.log(`Payment verification result: verified=${isCompleted}, value=${paymentValue}`);

    return {
      verified: isCompleted,
      value: paymentValue,
    };
  } catch (error) {
    console.error('Error verifying PayPal payment:', error);
    throw error;
  }
}
