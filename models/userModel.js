import { Schema, model } from "mongoose";
import { tokenSchema } from "../utils/utils.js";
import { addressSchema } from "./globalSchema.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (email) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Prevent password from being returned in queries
    },
    phone: {
      type: String,
      validate: {
        validator: (phone) => /^\d{10,15}$/.test(phone),
        message: "Phone number must be between 10-15 digits",
      },
    },
    address: { type: addressSchema },
    role: { type: String, default: "user" },
    tokens: [tokenSchema],
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Delete user
userSchema.methods.deleteUser = async function () {
  await this.deleteOne();
};

export default model("User", userSchema);
