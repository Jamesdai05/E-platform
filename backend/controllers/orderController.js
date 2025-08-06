import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';


//@desc   addItemToOrder
//@route  POST /api/orders
//@access private

const addOrderItems=asyncHandler(async(req,res)=>{
  // res.json("items added")
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      }=req.body;

    if(orderItems.length===0 && orderItems){
      return res.status(400).json({message:"No order items!"});
    }else{
      // get the ordered items from the database
      const itemsFromDB = await Product.find({
        _id: {$in:orderItems.map((x)=>x._id)},
      })

      // map the order items and use the price stored from database
      const dbOrderItems=orderItems.map((itemFromClient)=>{
        const matchingItemFromDB=itemsFromDB.find(
          (itemFromDB)=> itemFromDB._id.toString() === itemFromClient._id
        );
        return {
          ...itemFromClient,
          product:itemFromClient._id,
          price:matchingItemFromDB.price,
          _id:undefined,
        };
      });


      // calculate prices
      const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);


      const order = new Order({
        orderItems: dbOrderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      res.status(201).json(createdOrder);
    }
})

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
  // verified the payment 
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) throw new Error('Payment not verified');

  // check if this transaction has been used before
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) throw new Error('Transaction has been used before');

  const order = await Order.findById(req.params.id);

  if (order) {
    // check the correct amount was paid
    const paidCorrectAmount = order.totalPrice.toString() === value;
    if (!paidCorrectAmount) throw new Error('Incorrect amount paid');

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
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