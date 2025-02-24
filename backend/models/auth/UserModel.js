import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },

    email: {
      type: String,
      required: [true, "Please an email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add password!"],
    },

    role: {
      type: String,
      enum: ["user", "admin", "creator"],
      default: "user",
    },
  },
  { timestamps: true, minimize: true }
);

// hash the password before saving
UserSchema.pre("save", async function (next) {
  // check if the password is not modified
  if (!this.isModified("password")) return next();
  try {
    // hash the password  ==> bcrypt
    // generate salt
    const salt = await bcrypt.genSalt(10);
    // hash the password with the salt
    const hashedPassword = await bcrypt.hash(this.password, salt);
    // set the password to the hashed password
    this.password = hashedPassword;

    // call the next middleware
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);

export default User;
