import { Router } from "express";
import {
  getMerchantById,
  getMerchants,
  loginMerchant,
  registerMerchant,
} from "../controllers/merchantController.js";
const merchant = Router();

merchant.get("/:id", getMerchantById);
merchant.post("/register", registerMerchant);
merchant.post("/login", loginMerchant);
merchant.get("/list", getMerchants);
export default merchant;
