import { Router } from "express";

import { verifyEmail } from "../controllers/user/verify.js";
import { register } from "../controllers/user/register.js";
import { login, logout } from "../controllers/user/login&out.js";
import { deleteUser } from "../controllers/user/delete.js";
import {
  resetPassword,
  sendResetPasswordEmail,
} from "../controllers/all/resetPassword.js";
import {
  updateAddress,
  updateData,
  updatePassword,
} from "../controllers/all/update.js";

const user = Router();
// routes
user.post("/register", register);
user.post("/login", login);
user.put("/verify", verifyEmail);
user.post("/logout", logout);
user.put("/update", updateData);
user.put("/update-address", updateAddress);
user.put("/update-password", updatePassword);
user.post("/forgot-password", sendResetPasswordEmail);
user.put("/reset-password", resetPassword);
user.delete("/delete", deleteUser);

export default user;
