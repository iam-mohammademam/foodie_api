import { Router } from "express";
import {
  deleteRestaurant,
  getAllRestaurant,
  postRestaurant,
  updateRestaurant,
} from "../controllers/restaurantController.js";

const restaurant = Router();

restaurant.get("/list", getAllRestaurant);
restaurant.post("/", postRestaurant);
restaurant.put("/", updateRestaurant);
restaurant.delete("/", deleteRestaurant);

export default restaurant;
