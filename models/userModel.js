import { Schema, model } from "mongoose";
import {
  addressSchema,
  emailSchema,
  nameSchema,
  passwordSchema,
  phoneSchema,
  resetPasswordSchema,
  tokenSchema,
  verificationSchema,
} from "./globalSchema.js";

const userSchema = new Schema(
  {
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    phone: phoneSchema,
    address: { type: addressSchema },
    tokens: [tokenSchema],
    verification: { type: verificationSchema },
    role: { type: String, default: "user" },
    resetPassword: { type: resetPasswordSchema },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const user = model("User", userSchema);
export default user;
