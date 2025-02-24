import asyncHandler from "express-async-handler";
import User from "../models/auth/UserModel.js";
import generateToken from "../helpers/generateToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// // user registration
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    // 400 Bad Request
    return res.status(400).json({ message: "All fields are required" });
  }

  // check password length
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  // check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    // bad request
    return res.status(400).json({ message: "User already exists" });
  }

  // create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  // generate token with user id
  const token = generateToken(user._id);

  // send back the user and token in the response to the client
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: "none", // cross-site access --> allow all third-party cookies
    secure: true,
  });

  if (user) {
    const { _id, name, email, role, isVerified } = user;
    res.status(201).json({ _id, name, email, role, token });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// user login
export const loginUser = asyncHandler(async (req, res) => {
  // get email and password from req.body
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    // 400 Bad Request
    return res.status(400).json({ message: "All fields are required" });
  }

  // check if user exists
  const userExists = await User.findOne({ email });

  if (!userExists) {
    return res.status(404).json({ message: "User not found, sign up!" });
  }

  // check id the password match the hashed password in the database
  const isMatch = await bcrypt.compare(password, userExists.password);

  if (!isMatch) {
    // 400 Bad Request
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // generate token with user id
  const token = generateToken(userExists._id);

  if (userExists && isMatch) {
    const { _id, name, email, role } = userExists;

    // set the token in the cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "none", // cross-site access --> allow all third-party cookies
      secure: true,
    });

    // send back the user and token in the response to the client
    res.status(200).json({
      _id,
      name,
      email,
      role,
      // isVerified,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid email or password" });
  }
});

// logout user
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });

  res.status(200).json({ message: "User logged out" });
});

// get user
export const getUser = asyncHandler(async (req, res) => {
  // get user details from the token ----> exclude password
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    // 404 Not Found
    res.status(404).json({ message: "User not found" });
  }
});

// update user
export const updateUser = asyncHandler(async (req, res) => {
  // get user details from the token ----> protect middleware
  const user = await User.findById(req.user._id);

  if (user) {
    // user properties to update
    const { name } = req.body;
    // update user properties
    user.name = req.body.name || user.name;

    const updated = await user.save();

    res.status(200).json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    });
  } else {
    // 404 Not Found
    res.status(404).json({ message: "User not found" });
  }
});

// login status
// export const userLoginStatus = asyncHandler(async (req, res) => {
//   const token = req.cookies?.token;

//   if (!token) {
//     // 401 Unauthorized
//     res.status(401).json({ message: "Not authorized, please login!" });
//   }
//   // verify the token
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);

//   if (decoded) {
//     res.status(200).json(true);
//   } else {
//     res.status(401).json(false);
//   }
// });
//=====
// export const userLoginStatus = asyncHandler(async (req, res) => {
//   const token = req.cookies?.token;

//   if (!token) {
//     return res.status(200).json({ isAuthenticated: false });
//   }

//   try {
//     // verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (decoded) {
//       return res.status(200).json({ isAuthenticated: true });
//     } else {
//       return res.status(200).json({ isAuthenticated: false });
//     }
//   } catch (error) {
//     return res.status(200).json({ isAuthenticated: false });
//   }
// });
// export const userLoginStatus = asyncHandler(async (req, res) => {
//   const token = req.cookies?.token;

//   // If there's no token, the user is not authenticated
//   if (!token) {
//     return res.status(200).json({ isAuthenticated: false });
//   }

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // If token is valid, user is authenticated
//     if (decoded) {
//       return res.status(200).json({ isAuthenticated: true });
//     } else {
//       return res.status(200).json({ isAuthenticated: false });
//     }
//   } catch (error) {
//     // If an error occurs while verifying token (e.g., invalid token), return false
//     return res.status(200).json({ isAuthenticated: false });
//   }
// });
export const userLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies?.token;

  // If there's no token, return Unauthorized
  if (!token) {
    return res
      .status(200)
      .json({ isAuthenticated: false, message: "Unauthorized" });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded) {
      return res
        .status(200)
        .json({ isAuthenticated: true, user: decoded.userId });
    } else {
      return res
        .status(200)
        .json({ isAuthenticated: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res
      .status(200)
      .json({ isAuthenticated: false, message: "Invalid or expired token" });
  }
});
