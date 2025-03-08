import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js"

// @desc   fetch all products
// @route  GET /api/products
// @access public

const getProducts=asyncHandler(async(req,res)=>{
  const products=await Product.find({})
  res.json(products)
})

// @desc   fetch a single product
// @route  GET /api/products/:id
// @access public

const getProductsById=asyncHandler(async(req,res)=>{
  const product = await Product.findById(req.params.id)
  if(product){
    return res.json(product);
  }
  res.status(404).json({message:"Product not found."})
})

// @desc   create a single product
// @route  POST /api/products
// @access private/admin

const createProduct=asyncHandler(async(req,res)=>{
  const product = new Product ({
    name:"Product",
    price:0,
    category:"sample category",
    user:req.user._id,
    image:"./images/sample.jpg",
    brand:"sample brand",
    category:"sample category",
    countInStock: 0,
    numReviews:0,
    description:"sample description",
  })
  const createdProduct =await product.save();
  res.status(201)).json(createdProduct)
})



export {
  getProducts,
  getProductsById,
  createProduct,
}