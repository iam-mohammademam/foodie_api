import { Router } from "express";
import { getAllData, postData } from "../controllers/dishController.js";

const dish = Router();

dish.post("/", postData);
dish.get("/list", getAllData);

export default dish;
