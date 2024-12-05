import { Router } from "express";
import { createDish } from "../controllers/dishes/create.js";
import { getAllDishes, getDishById } from "../controllers/dishes/get.js";
import { deleteDish } from "../controllers/dishes/delete.js";
import { updateDish } from "../controllers/dishes/update.js";
import { searchDishes } from "../controllers/dishes/search.js";
const dish = Router();
// Route to create a new dish
dish.post("/create", createDish);
dish.get("/list", getAllDishes);
dish.get("/search", searchDishes);
dish.put("/update/:id", updateDish);
dish.delete("/delete/:id", deleteDish);
dish.get("/:id", getDishById);
export default dish;
