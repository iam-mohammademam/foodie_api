import { nodemailer } from "../../middlewares/nodemailer.js";
import merchantModel from "../../models/merchantModel.js";
import userModel from "../../models/userModel.js";
import {
  generateAuthToken,
  hashPassword,
  addOtp,
} from "../../utils/handleSchema.js";
import sendOtp from "../../utils/sendOtp.js";
import {
  generateOtp,
  handleStatus,
  validateFields,
} from "../../utils/utils.js";

export const register = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    state,
    street,
    city,
    postalCode,
    cuisineTypes,
    logo,
    banner,
    closedOn,
    openTime,
    closeTime,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !phone ||
    !cuisineTypes ||
    !closedOn ||
    !openTime ||
    !closeTime ||
    !state ||
    !street ||
    !city ||
    !postalCode
  ) {
    return validateFields(
      {
        name,
        email,
        password,
        phone,
        cuisineTypes,
        closedOn,
        openTime,
        closeTime,
        state,
        street,
        city,
        postalCode,
      },
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
      address: {
        state,
        street,
        city,
        postalCode,
      },
      cuisineTypes,
      logo,
      banner,
      schedule: {
        closedOn,
        openTime,
        closeTime,
      },
    });

    await hashPassword(password, merchant);
    await addOtp(otp, merchant);
    await merchant.save();
    // Send verification email
    await sendOtp(email, otp);
    // Return success response
    return handleStatus(res, 201, "Registration successful. Please verify.");
  } catch (error) {
    console.error("Error registering merchant:", error.message);
    return handleStatus(
      res,
      500,
      error.message || "Error registering merchant"
    );
  }
};
