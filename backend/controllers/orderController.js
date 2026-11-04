import asyncHandler from "../middleware/asyncHandler.js";
import mongoose from 'mongoose';
import Order from "../models/orderModel.js";
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { createPayPalOrder, getPayPalOrder, capturePayPalOrder } from '../utils/paypal.js';

// Only the customer who placed an order, or an admin, may read or pay it.
// order.user may be an id or a populated user, and is null if the user was deleted.
const canAccessOrder = (order, user) =>
  user.isAdmin || order.user?._id?.toString() === user._id.toString();


//@desc   addItemToOrder
//@route  POST /api/orders
//@access private

const addOrderItems = asyncHandler(async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    // Enhanced validation
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided or invalid format" });
    }

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: "Shipping address and payment method are required" });
    }

    // Validate order items structure
    const invalidItems = orderItems.filter(item =>
      !item._id || !Number.isInteger(item.qty) || item.qty <= 0 || !item.name
    );

    if (invalidItems.length > 0) {
      return res.status(400).json({ message: "Invalid order items format" });
    }

    // Extract product IDs and validate format
    const invalidItem=orderItems.find(item=>!mongoose.Types.ObjectId.isValid(item._id))

    if(invalidItem){
      throw new Error(`Invalid product ID: ${invalidItem._id}`)
    }

    // map orderItems from DB using a validated IDs
    // Fetch all products from DB using validated IDs
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map(item => item._id) },
    }).select('_id name image price countInStock');



    // Map order items with validation(compare the id from client and the id from db)
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id.toString()
      );
      // console.log(typeof itemFromClient._id);
      if (!matchingItemFromDB) {
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      if (matchingItemFromDB.countInStock < itemFromClient.qty) {
        throw new Error(`Insufficient stock for ${itemFromClient.name}`);
      }

      return {
        name: itemFromClient.name || matchingItemFromDB.name,
        qty: Number(itemFromClient.qty),
        image: itemFromClient.image || matchingItemFromDB.image,
        price: Number(matchingItemFromDB.price),
        product: itemFromClient._id,
      };
    });

    // Calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

    // Validate calculated prices
    if (isNaN(itemsPrice) || isNaN(taxPrice) || isNaN(shippingPrice) || isNaN(totalPrice)) {
      return res.status(400).json({ message: "Invalid price calculation" });
    }

    // Create order
    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress: {
        address: shippingAddress.address?.trim() || "",
        city: shippingAddress.city?.trim(),
        postalCode: shippingAddress.postalCode?.trim(),
        country: shippingAddress.country?.trim(),
      },
      paymentMethod: paymentMethod.trim(),
      itemsPrice: Number(itemsPrice),
      taxPrice: Number(taxPrice),
      shippingPrice: Number(shippingPrice),
      totalPrice: Number(totalPrice),
    });

    const createdOrder = await order.save();

    // Update product stock
    for (const item of dbOrderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { countInStock: -item.qty } }
      );
    }

    res.status(201).json(createdOrder);

  } catch (error) {
    console.error('Error in addOrderItems:', error);

    if (error.message.includes('Invalid product ID') || error.message.includes('Product not found')) {
      return res.status(400).json({ message: error.message });
    }

    if (error.message.includes('Insufficient stock')) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Error processing order. Please try again." });
  }
});

// @desc show items in order
// @route Get api/orders
// @access private
const getMyOrders=asyncHandler(async(req,res)=>{
  // res.json("get items")
  // find the order base on the user id
  const orders=await Order.find({user:req.user._id});
  res.status(200).json(orders)

})

// @desc get order by Id
// @route Get api/orders/:id
// @access private
const getOrderById=asyncHandler(async(req,res)=>{
  // find the order and populate the user collections
  // res.send("Get Orders BY ID")
  const order=await Order.findById(req.params.id).populate("user","name email")
  if(order){
    if(!canAccessOrder(order,req.user)){
      return res.status(403).json({message:"Not authorized to view this order"});
    }
    return res.status(200).json(order);
  }else{
    res.status(404).json({message:"Order not found!"});
  }
})


