import asyncHandler from "express-async-handler";
import User from "../models/auth/UserModel.js";

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  //attempt to delete user
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (error) {
    console.log("Error deleting user: ", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});
