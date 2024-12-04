import { Router } from "express";

import { verifyEmail } from "../controllers/all/verify.js";
import {
  updateAddress,
  updateData,
  updatePassword,
} from "../controllers/all/update.js";
import {
  resetPassword,
  sendResetPasswordEmail,
} from "../controllers/all/resetPassword.js";
import { login } from "../controllers/all/login.js";
import { logout } from "../controllers/all/logout.js";
import { deleteAccount } from "../controllers/all/delete.js";
import { resendOtp } from "../controllers/all/resendOtp.js";
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
