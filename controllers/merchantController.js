import { nodemailer } from "../middlewares/nodemailer.js";
import merchantModel from "../models/merchantModel.js";
import userModel from "../models/userModel.js";
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
      return handleStatus(res, "Email or phone already in use", 409);
    }
    const otp = generateOtp();
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

    await newMerchant.hashPassword(password);
    await newMerchant.addVerificationCode(otp);
    await newMerchant.generateAuthToken();

    // Send verification email
    await nodemailer(email, otp);
    // Return success response
    return res.status(201).json({
      message: "Registration successful. Please verify your email.",
      token: newMerchant._id,
    });
  } catch (error) {
    console.error("Error registering merchantModel:", error.message);
    return handleStatus(res, error.message || "Internal server error");
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
      return handleStatus(res, "Merchant not found", 404);
    }

    // Check if OTP exists and matches
    if (merchant.verificationCode.code !== otp) {
      return handleStatus(res, "Invalid OTP", 400);
    }

    // Check if OTP is expired
    if (new Date() > merchant.verificationCode.expiresAt) {
      return handleStatus(res, "OTP has expired", 400);
    }

    // Clear the OTP and mark email as verified
    merchant.otp = null;
    merchant.isVerified = true;
    await merchant.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error.message);
    return handleStatus(res, error.message || "Internal server error");
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
      return handleStatus(res, "No account found for this email.", 404);
    }
    // if (!findMerchant.isVerified) {
    //   return handleStatus(res, "Please verify your email first.", 401);
    // }

    await findMerchant.validatePassword(password);
    await findMerchant.generateAuthToken();
    const dataToReturn = findMerchant.toObject();
    delete dataToReturn.password;

    return res.status(200).json({ results: dataToReturn });
  } catch (error) {
    console.error("Login Error:", error);
    return handleStatus(res, error.message || "Failed to login.");
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
      return handleStatus(res, "Merchant not found.", 404);
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
    return handleStatus(
      res,
      error.message || "Failed to update merchantModel."
    );
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
      return handleStatus(res, "No merchants found.", 404);
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
    return handleStatus(res, error.message || "Internal server error");
  }
};
export const getMerchantById = async (req, res) => {
  const { id } = req.params;
  const fields = getSelectFields(req.query.fields);
  try {
    const findMerchant = await merchantModel.findById(id).select(fields);
    if (!findMerchant) {
      return handleStatus(res, "Merchant not found.", 404);
    }
    return res.status(200).json({ results: findMerchant });
  } catch (error) {
    console.error("Error fetching merchantModel:", error);
    return handleStatus(res, error.message || "Internal server error");
  }
};
