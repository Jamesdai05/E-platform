import express from 'express';
import {
  authUser,
  registrationOfUser,
  deleteUserById,
  updateUserById,
  getUserById,
  getUsers,
  logOut,
  updateUserProfile,
  getUserProfile } from '../controllers/userController.js';
import { adminRoute, protectRoute } from '../middleware/authMiddleware.js';




const router=express.Router()

// fetch users and registration
router.route("/").post(registrationOfUser).get(protectRoute,adminRoute,getUsers);


// logout
router.post("/logout",logOut)

// login
router.post("/login",authUser)

// get user profile and update user profile
router.route("/profile").get(protectRoute,getUserProfile).put(protectRoute,updateUserProfile)

// admin function
router.route("/:id").get(protectRoute,adminRoute,getUserById).delete(protectRoute,adminRoute,deleteUserById).put(protectRoute,adminRoute,updateUserById)


export default router