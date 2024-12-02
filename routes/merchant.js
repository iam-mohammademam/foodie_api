import { Router } from "express";
import { register } from "../controllers/merchant/register.js";
import { verifyEmail } from "../controllers/merchant/verify.js";
import { login } from "../controllers/merchant/login.js";

const merchant = Router();

merchant.post("/register", register);
merchant.put("/verify", verifyEmail);
merchant.post("/login", login);
// merchant.put("/update", updateMerchant);
// merchant.get("/list", getMerchants);
// merchant.get("/:id", getMerchantById);
export default merchant;
