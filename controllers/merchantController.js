import { nodemailer } from "../middlewares/nodemailer.js";
import merchantModel from "../models/merchantModel.js";
import userModel from "../models/userModel.js";
import {
  generateAuthToken,
  hashPassword,
  verifyOtp,
  addOtp,
  validatePassword,
  verifyAuthToken,
} from "../utils/handleSchema.js";
import {
  generateOtp,
  getQueryObject,
  getSelectFields,
  handleStatus,
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
      return handleStatus(res, 409, "Email or phone already in use");
    }
    const otp = generateOtp();
    // Create merchantModel
    const merchant = new merchantModel({
      name,
      email,
      phone,
      address,
      cuisineTypes,
      logo,
      banner,
      schedule,
    });

    await hashPassword(password, merchant);
    await addOtp(otp, merchant);
    await merchant.save();
    await generateAuthToken(merchant);

    // Send verification email
    await nodemailer(email, otp);

    // Return success response
    return handleStatus(res, 201, "Registration successful. Please verify.");
  } catch (error) {
    console.error("Error registering merchantModel:", error.message);
    return handleStatus(
      res,
      500,
      error.message || "Error registering merchant"
    );
  }
};
export const verifyEmail = async (req, res) => {
  const { id, otp } = req.body;
  if (!id || !otp) {
    return validateFields({ id, otp }, res);
  }

  try {
    const merchant = await merchantModel.findById(id);
    if (!merchant) {
      return handleStatus(res, 404, "Merchant not found");
    }

    await verifyOtp(otp, merchant);
    await merchant.save();

    return handleStatus(res, 200, "Email verified successfully", merchant);
  } catch (error) {
    console.error("Error verifying email:", error.message);
    return handleStatus(
      res,
      500,
      error.message || "Error verifying email merchant"
    );
  }
};
export const loginMerchant = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return validateFields({ email, password }, res);
  }
  const fields = getSelectFields(req.query.fields);
  try {
    const merchant = await merchantModel
      .findOne({ email })
      .select(`_id password tokens ${fields}`);
    if (!merchant) {
      return handleStatus(res, 404, "No account found for this email.");
    }
    if (!merchant.isVerified) {
      return handleStatus(res, 401, "Please verify your email first.");
    }
    await validatePassword(password, merchant);
    await generateAuthToken(merchant);
    const dataToReturn = merchant.toObject();
    delete dataToReturn.password;
    return handleStatus(res, 200, "", dataToReturn);
  } catch (error) {
    console.error("Login Error:", error);
    return handleStatus(res, 500, error.message || "Failed to login merchant");
  }
};
export const updateMerchant = async (req, res) => {
  const { id } = req.query;
  const { name, address, phone, password, newPassword } = req.body;
  const { token } = req.headers;

  if (!token || !id) {
    return validateFields({ token, id }, res);
  }

  try {
    const merchant = await merchantModel.findById(id);
    if (!merchant) {
      return handleStatus(res, 404, "Merchant not found.");
    }

    await verifyAuthToken(token, merchant);
    await validatePassword(password, merchant);

    if (newPassword) await hashPassword(password, merchant);

    if (name) merchant.name = name;
    if (address) merchant.address = address;
    if (phone) merchant.phone = phone;

    await merchant.save();

    const updatedMerchant = merchant.toObject();
    delete updatedMerchant.password;

    return handleStatus(res, 200, "", updatedMerchant);
  } catch (error) {
    console.error("Update merchant Error:", error);
    return handleStatus(
      res,
      500,
      error.message || "Failed to update merchantModel"
    );
  }
};
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
