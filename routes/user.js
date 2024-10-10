import { Router } from "express";
import {
  deleteUser,
  login,
  register,
  verifyUser,
} from "../controllers/userController.js";

const user = Router();

user.post("/register", register);
user.post("/login", login);
user.put("/verify", verifyUser);
user.delete("/delete", deleteUser);

export default user;
