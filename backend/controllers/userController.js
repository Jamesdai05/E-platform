import asyncHandler from "../middleware/asyncHandler.js";
import User from '../models/userModel.js';
import jwt from "jsonwebtoken";
import generateToken from "../utils/tokengeneration.js";

const normalizeEmail = (email) => email.trim().toLowerCase();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Tries the exact address first, then ignores capitals, so accounts saved before
// emails were stored in lowercase can still be found.
const findUserByEmail = async (email) =>
  (await User.findOne({ email })) ||
  User.findOne({ email }).collation({ locale: "en", strength: 2 });

// Changes a user's email if it is really different, refusing bad or taken addresses
const applyEmailChange = async (user, newEmail, res) => {
  if (!newEmail) return;

  if (typeof newEmail !== "string" || !isValidEmail(normalizeEmail(newEmail))) {
    res.status(400);
    throw new Error("Please enter a valid email address");
  }

  const email = normalizeEmail(newEmail);
  if (email === user.email.toLowerCase()) return;

  if (await findUserByEmail(email)) {
    res.status(400);
    throw new Error("Email is already in use");
  }
  user.email = email;
};

// Rules for a new password, returning the problem or null. Login does not use this,
// so accounts with an older, shorter password can still sign in.
const getPasswordError = (password) => {
  if (typeof password !== "string" || password.length < 8) {
    return "Password must be at least 8 characters";
  }
  // bcrypt ignores everything after 72 bytes
  if (Buffer.byteLength(password) > 72) {
    return "Password must be at most 72 characters";
  }
  return null;
};



// @desc Auth user && get token
// @route POST /api/users/login
// @access public

const authUser=asyncHandler(async(req,res)=>{
  // destructure the email and pwd
  const { email, password } = req.body

  // Only plain strings: an object like {"$ne":""} would run as a database query
  if(typeof email !== "string" || typeof password !== "string"){
    res.status(401)
    throw new Error("Invalid email or password!")
  }

   const user = await findUserByEmail(email.trim());
  // console.log(user)
  if(user && (await user.matchPassword(password))){
    // jsonwebtoke setup
    generateToken(res,user._id)
    // const token=jwt.sign({useId:user._id},process.env.JWT_SECRET,{
    //   expiresIn:"10d",
    // })



    return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        // isDisabled: user.isDisabled,
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
  const {name,password}=req.body;

  if(typeof req.body.email !== "string" || typeof name !== "string" || typeof password !== "string"){
    res.status(400);
    throw new Error("Invalid user data!")
  }

  const email=normalizeEmail(req.body.email);

  if(!isValidEmail(email)){
    res.status(400);
    throw new Error("Please enter a valid email address")
  }

  const passwordError=getPasswordError(password);
  if(passwordError){
    res.status(400);
    throw new Error(passwordError)
  }

  const isUserExists=await findUserByEmail(email);

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
    return res.status(200).json({
      _id:user._id,
      name:user.name,
      email:user.email,
      isAdmin:user.isAdmin,
    })
  }

  res.status(404)
  throw new Error("User not found.")
})

// @desc  update user profile
// @route PUT /api/users/profile
// @access private/user self

const updateUserProfile=asyncHandler(async(req,res)=>{
  // res.send("update user profile!")
  const user=await User.findById(req.user._id);

  if(user){
    user.name = req.body.name || user.name;
    await applyEmailChange(user,req.body.email,res);

    // if there is password in the req body
    if(req.body.password){
      const passwordError=getPasswordError(req.body.password);
      if(passwordError){
        res.status(400);
        throw new Error(passwordError)
      }
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
  const users=await User.find({}).select("-password")
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
      return res.status(400).json({message:"Cannot delete admin!"})
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
    await applyEmailChange(user,req.body.email,res);
    // leaving isAdmin out of the request must not remove admin rights
    if(req.body.isAdmin !== undefined){
      user.isAdmin = Boolean(req.body.isAdmin)
    }

    const updatedUser = await user.save();
    return res.status(201).json({
      _id:updatedUser._id,
      name:updatedUser.name,
      email:updatedUser.email,
      isAdmin:updatedUser.isAdmin,
    });
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