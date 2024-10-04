import { Router } from "express";
import { login, register } from "../controllers/userController";

const user = Router();

user.post("/register", register);
user.post("/login", login);

export default user;
