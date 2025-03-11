import express from 'express';
import {
  createProduct,
  // getProducts,
  getProductsWithPagination,
  getProductsById,
  updateProductsById,
  deleteProductsById,
  createProductReview,
  getTopProducts,
} from '../controllers/product.js';
import { admin, protectRoute } from '../middleware/authMiddleware.js';



const router=express.Router()

router.route("/").get(getProductsWithPagination).post(protectRoute,admin,createProduct);
router.get("/top",getTopProducts);
router.route("/:id").get(getProductsById).put(protectRoute,admin,updateProductsById).delete(deleteProductsById);
router.route("/:id/reviews").post(protectRoute,createProductReview);


export default router;

