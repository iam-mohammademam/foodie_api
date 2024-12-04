import { Router } from "express";
import { createDish } from "../controllers/dishes/create.js";
import { getAllDishes, getDishById } from "../controllers/dishes/get.js";
import { deleteDish } from "../controllers/dishes/delete.js";
const dish = Router();
// Route to create a new dish
dish.post("/create", createDish);
dish.get("/list", getAllDishes);
dish.put("/update/:id", deleteDish);
dish.delete("/delete/:id", deleteDish);
dish.get("/:id", getDishById);
export default dish;
