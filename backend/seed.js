import dotenv from "dotenv"
import connectDB from "./config/dbConnect.js";
import users from "./data/users.js";
import products from "./data/products.js";
import Order from "./models/orderModel.js";
import Product from "./models/productModel.js";
import User from "./models/userModel.js";

dotenv.config();

connectDB();

const importDB=async()=>{
  try {
    // reset database;
    await Order.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();

    //set the first user as admin
    const createUsers = await User.insertMany(users);
    const adminUser = createUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);
    console.log("data seeded!")
    process.exit()
  }catch(e){
    // log the error and exit the process
    console.error("Error seeding data:", e.message);
    process.exit(1);
  }
}

const deleteData =async()=>{
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log("data deleted!");
    process.exit();
  }catch(err){
    console.log(`${err}`);
    process.exit(1)
  }
}

if(process.argv[2]==="-d"){
  console.log(process.argv[2])
  deleteData();
}else{
  importDB()
}