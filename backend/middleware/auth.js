import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/auth/UserModel.js";

export const protect = asyncHandler(async (req, res, next) => {
  try {
    // Check if user is logged in
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, please login!" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user details from the token ----> exclude password
    const user = await User.findById(decoded.id).select("-password");

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Set user details in the request object
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed!" });
  }
});

// Admin middleware
export const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    // If user is admin, move to the next middleware/controller
    next();
    return;
  }

  // If not admin, send 403 Forbidden --> terminate the request
  res.status(401).json({ message: "Only admins can do this!" });
});

// Creator middleware
export const creatorMiddleware = asyncHandler(async (req, res, next) => {
  if (
    (req.user && req.user.role === "creator") ||
    (req.user && req.user.role === "admin")
  ) {
    // If user is creator, move to the next middleware/controller
    next();
    return;
  }

  // If not creator, send 403 Forbidden --> terminate the request
  res.status(401).json({ message: "Only creators can do this!" });
});
