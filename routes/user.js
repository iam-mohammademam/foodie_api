import { Router } from "express";
import { deleteUser, login, register } from "../controllers/userController.js";

const user = Router();

user.post("/register", register);
user.post("/login", login);
user.delete("/delete", deleteUser);

export default user;
