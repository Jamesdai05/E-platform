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
  // this just to create a mock product and modify from the frontend.
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
  res.status(201).json(createdProduct)
})

// @desc   update a single product
// @route  PUT /api/products/:id
// @access Private/Admin

const updateProductsById=asyncHandler(async(req,res)=>{
  const {image,
          price,
          name,
          description,
          brand,
          category,
          countInStock} = req.body;

  const product=await Product.findById(req.params.id);


  if(product){
    product.name=name;
    product.price=price,
    product.brand=brand;
    product.countInStock=countInStock;
    product.category=category;
    product.description=description;
    product.image=image;

    const updateProduct=await product.save();
    return res.status(201).json(updateProduct);
  }else {
  res.status(404).json({message:"Resource not found."})
  }
})


// @desc   Delete a single product
// @route  DELETE /api/products/:id
// @access Private/Admin

const deleteProductsById=asyncHandler(async(req,res)=>{
  // res.send("Product deleted!")
  const product=await Product.findById(req.params.id);


  if(product){
    await Product.deleteOne({_id:product._id});
    return res.status(200).json({message:"Product is deleted1"});
  }else {
  res.status(404).json({message:"Resource not found."})
  }
})

// @desc   Create a product review
// @route  POST /api/products/:id/reviews
// @access Private

const createProductReview=asyncHandler(async(req,res)=>{
  // res.send("review")
  const {rating,comment} =req.body;
  const product=await Product.findById(req.params.id);

  if(product){

    const alreadyReview=product.reviews.find(
      // the review user and the user in the req to be the same or not
      review=>review.user.toString()===req.user._id.toString()
    );

    if(alreadyReview){
      return res.status(400).json("Product has been reviewed.");
      }
      const review ={
        name:req.user.name,
        rating:Number(product.rating),
        comment,
        user:req.user._id,
      };

      product.reviews.push(review);
      product.numReviews=product.reviews.length;
      // a is accumulater and c is current element
      product.rating=product.reviews.reduce((a,c)=>a + c.rating,0) / product.reviews.lenghth;

      await product.save();
      res.status(201).json({message:"Review submitted!"});
  }else{
    res.status(400).json("Product not found.")
  }
})



export {
  getProducts,
  getProductsById,
  createProduct,
  updateProductsById,
  deleteProductsById,
  createProductReview,
}