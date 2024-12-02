import { Router } from "express";
import {
  getMerchantById,
  getMerchants,
  loginMerchant,
  registerMerchant,
  updateMerchant,
  verifyEmail,
} from "../controllers/merchantController.js";
const merchant = Router();

merchant.post("/register", registerMerchant);
merchant.put("/verify", verifyEmail);
merchant.post("/login", loginMerchant);
merchant.put("/update", updateMerchant);
merchant.get("/list", getMerchants);
merchant.get("/:id", getMerchantById);
export default merchant;
