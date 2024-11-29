import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
const user = Router();

user.post("/register", registerUser);
user.post("/login", loginUser);
user.post("/logout", logoutUser);
user.put("/update", updateUser);
user.delete("/delete", deleteUser);

export default user;
