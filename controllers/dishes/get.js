import { handleStatus } from "../../utils/utils.js";
import dishModel from "../../models/dishModel.js";

export const getDishById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return handleStatus(res, 400, "Dish ID is required.");
  }
  try {
    const dish = await dishModel.findById(id).populate("merchant", "name _id");
    if (!dish) {
      return handleStatus(res, 404, "Dish not found.");
    }
    const dishFormatted = await dish.format();
    return handleStatus(res, 200, "", dishFormatted);
  } catch (error) {
    console.error("Error retrieving dishes:", error.message);
    return handleStatus(res, 500, error.message);
  }
};
export const getAllDishes = async (req, res) => {
  try {
    const dishes = await dishModel.find().populate("merchant", "name _id");
    if (!dishes.length) {
      return handleStatus(res, 404, "Dishes not found.");
    }
    const dishesFormatted = dishes.map((dish) => dish.format());
    return handleStatus(res, 200, "", dishesFormatted);
  } catch (error) {
    console.error("Error retrieving dishes:", error.message);
    return handleStatus(res, 500, error.message);
  }
};
