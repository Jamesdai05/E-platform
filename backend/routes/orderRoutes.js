import {
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDeliver,
  getOrderById,
  getMyOrders,
  addOrderItems, } from "../controllers/orderController.js";

import express from "express";
import { admin, protectRoute } from "../middleware/authMiddleware.js";


const router=express.Router();


//protectRoute and check the order
router.route("/").post(protectRoute,addOrderItems).get(protectRoute,admin,getAllOrders);
// router.route("/").post(protectRoute,addOrderItems).get(getAllOrders);

// check my own orders
router.route("/mine").get(protectRoute,getMyOrders);
// router.route("/mine").get(getMyOrders);

//single order route
router.route("/:id").get(protectRoute,getOrderById)
// router.route("/:id").get(getOrderById)
router.route("/:id/pay").put(protectRoute,updateOrderToPaid)

//Admin to update the deliver status

router.route("/:id").put(protectRoute,admin,updateOrderToDeliver)
// router.route("/:id").put(updateOrderToDeliver)


export default router
