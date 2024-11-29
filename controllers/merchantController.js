import merchantModel from "../models/merchantModel.js";
import userModel from "../models/userModel.js";
import {
  getQueryObject,
  getSelectFields,
  handleError,
  validateFields,
} from "../utils/utils.js";

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
    const existingMerchant = await merchantModel.findOne({
      $or: [{ email }, { phone }],
    });
    const existingUser = await userModel.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingMerchant || existingUser) {
      return handleError(res, "Email or phone already in use", 409);
    }
    // Create merchantModel
    const newMerchant = new merchantModel({
      name,
      email,
      phone,
      address,
      cuisineTypes,
      logo,
      banner,
      schedule,
    });

    await newMerchant.generateAuthToken();
    await newMerchant.hashPassword(password);
    await newMerchant.verifyMerchant();
    await newMerchant.save();
    // exclude password from response
    const dataToReturn = newMerchant.toObject();
    delete dataToReturn.password;
    // Return success response
    return res.status(201).json({
      merchantModel: dataToReturn,
    });
  } catch (error) {
    console.error("Error registering merchantModel:", error.message);
    return handleError(res, error.message || "Internal server error");
  }
};
export const loginMerchant = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return validateFields({ email, password }, res);
  }
  const fields = getSelectFields(req.query.fields);
  try {
    const findMerchant = await merchantModel
      .findOne({ email })
      .select(`password tokens ${fields}`);
    if (!findMerchant) {
      return handleError(res, "No account found for this email.", 404);
    }

    await findMerchant.validatePassword(password);
    await findMerchant.generateAuthToken();
    const dataToReturn = findMerchant.toObject();
    delete dataToReturn.password;

    return res.status(200).json({ results: dataToReturn });
  } catch (error) {
    console.error("Login Error:", error);
    return handleError(res, error.message || "Failed to login.");
  }
};
export const updateMerchant = async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, password, newPassword } = req.body;
  const { token } = req.headers;

  if (!token) {
    return validateFields({ token }, res);
  }

  try {
    const findMerchant = await merchantModel.findById(id);
    if (!findMerchant) {
      return handleError(res, "Merchant not found.", 404);
    }

    await findMerchant.verifyAuthToken(token);

    await findMerchant.validatePassword(password);

    if (newPassword) await findMerchant.updatePassword(password, newPassword);

    if (name) findMerchant.name = name;
    if (address) findMerchant.address = address;

    await findMerchant.save();

    const updatedMerchant = findMerchant.toObject();
    delete updatedMerchant.password;

    return res.status(200).json({
      message: "Merchant updated successfully.",
      merchantModel: updatedMerchant,
    });
  } catch (error) {
    console.error("Update Error:", error);
    return handleError(res, error.message || "Failed to update merchantModel.");
  }
};
export const getMerchants = async (req, res) => {
  try {
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
    if (merchants.length === 0) {
      return handleError(res, "No merchants found.", 404);
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
    return handleError(res, error.message || "Internal server error");
  }
};
export const getMerchantById = async (req, res) => {
  const { id } = req.params;
  const fields = getSelectFields(req.query.fields);
  try {
    const findMerchant = await merchantModel.findById(id).select(fields);
    if (!findMerchant) {
      return handleError(res, "Merchant not found.", 404);
    }
    return res.status(200).json({ results: findMerchant });
  } catch (error) {
    console.error("Error fetching merchantModel:", error);
    return handleError(res, error.message || "Internal server error");
  }
};
