// console.log("Hello world");
import express from "express"
import products from "./data/products.js"
import dotenv from "dotenv"
import connectDB from "./config/dbConnect.js";
import productRoutes from "./routes/productRoutes.js"
dotenv.config()

connectDB()

const app=express()

const port =process.env.PORT || 5002



app.get("/",(req,res)=>{
  res.send("API is running...")
})


//get products
// app.get("/api/products",(req,res)=>{
//   res.json(products)
// })
app.use("/api/products",productRoutes);




app.listen(port,()=>{
  console.log(`Server is listening on port ${port}.`);
})