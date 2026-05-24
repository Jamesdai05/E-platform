import asyncHandler from "../middleware/asyncHandler.js";
import mongoose from 'mongoose';
import Order from "../models/orderModel.js";
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';


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
      !item._id || !item.qty || item.qty <= 0 || !item.name
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


// @desc   Update orders status (to be paid)
// @route  PUT api/orders/:id/pay
// @access private/Admin
const updateOrderToPaid = asyncHandler(async (req, res) => {
  try {
    // To check the payment id and the details
    // console.log('Processing payment for order:', req.params.id);
    // console.log('Payment details:', JSON.stringify(req.body, null, 2));

    // Validate request body
    if (!req.body.id) {
      return res.status(400).json({ message: 'PayPal transaction ID is required' });
    }

    // Find the order first
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // console.log('Order found:', order._id, 'Total:', order.totalPrice);

    // Check if order is already paid
    if (order.isPaid) {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    // Verify the payment with PayPal
    const { verified, value } = await verifyPayPalPayment(req.body.id);
    if (!verified) {
      return res.status(400).json({ message: 'Payment not verified with PayPal' });
    }

    // Check if this transaction has been used before
    const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
    if (!isNewTransaction) {
      return res.status(400).json({ message: 'Transaction has been used before' });
    }

    // Check the correct amount was paid (with floating point tolerance)
    const orderAmount = parseFloat(order.totalPrice.toString());
    const paidAmount = parseFloat(value);
    const tolerance = 0.01; // 1 cent tolerance for floating point precision

    console.log(`Amount comparison: Order=${orderAmount}, Paid=${paidAmount}, Difference=${Math.abs(orderAmount - paidAmount)}`);

    const paidCorrectAmount = Math.abs(orderAmount - paidAmount) <= tolerance;
    if (!paidCorrectAmount) {
      return res.status(400).json({
        message: `Incorrect amount paid. Expected: $${orderAmount}, Received: $${paidAmount}`
      });
    }

    // Update order with payment information
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status || 'COMPLETED',
      update_time: req.body.update_time || new Date().toISOString(),
      email_address: req.body.payer?.email_address || 'N/A',
    };

    const updatedOrder = await order.save();
    console.log('Order payment updated successfully:', updatedOrder._id);

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({
      message: error.message || 'Error processing payment',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
  updateOrderToPaid,
  updateOrderToDeliver,
  getOrderById,
  getMyOrders,
  addOrderItems,
}