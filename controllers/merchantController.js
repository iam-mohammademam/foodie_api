import merchant from "../models/merchantModel.js";
import userModel from "../models/userModel.js";
import { handleError, validateFields } from "../utils/utils.js";
// Adjust the path as per your project structure

// Register Function
export const registerMerchant = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    address,
    cuisineTypes,
    logo,
    banner,
    schedule,
  } = req.body;
  if (
    !name ||
    !email ||
    !password ||
    !phone ||
    !address ||
    !cuisineTypes ||
    !schedule
  ) {
    return validateFields(
      { name, email, password, phone, address, cuisineTypes, schedule },
      res
    );
  }
  try {
    // Check if email or phone already exists
    const existingMerchant = await merchant.findOne({
      $or: [{ email }, { phone }],
    });
    const existingUser = await userModel.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingMerchant || existingUser) {
      return handleError(res, "Email or phone already in use", 409);
    }
    // Create merchant
    const newMerchant = new merchant({
      name,
      email,
      phone,
      address,
      cuisineTypes,
      logo,
      banner,
      schedule,
    });
    // Hash the password
    await newMerchant.hashPassword(password);
    await newMerchant.verifyMerchant();
    await newMerchant.save();
    // exclude password from response
    const dataToReturn = newMerchant.toObject();
    delete dataToReturn.password;
    // Return success response
    return res.status(201).json({
      merchant: dataToReturn,
    });
  } catch (error) {
    console.error("Error registering merchant:", error.message);
    return handleError(res, error.message || "Internal server error");
  }
};
export const getAllMerchants = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "name",
      sortOrder = "asc",
      cuisineType,
      minRating = 0,
      maxRating = 5,
      isActive,
      isVerified,
      fields,
    } = req.query; // Destructure parameters from query string

    // Build query object dynamically
    const query = {};

    // Filter by cuisineType if provided
    if (cuisineType) {
      const cuisineTypesArray = cuisineType.includes(",")
        ? cuisineType.split(",").map((type) => type.trim().toLowerCase())
        : [cuisineType.trim().toLowerCase()];
      query.$text = { $search: cuisineTypesArray.join(" ") }; // Filter merchants with matching cuisine types
    }

    // Filter by rating range
    query.rating = { $gte: minRating, $lte: maxRating };

    // Filter by active/verified status
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (isVerified !== undefined) query.isVerified = isVerified === "true";

    // Sorting direction
    const sortDirection = sortOrder === "desc" ? -1 : 1;
    // Select fields
    const defaultFields = "_id name cuisineTypes banner schedule";
    const selectFields = fields
      ? `${defaultFields} ${fields.split(",").join(" ")}` // If fields are provided, concatenate with defaults
      : defaultFields; // If no fields are provided, just use the defaults

    // Paginate, sort, and apply the filters
    const merchants = await merchant
      .find(query)
      .select(selectFields) // Field selection (optional)
      .sort({ [sortBy]: sortDirection }) // Dynamic sorting
      .skip((page - 1) * limit) // Skip documents based on page number
      .limit(parseInt(limit)) // Limit to the number of results per page
      .exec();
    if (merchants.length === 0) {
      return handleError(res, "No merchants found.", 404);
    }
    // Get the total count of merchants for pagination
    const totalMerchants = await merchant.countDocuments(query);

    // Return the result with pagination metadata
    return res.status(200).json({
      data: merchants,
      totalItems: totalMerchants,
      totalPages: Math.ceil(totalMerchants / limit),
      currentPage: parseInt(page),
      itemsPerPage: parseInt(limit),
    });
  } catch (error) {
    console.error("Error fetching merchants:", error);
    return handleError(res, error.message || "Internal server error");
  }
};
