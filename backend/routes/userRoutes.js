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
router.route("/").post(registrationOfUser).get(getUsers);


// logout
router.post("/logout",logOut)

// login
router.post("/login",authUser)

// get user profile and update user profile
router.route("/profile").get(protectRoute,getUserProfile).put(protectRoute,updateUserProfile)

// admin function
router.route("/:id").get(getUserById).delete(deleteUserById).put(updateUserById)


export default router