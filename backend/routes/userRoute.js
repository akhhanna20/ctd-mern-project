import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  userLoginStatus,
} from "../controllersAuth/userController.js";
import {
  adminMiddleware,
  creatorMiddleware,
  protect,
} from "../middleware/auth.js";
import { deleteUser, getAllUsers } from "../controllersAuth/adminController.js";
// import {
//   changePassword,
//   forgotPassword,
//   getUser,
//   loginUser,
//   logoutUser,
//   registerUser,
//   resetPassword,
//   updateUser,
//   userLoginStatus,
//   verifyEmail,
//   verifyUser,
// } from "../controllersAuth/auth/userController.js";
// import {
//   adminMiddleware,
//   creatorMiddleware,
//   protect,
// } from "../middleware/authMiddleware.js";
// import {
//   deleteUser,
//   getAllUsers,
// } from "../controllersAuth/auth/adminController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);

// admin route
router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);

// get all users
router.get("/admin/users", protect, adminMiddleware, getAllUsers);

// login status
router.get("/login-status", userLoginStatus);

// //reset password
// router.post("/reset-password/:resetPasswordToken", resetPassword);

// // change password ---> user must be logged in
// router.patch("/change-password", protect, changePassword);

export default router;
