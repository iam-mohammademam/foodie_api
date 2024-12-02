import { Router } from "express";

import { verifyEmail } from "../controllers/user/verify.js";
import { register } from "../controllers/user/register.js";
import { login, logout } from "../controllers/user/login&out.js";
import {
  updateAddress,
  updatePassword,
  updateUser,
} from "../controllers/user/update.js";
import { deleteUser } from "../controllers/user/delete.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/user/resetPassword.js";
//
const user = Router();
//
user.post("/register", register);
user.post("/login", login);
user.put("/verify", verifyEmail);
user.post("/logout", logout);
user.put("/update", updateUser);
user.put("/update-password", updatePassword);
user.put("/update-address", updateAddress);
user.post("/reset-password", resetPassword);
user.put("/forgot-password", forgotPassword);
user.delete("/delete", deleteUser);

export default user;