// @desc   Update orders status (to complete the purchase)
// @route  PUT api/orders/:id/:deliver
// @access private/user
const updateOrderToDeliver=asyncHandler(async(req,res)=>{
  const order=await Order.findById(req.params.id)
  if(order){
    order.isDelivered=true;
    order.deliveredAt=Date.now();

    const updatedOrder=await order.save();
    res.status(200).json(updatedOrder);
  }else{
    res.status(400).json("Order not exist!")
  }
})


// Applies a PayPal order's capture to a shop order, marking it paid once the money
// has really arrived. Returns "paid", "pending" (PayPal is still processing it) or
// "failed" (no money was taken, so the customer can try again).
const settlePayment = async (order, paypalOrder) => {
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
};

const PAYMENT_PENDING_MESSAGE =
  'Your payment is being processed by PayPal. Please do not pay again.';

// @desc   Start a PayPal payment for the saved order total
// @route  POST api/orders/:id/paypal
// @access private (order owner or admin)
const createPayPalPayment = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!canAccessOrder(order, req.user)) {
      return res.status(403).json({ message: 'Not authorized to pay for this order' });
    }

    if (order.isPaid) {
      return res.status(409).json({ message: 'Order is already paid' });
    }

    // An earlier attempt may have taken the money without the order being updated,
    // so check it before letting the customer pay a second time.
    if (order.paypalOrderId) {
      const earlierAttempt = await getPayPalOrder(order.paypalOrderId);
      const result = earlierAttempt ? await settlePayment(order, earlierAttempt) : 'failed';

      if (result === 'paid') {
        return res.status(409).json({ message: 'Order is already paid' });
      }
      if (result === 'pending') {
        return res.status(409).json({ message: PAYMENT_PENDING_MESSAGE });
      }
    }

    order.paypalOrderId = await createPayPalOrder(order);
    await order.save();

    res.status(201).json({ id: order.paypalOrderId });
  } catch (error) {
    console.error('Error creating PayPal payment:', error);
    res.status(500).json({ message: 'Could not start the PayPal payment. Please try again.' });
  }
});

// @desc   Capture the approved PayPal payment and mark the order as paid
// @route  POST api/orders/:id/paypal/capture
// @access private (order owner or admin)
const capturePayPalPayment = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!canAccessOrder(order, req.user)) {
      return res.status(403).json({ message: 'Not authorized to pay for this order' });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    // Only the payment this server created for this order can ever be captured
    if (!order.paypalOrderId) {
      return res.status(400).json({ message: 'No PayPal payment has been started for this order' });
    }

    const paypalOrder = await capturePayPalOrder(order.paypalOrderId);
    const result = await settlePayment(order, paypalOrder);

    if (result === 'paid') {
      return res.json(order);
    }
    if (result === 'pending') {
      return res.status(202).json({ message: PAYMENT_PENDING_MESSAGE });
    }
    res.status(402).json({ message: 'The payment could not be completed. Please try again.' });
  } catch (error) {
    if (error.issue === 'INSTRUMENT_DECLINED') {
      return res.status(402).json({ message: 'Your payment method was declined. Please try another one.' });
    }

    // Unique index on paymentResult.id: this transaction already paid another order
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Transaction has been used before' });
    }

    console.error('Error capturing PayPal payment:', error);
    res.status(500).json({
      message: 'We could not confirm your payment. Please refresh the page and check this order before paying again.',
    });
  }
});

// @desc   get all orders (to be delivered)
// @route  GET api/orders
// @access private/admin
const getAllOrders=asyncHandler(async(req,res)=>{
  const orders= await Order.find({}).populate("user","id name");
  res.status(200).json(orders)
})


export {
  getAllOrders,
  createPayPalPayment,
  capturePayPalPayment,
  updateOrderToDeliver,
  getOrderById,
  getMyOrders,
  addOrderItems,
}