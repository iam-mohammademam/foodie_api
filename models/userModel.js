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
    f2a: { type: Boolean, default: false },
  },
  { timestamps: true }
);
userSchema.methods.format = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    address: this.address,
    role: this.role,
    tokens: this.tokens,
    isVerified: this.isVerified,
    f2a: this.f2a,
  };
};
const user = model("User", userSchema);
export default user;
