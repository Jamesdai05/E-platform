import mongoose from "mongoose";

const connectDB=async()=>{
  try{
    const dbConnect=await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongodb connected:${dbConnect.connection.host}`);
  }catch(err){
    console.log(`Error:${err.message}`)
    process.exit(1)
  }
}

export default connectDB;