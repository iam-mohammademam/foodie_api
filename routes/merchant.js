import { Router } from "express";
import { register } from "../controllers/merchant/register.js";

const merchant = Router();

merchant.post("/register", register);

export default merchant;
