import { Router } from "express";
import {
  getAllMerchants,
  registerMerchant,
} from "../controllers/merchantController.js";
const merchant = Router();

merchant.post("/register", registerMerchant);
merchant.get("/list", getAllMerchants);
export default merchant;
