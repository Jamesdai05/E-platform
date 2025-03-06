import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";


//@desc   addItemToOrder
//@route  POST /api/orders
//@access private

const addOrderItems=asyncHandler(async(req,res)=>{
  // res.json("items added")
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    }=req.body;

    if(orderItems.length===0 && orderItems){
      return res.status(400).json({message:"No order items!"});
    }else{
      const order=new Order({
        orderItems:orderItems.map(e=>({
          ...e,
          product:e._id,
          id:undefined,
        })),
        user:req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      })
      // save to database
      const createdOrder= await order.save()

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
  res.json("update order")
})


// @desc   Update orders status (to be paid)
// @route  PUT api/orders/:id/pay
// @access private/Admin
const updateOrderToPaid=asyncHandler(async(req,res)=>{
  // res.json("update order to be paid!")
})


// @desc   get all orders (to be delivered)
// @route  GET api/orders
// @access private/admin
const getAllOrders=asyncHandler(async(req,res)=>{
  res.json("Get all orders")
})


export {
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDeliver,
  getOrderById,
  getMyOrders,
  addOrderItems,
}