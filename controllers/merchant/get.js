import {
  getQueryObject,
  getSelectFields,
  handleStatus,
} from "../../utils/utils.js";
import merchantModel from "../../models/merchantModel.js";

export const getMerchants = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "name",
    sortOrder = "asc",
    name,
    cuisineType,
    minRating = 0,
    maxRating = 5,
    isActive,
    isVerified,
    fields,
  } = req.query; // Destructure parameters from query string
  try {
    // Build query object dynamically
    const query = getQueryObject({
      cuisineType,
      name,
      minRating,
      maxRating,
      isActive,
      isVerified,
    });

    // Sorting direction
    const sortDirection = sortOrder === "desc" ? -1 : 1;
    // Select fields
    const selectFields = getSelectFields(fields);
    // Paginate, sort, and apply the filters
    const merchants = await merchantModel
      .find(query)
      .select(selectFields) // Field selection (optional)
      .sort({ [sortBy]: sortDirection }) // Dynamic sorting
      .skip((page - 1) * limit) // Skip documents based on page number
      .limit(parseInt(limit)) // Limit to the number of results per page
      .exec();
    if (!merchants) {
      return handleStatus(res, 404, "No merchant found.");
    }
    // Get the total count of merchants for pagination
    const totalMerchants = await merchantModel.countDocuments(query);

    // Return the result with pagination metadata
    return res.status(200).json({
      results: merchants,
      totalItems: totalMerchants,
      totalPages: Math.ceil(totalMerchants / limit),
      currentPage: parseInt(page),
      itemsPerPage: parseInt(limit),
    });
  } catch (error) {
    console.error("Error fetching merchants:", error);
    return handleStatus(res, 500, error.message || "Error fetching merchants.");
  }
};
export const getMerchantById = async (req, res) => {
  const { id } = req.params;
  const fields = getSelectFields(req.query.fields);
  try {
    const merchant = await merchantModel.findById(id).select(fields).exec();
    if (!merchant) {
      return handleStatus(res, 404, "No merchant found.");
    }
    return handleStatus(res, 200, "", merchant);
  } catch (error) {
    console.error("Error fetching merchant by id.", error);
    return handleStatus(res, 500, error.message || "Error fetching merchant");
  }
};
