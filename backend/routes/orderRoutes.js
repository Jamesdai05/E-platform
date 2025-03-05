import {
  getAllOrders,
  updateOrderById,
  updateOrderToDeliver,
  getOrderById,
  getMyOrders,
  addOrderItems, } from "../controllers/orderController.js";

import express from "express";

const router=express.Router();


//protectRoute and check the order
// router.route("/").post(protectRoute,addOrderItems).get(protectRoute,getAllOrders);
router.route("/").post(addOrderItems).get(getAllOrders);

// check my own orders
router.route("/mine").get(getMyOrders);

//single order route
router.route("/:id").get(getOrderById)
router.route("/:id/pay").put(updateOrderById)

//Admin to update the deliver status

// router.route("/:id").put(protectRoute,adminRoute,updateOrderToDeliver)
router.route("/:id").put(updateOrderToDeliver)


export default router
