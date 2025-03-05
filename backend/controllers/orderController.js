import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";


//@desc   addItemToOrder
//@route  POST /api/orders
//@access private

const addOrderItems=asyncHandler(async(req,res)=>{
  res.json("items added")

})

// @desc show items in order
// @route Get api/orders
// @access private
const getMyOrders=asyncHandler(async(req,res)=>{
  res.json("get items")
  // find the order base on the user id

})

// @desc get order by Id
// @route Get api/orders/:id
// @access private
const getOrderById=asyncHandler(async(req,res)=>{
  // find the order and populate the user collections
  res.send("Get Orders BY ID")
})


// @desc   Update orders status (to complete the purchase)
// @route  PUT api/orders/:id/:deliver
// @access private/user
const updateOrderById=asyncHandler(async(req,res)=>{
  res.json("update order")
})


// @desc   Update orders status (to be delivered)
// @route  GET api/orders/:id
// @access private/Admin
const updateOrderToDeliver=asyncHandler(async(req,res)=>{
  res.json("update order")
})


// @desc   get all orders (to be delivered)
// @route  GET api/orders
// @access private/admin
const getAllOrders=asyncHandler(async(req,res)=>{
  res.json("Get all orders")
})


export {
  getAllOrders,
  updateOrderById,
  updateOrderToDeliver,
  getOrderById,
  getMyOrders,
  addOrderItems,
}