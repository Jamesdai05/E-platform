import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { settleStoredPayment } from './paypal.js';

// How long an unpaid order holds its stock. Starting a payment restarts the clock.
const RESERVATION_MINUTES = 60;
const CHECK_INTERVAL_MINUTES = 5;

/**
 * Puts order items back on sale.
 *
 * @param {Array<{product: *, qty: number}>} items - The items to restock.
 */
export async function restoreStock(items) {
  if (items.length === 0) return;

  await Product.bulkWrite(
    items.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { countInStock: item.qty } },
      },
    }))
  );
}

/**
 * Releases the stock of one expired order, unless PayPal shows it was paid.
 * The order is claimed first: that blocks new captures, and means only one run
 * can ever restock it.
 *
 * @param {*} orderId - The order to release.
 */
async function releaseOrder(orderId) {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, isPaid: false, stockReleased: { $ne: true } },
    { $set: { stockReleased: true } },
    { new: true }
  );
  if (!order) return;

  try {
    const result = order.paypalOrderId ? await settleStoredPayment(order) : 'failed';

    if (result === 'paid') {
      console.log(`Order ${order._id} was paid at PayPal, marked as paid`);
    } else if (result === 'pending') {
      await Order.updateOne({ _id: order._id }, { $set: { stockReleased: false } });
    } else {
      await restoreStock(order.orderItems);
      console.log(`Order ${order._id} expired, stock released`);
    }
  } catch (error) {
    // Could not tell whether it was paid, so keep the stock and retry next run
    await Order.updateOne({ _id: order._id }, { $set: { stockReleased: false } });
    console.error(`Could not release order ${order._id}:`, error);
  }
}

/**
 * Finds unpaid orders past their reservation time and releases each one.
 * updatedAt is used because starting a payment saves the order, which gives the
 * customer a full reservation period to finish paying.
 */
export async function releaseExpiredOrders() {
  const cutoff = new Date(Date.now() - RESERVATION_MINUTES * 60 * 1000);

  const expiredOrders = await Order.find({
    isPaid: false,
    isDelivered: false,
    stockReleased: { $ne: true },
    updatedAt: { $lt: cutoff },
  }).select('_id');

  for (const { _id } of expiredOrders) {
    await releaseOrder(_id);
  }
}

/**
 * Runs the expiry check on a timer, never overlapping a previous run.
 */
export function startOrderExpiryJob() {
  let running = false;

  setInterval(async () => {
    if (running) return;
    running = true;
    try {
      await releaseExpiredOrders();
    } catch (error) {
      console.error('Order expiry job failed:', error);
    } finally {
      running = false;
    }
  }, CHECK_INTERVAL_MINUTES * 60 * 1000);
}
