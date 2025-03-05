import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";


const protectRoute=asyncHandler(
  async(req,res,next)=>{

    //read token from the cookies in the header,the same name as the one used in res.cookies
  const token=req.cookies.jwt;

  if(token){
    try{
      // decoded userid is the respective userID
      const decoded=jwt.verify(token,process.env.JWT_SECRET);
      // this allow for the other steps and show only required info without password.
      req.user = await User.findById(decoded.useId).select("-password")
      console.log(req.user)
      next();
    }catch(e){
      console.log(e);
      res.status(401);
      throw new Error("Unauthorized login,token failed")
    }
  }else{
    res.status(401);
    throw new Error("Unauthorized login,no token")
  }
})

// Admin middleware
const admin=(req,res,next)=>{
  req.user={name:"James",isAdmin:true}
  // console.log(req.user)
  if(req.user && req.user.isAdmin){
    return next()
  }
  res.status(403);
  throw new Error("Not authorized as admin!")
}


export {
  protectRoute,
  admin,
}