import express from 'express';
import { createProduct, getProducts,getProductsById } from '../controllers/product.js';
import { admin, protectRoute } from '../middleware/authMiddleware.js';


const router=express.Router()

router.route("/").get(getProducts).post(protectRoute,admin,createProduct)
router.route("/:id").get(getProductsById)

export default router

