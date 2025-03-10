import asyncHandler from "../middleware/asyncHandler.js";
import User from '../models/userModel.js';
import jwt from "jsonwebtoken";
import generateToken from "../utils/tokengeneration.js";



// @desc Auth user && get token
// @route POST /api/users/login
// @access public

const authUser=asyncHandler(async(req,res)=>{
  // destructure the email and pwd
  const { email, password } = req.body

   const user = await User.findOne({ email });
  // console.log(user)
  if(user && (await user.matchPassword(password))){
    // jsonwebtoke setup
    generateToken(res,user._id)
    // const token=jwt.sign({useId:user._id},process.env.JWT_SECRET,{
    //   expiresIn:"10d",
    // })

    // // cookie named jwt, and set the cookie options
    // res.cookie("jwt",token,{
    //   httpOnly:true,
    //   secure: process.env.NODE_ENV !== "development",
    //   sameSite:"none",
    //   maxAge: 10 * 24 * 60 *60 * 1000 //to be 10days
    // })

    return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
  }
  res.status(401)
  throw new Error("Invalid email or password!")



  // res.send("Auth User!")
})


// @desc  Registration
// @route POST /api/users/register
// @access public

const registrationOfUser=asyncHandler(async(req,res)=>{
  // res.send("register User!")
  const {email,name,password}=req.body;

  const isUserExists=await User.findOne({email});

  if(isUserExists){
    res.status(400);
    throw new Error("User already exists!")
  }

  const user=await User.create({
    name,
    email,
    password,
  })

  // check if user created
  if(user){
    generateToken(res,user._id)
    res.status(200).json({
      _id:user._id,
      name:user.name,
      email:user.email,
      isAdmin:user.isAdmin,
    })
  }else{
    res.status(400);
    throw new Error("Invalid user data!")
  }
})


// @desc  logout / clear cookies
// @route POST /api/users/logout
// @access private

const logOut=asyncHandler(async(req,res)=>{
  // res.send("logout User!")
  res.cookie("jwt","",{
      httpOnly:true,
      expires:new Date(0)
  })

  res.status(200).json({message:"Logged out successfully"})

})

// @desc  get user profile
// @route GET /api/users/profile
// @access private

const getUserProfile=asyncHandler(async(req,res)=>{
  // res.send("get profile!")
  const user=await User.findById(req.user._id);

  if(user){
    res.status(200).json({
      _id:user._id,
      name:user.name,
      email:user.email,
      isAdmin:user.isAdmin,
    })

    res.status(404)
    throw new Error("User not found.")
  }
})

// @desc  update user profile
// @route PUT /api/users/profile
// @access private/user self

const updateUserProfile=asyncHandler(async(req,res)=>{
  // res.send("update user profile!")
  const user=await User.findById(req.user._id);

  if(user){
    user.name = req.body.name || user.name;
    user.email= req.body.email || user.email;

    // if there is password in the req body
    if(req.body.password){
      user.password=req.body.password;
    }

    const updatedUser=await user.save();
    // return res.json(updatedUser)
    return res.status(200).json({
      _id:updatedUser._id,
      name:updatedUser.name,
      email:updatedUser.email,
      isAdmin:updatedUser.isAdmin,
    })
  }else{
    res.status(404)
    throw new Error("User not found")
  }

})

//
// @desc  get users
// @route GET /api/users
// @access private/Admin

const getUsers=asyncHandler(async(req,res)=>{
  const users=await User.find({})
  res.status(200).json(users)
  // res.send("get users!")
})


// @desc  get users by ID
// @route GET /api/users/:id
// @access private/Admin

const getUserById=asyncHandler(async(req,res)=>{
  // res.send("Get user")
  const user=await User.findById(req.params.id).select("-password");

  if(user){
    return res.status(200).json(user);
  }else{
    res.status(404).json("User not exist!");
  };
});

// @desc  Delete user
// @route GET /api/users/:id
// @access private/Admin

const deleteUserById=asyncHandler(async(req,res)=>{
  // res.send("delete user")
  const user = await User.findById(req.params.id);
  if(user){
    if(user.isAdmin){
      res.status(400).json("Cannot delete admin!")
    }
    await User.deleteOne({_id:user._id});
    return res.status(200).json({message:"User is deleted successfully!"})
  }else{
    res.status(404).json("User not exist!");
  }
})


// @desc  update user
// @route PUT /api/users/:id
// @access private/Admin

const updateUserById=asyncHandler(async(req,res)=>{
  // res.send("update user")
  const user=await User.findById(req.params.id);
  if(user){
    user.name =req.body.name || user.name;
    user.email =req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin)

    const updatedUser = await user.save();
    return res.status(201).json(updatedUser).select("-password");
  }else{
    res.status(404).json("User not exist!");
  }
})



export {
  authUser,
  registrationOfUser,
  deleteUserById,
  updateUserById,
  getUserById,
  getUsers,
  logOut,
  updateUserProfile,
  getUserProfile
}