import { Schema, model } from "mongoose";
import {
  addressSchema,
  emailSchema,
  nameSchema,
  passwordSchema,
  phoneSchema,
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
    resetPassword: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const user = model("User", userSchema);
export default user;
