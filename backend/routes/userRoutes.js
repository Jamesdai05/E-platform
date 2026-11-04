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
import { admin, protectRoute } from '../middleware/authMiddleware.js';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';




const router=express.Router()

// Limits password guessing. Only failed attempts count, and each email has its own
// count, so customers behind one IP address do not lock each other out.
const loginLimiter=rateLimit({
  windowMs:15*60*1000,
  limit:10,
  skipSuccessfulRequests:true,
  standardHeaders:true,
  legacyHeaders:false,
  keyGenerator:(req)=>`${ipKeyGenerator(req.ip)}:${String(req.body?.email).toLowerCase()}`,
  message:{message:"Too many failed login attempts. Please try again in 15 minutes."},
})

// Limits automated sign-ups. Successful ones count, unlike the login limit.
const registrationLimiter=rateLimit({
  windowMs:60*60*1000,
  limit:20,
  standardHeaders:true,
  legacyHeaders:false,
  message:{message:"Too many sign-ups. Please try again later."},
})

// fetch users and registration
router.route("/").post(registrationLimiter,registrationOfUser).get(protectRoute,admin,getUsers);


// logout
router.post("/logout",logOut)

// login
router.post("/login",loginLimiter,authUser)

// get user profile and update user profile
router.route("/profile").get(protectRoute,getUserProfile).put(protectRoute,updateUserProfile)

// admin function
router.route("/:id").get(protectRoute,admin,getUserById).delete(protectRoute,admin,deleteUserById).put(protectRoute,admin,updateUserById)


export default router