import { nodemailer } from "../../middlewares/nodemailer.js";
import merchantModel from "../../models/merchantModel.js";
import userModel from "../../models/userModel.js";
import {
  generateAuthToken,
  hashPassword,
  addOtp,
} from "../../utils/handleSchema.js";
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
    const token = await generateAuthToken({ email });

    // Send verification email
    await nodemailer(email, otp);
    // Return success response
    return handleStatus(res, 201, "Registration successful. Please verify.", {
      token,
    });
  } catch (error) {
    console.error("Error registering merchant:", error.message);
    return handleStatus(
      res,
      500,
      error.message || "Error registering merchant"
    );
  }
};
