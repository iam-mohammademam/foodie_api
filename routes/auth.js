import { Router } from "express";

import { verifyEmail } from "../controllers/auth/verify.js";
import {
  updateAddress,
  updateData,
  updatePassword,
} from "../controllers/auth/update.js";
import {
  resetPassword,
  sendResetPasswordEmail,
} from "../controllers/auth/resetPassword.js";
import { login } from "../controllers/auth/login.js";
import { logout } from "../controllers/auth/logout.js";
import { deleteAccount } from "../controllers/auth/delete.js";
import { resendOtp } from "../controllers/auth/resendOtp.js";
//
const auth = Router();

// routes
auth.post("/login", login);
auth.post("/logout", logout);
auth.delete("/delete", deleteAccount);
auth.put("/verify", verifyEmail);
auth.get("/resend-otp", resendOtp);
auth.put("/update", updateData);
auth.put("/update-password", updatePassword);
auth.put("/update-address", updateAddress);
auth.post("/forgot-password", sendResetPasswordEmail);
auth.put("/reset-password", resetPassword);

export default auth;
