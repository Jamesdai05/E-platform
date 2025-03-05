import asyncHandler from "../middleware/asyncHandler.js";
import User from '../models/userModel.js';


// @desc Auth user && get token
// @route POST /api/users/login
// @access public

const authUser=asyncHandler(async(req,res)=>{
  // destructure the email and pwd
  const { email, password } = req.body

   const user = await User.findOne({ email });
  // console.log(user)
  if(user && (await user.matchPassword(password))){
     return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
  }
  res.status(401)
  throw new Error("Invalid email or password!")



  res.send("Auth User!")
})


// @desc  Registration
// @route POST /api/users/register
// @access public

const registrationOfUser=asyncHandler(async(req,res)=>{
  res.send("register User!")


})


// @desc  logout / clear cookies
// @route POST /api/users/logout
// @access private

const logOut=asyncHandler(async(req,res)=>{
  res.send("logout User!")

})

// @desc  get user profile
// @route GET /api/users/profile
// @access private

const getUserProfile=asyncHandler(async(req,res)=>{
  res.send("get profile!")


})

// @desc  update user profile
// @route PUT /api/users/profile
// @access private/user self

const updateUserProfile=asyncHandler(async(req,res)=>{
  res.send("update user profile!")

})

//
// @desc  get users
// @route GET /api/users
// @access private/Admin

const getUsers=asyncHandler(async(req,res)=>{
  const users=await User.find({})
  res.json(users)
  // res.send("get users!")
})


// @desc  get users by ID
// @route GET /api/users/:id
// @access private/Admin

const getUserById=asyncHandler(async(req,res)=>{
  res.send("Get user")
})

// @desc  Delete user
// @route GET /api/users/:id
// @access private/Admin

const deleteUserById=asyncHandler(async(req,res)=>{
  res.send("delete user")
})


// @desc  update user
// @route PUT /api/users/:id
// @access private/Admin

const updateUserById=asyncHandler(async(req,res)=>{
  res.send("update user")
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