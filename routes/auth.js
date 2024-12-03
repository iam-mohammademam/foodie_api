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
const auth = Router();

auth.put("/verify", verifyEmail);
auth.put("/update", updateData);
auth.put("/update-password", updatePassword);
auth.put("/update-address", updateAddress);
auth.post("/forgot-password", sendResetPasswordEmail);
auth.put("/reset-password", resetPassword);

export default auth;
