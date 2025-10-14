import mongoose from "mongoose";
// import seed

const connectDB=async()=>{
  try{
    // const dbConnect=await mongoose.connect(process.env.MONGO_URI);
    const dbConnect=await mongoose.connect(process.env.MONGO_URI_LOCAL);
    // console.log(dbConnect)
    // console.log(`connect to mongodb ${dbConnect.connection.name} ${dbConnect.connection.host}:${dbConnect.connection.port}`);
    console.log(`Mongodb connected:${dbConnect.connection.host}`);
  }catch(err){
    console.log(`Error:${err.message}`)
    process.exit(1)
  }
}

export default connectDB;