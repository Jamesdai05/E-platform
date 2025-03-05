// console.log("Hello world");
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config()

connectDB()

const app=express()

const port =process.env.PORT || 5002

app.use(cors(
  {
  origin:"http://localhost:3000",
  credentials: true, /* This allows cookies to be sent with cross-origin requests*/
  allowedHeaders: ['Content-Type', 'Authorization'],
  }
))
// middleware for json data and form data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())


app.get("/",(req,res)=>{
  res.send("API is running...")
})


//get products
// app.get("/api/products",(req,res)=>{
//   res.json(products)
// })
app.use("/api/products",productRoutes);
app.use("/api/users",userRoutes);
app.use("/api/orders",orderRoutes);

app.use(notFound);
app.use(errorHandler);



app.listen(port,()=>{
  console.log(`Server is listening on port ${port}.`);
})