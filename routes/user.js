import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../controllers/userController.js";
const user = Router();

user.post("/register", registerUser);
user.post("/login", loginUser);
user.post("/logout", logoutUser);
user.put("/update", updateUser);

export default user;
