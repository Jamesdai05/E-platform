// console.log("Hello world");
import path from 'path';
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config()

// Validate critical environment variables on startup
function validateEnvironmentVariables() {
  const requiredVars = {
    'MONGO_URI': process.env.MONGO_URI || process.env.MONGO_URI_LOCAL,
    'JWT_SECRET': process.env.JWT_SECRET,
    'NODE_ENV': process.env.NODE_ENV,
  };

  const paypalVars = {
    'PAYPAL_CLIENT_ID': process.env.PAYPAL_CLIENT_ID,
    'PAYPAL_APP_SECRET': process.env.PAYPAL_APP_SECRET,
    'PAYPAL_API_URL': process.env.PAYPAL_API_URL,
  };

  const missingRequired = [];
  const missingPaypal = [];

  // Check required variables
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value) missingRequired.push(key);
  });

  // Check PayPal variables
  Object.entries(paypalVars).forEach(([key, value]) => {
    if (!value) missingPaypal.push(key);
  });

  if (missingRequired.length > 0) {
    console.error('❌ CRITICAL ERROR - Missing required environment variables:');
    console.error('Missing:', missingRequired.join(', '));
    console.error('\n🔧 These variables are required for the application to function.');
    console.error('Please add them to your environment and restart the server.');
    process.exit(1);
  }

  if (missingPaypal.length > 0) {
    console.warn('⚠️  WARNING - Missing PayPal environment variables:');
    console.warn('Missing:', missingPaypal.join(', '));
    console.warn('\n💡 PayPal payments will not work until these are configured.');
    console.warn('The application will start, but payment processing will fail.');
    console.warn('See RENDER_DEPLOYMENT.md for setup instructions.\n');
  } else {
    console.log('✅ PayPal environment variables configured successfully');
  }
}

// Validate environment variables before starting
validateEnvironmentVariables();

connectDB()

const app=express()

const port =process.env.PORT || 5002

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? true // Allow same origin in production since frontend is served from same domain
    : "http://localhost:3000",
  credentials: true, /* This allows cookies to be sent with cross-origin requests*/
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// app.use(cors());
// middleware for json data and form data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

//get products
// app.get("/api/products",(req,res)=>{
//   res.json(products)
// })
app.use("/api/products",productRoutes);
app.use("/api/users",userRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/upload",uploadRoutes);

app.get("/api/config/paypal",(req,res)=>
  res.send({clientId: process.env.PAYPAL_CLIENT_ID})
);

// serve static files
const __dirname=path.resolve();// set __dirname to current directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

console.log(__dirname);

// Single service deployment - serve both API and static files
if(process.env.NODE_ENV === "production"){
  // Set static folder
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  // Serve React app for all non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running in development mode...");
  });
}



app.use(notFound);
app.use(errorHandler);




app.listen(port,()=>{
  console.log(`Server is listening on port ${port}.`);
})