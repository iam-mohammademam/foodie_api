import { Router } from "express";
import { register } from "../controllers/merchant/register.js";
import { login } from "../controllers/merchant/login.js";

const merchant = Router();

merchant.post("/register", register);
merchant.post("/login", login);

export default merchant;
