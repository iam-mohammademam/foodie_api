import { handleStatus, validateFields } from "../../utils/utils.js";
import dishModel from "../../models/dishModel.js"; // Import the Dish model

export const createDish = async (req, res) => {
  const { merchant } = req.headers;
  const { name, description, price, category, image, ratings, ingredients } =
    req.body;

  if (!name || !price || !category || !image || !merchant) {
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
    if (isNaN(price) || price <= 0) {
      return handleStatus(res, 400, "Price must be a positive number.");
    }
    // Create the dish
    const newDish = new dishModel({
      merchant,
      name,
      description,
      price,
      category,
      image,
      ratings,
      ingredients,
    });
    // Save the dish to the database
    const savedDish = await newDish.save();
    // format dish and send the response
    const dish = await savedDish.format();
    return handleStatus(res, 201, "", dish);
  } catch (error) {
    console.error("Error creating dish:", error.message);
    return handleStatus(
      res,
      500,
      error.message || "Failed to create the dish. Please try again."
    );
  }
};
