import express from 'express';
import { createProduct, getProducts,getProductsById, updateProductsById,deleteProductsById, createProductReview } from '../controllers/product.js';
import { admin, protectRoute } from '../middleware/authMiddleware.js';



const router=express.Router()

router.route("/").get(getProducts).post(protectRoute,admin,createProduct);
router.route("/:id").get(getProductsById).put(protectRoute,admin,updateProductsById).delete(deleteProductsById);
router.route("/:id/reviews").post(protectRoute,createProductReview);


export default router;

