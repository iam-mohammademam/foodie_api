import dishModel from "../../models/dishModel.js";
import { handleStatus } from "../../utils/utils.js";

// Helper function to build the search query
const buildSearchQuery = (query) => {
  const searchQuery = {};
  // Search by dish name (case-insensitive)
  if (query.name) {
    searchQuery.name = { $regex: query.name, $options: "i" }; // Case-insensitive search
  } // Search by ingredients (case-insensitive)
  if (query.ingredients) {
    searchQuery.ingredients = { $regex: query.ingredients, $options: "i" };
  } // Price range filter (minPrice and maxPrice)
  if (query.minPrice || query.maxPrice) {
    searchQuery.price = {};
    if (query.minPrice) searchQuery.price.$gte = parseFloat(query.minPrice);
    if (query.maxPrice) searchQuery.price.$lte = parseFloat(query.maxPrice);
  } // Search by category (e.g., vegetarian, non-vegetarian, etc.)
  if (query.category) {
    searchQuery.category = query.category;
  }
  return searchQuery;
}; // Helper function to apply sorting
const buildSorting = (sortBy) => {
  const sorting = {};
  if (sortBy) {
    const [field, order] = sortBy.split(":"); // Expected format: 'field:asc' or 'field:desc'
    sorting[field] = order === "asc" ? 1 : -1;
  }
  return sorting;
}; // Helper function to build selected fields for projection
const buildFieldSelection = (fields) => {
  const selectedFields = {};
  if (fields) {
    fields.split(",").forEach((field) => {
      selectedFields[field] = 1;
    });
  }
  return selectedFields;
}; // Controller function to handle the advanced search
export const searchDishes = async (req, res) => {
  try {
    // Extract query parameters from the request
    const {
      name,
      ingredients,
      minPrice,
      maxPrice,
      category,
      sortBy,
      fields,
      page = 1,
      limit = 10,
    } = req.query;
    // Build the search query
    const searchQuery = buildSearchQuery({
      name,
      ingredients,
      minPrice,
      maxPrice,
      category,
    }); // Build sorting object
    const sorting = buildSorting(sortBy);
    // Build field selection object
    const fieldSelection = buildFieldSelection(fields);
    // Pagination
    const skip = (page - 1) * limit;
    // Execute the query
    const dishes = await dishModel
      .find(searchQuery)
      .select(fieldSelection) // Fields to include in the response
      .sort(sorting) // Sorting order
      .skip(skip) // Skip for pagination
      .limit(Number(limit)); // Limit results
    // Get total count of matching dishes (for pagination)
    const totalDishes = await dishModel.countDocuments(searchQuery);
    // Send the response with data and pagination info
    return res.status(200).json({
      results: dishes,
      totalPages: Math.ceil(totalDishes / limit),
      currentPage: Number(page),
      pageSize: Number(limit),
    });
  } catch (err) {
    console.error("error searching dishes:", err.message);
    return handleStatus(res, 500, err.message || "Error searching dishes.");
  }
};
