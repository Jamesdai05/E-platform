// console.log("Hello world");
import express from "express"
import products from "./data/products.js"
const app=express()

const port =5002

app.get("/",(req,res)=>{
  res.send("API is running...")
})


//get products
app.get("/api/products",(req,res)=>{
  res.json(products)
})

// specific product
app.get("/api/products/:id",(req,res)=>{
  const product=products.find(e=>e._id==req.params.id)
  res.json(product)
})


app.listen(port,()=>{
  console.log(`Server is listening on port ${port}.`);
})