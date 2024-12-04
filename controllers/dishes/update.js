import { handleStatus, validateFields } from "../../utils/utils.js";
import dishModel from "../../models/dishModel.js";

export const updateDish = async (req, res) => {
  const { id } = req.params;
  const { merchant } = req.query;
  const {
    name,
    description,
    price,
    category,
    image,
    ratings,
    ingredients,
    availability,
  } = req.body;
  // Check if the merchant ID is provided
  if (!merchant) {
    return handleStatus(res, 400, "Merchant ID is required.");
  } // Check if the required fields are provided
  if (!name || !price || !category || !image) {
    return validateFields(
      {
        merchant,
        name,
        price,
        category,
        image,
      },
      res
    );
  }
  try {
    // Validate the price
    if (isNaN(price) || price <= 0) {
      return handleStatus(res, 400, "Price must be a positive number.");
    }
    // Find the existing dish by ID
    const dish = await dishModel.findById(id);
    if (!dish) {
      return handleStatus(res, 404, "Dish not found.");
    }
    // Check if the current user is the owner of the dish (merchant verification)
    if (dish.merchant.toString() !== merchant) {
      return handleStatus(
        res,
        403,
        "You are not authorized to update this dish."
      );
    }
    // Update the dish with the new fields
    const updatedDish = await dishModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        category,
        image,
        ratings,
        ingredients,
        availability,
      },
      { new: true }
    );

    // Format the updated dish
    const formattedDish = await updatedDish.format();
    // Respond with a success message and the updated dish data
    return handleStatus(res, 200, "Dish updated successfully", formattedDish);
  } catch (error) {
    console.error("Error updating dish:", error.message);
    return handleStatus(res, 500, error.message);
  }
};
