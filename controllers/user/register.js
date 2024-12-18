import { validateFields } from "../../utils/utils.js";
import userModel from "../../models/userModel.js";
import merchantModel from "../../models/merchantModel.js";
import {
  setOtp,
  hashPassword,
  verifyCaptcha,
} from "../../utils/handleSchema.js";
import { handleStatus } from "../../utils/utils.js";
import sendOtp from "../../utils/sendOtp.js";
// Register User
export const register = async (req, res) => {
  const { captcha: captchaToken } = req.headers;
  const { name, email, password } = req.body;
  // Validate required fields
  if (!name || !email || !password || !captchaToken) {
    return validateFields({ name, email, password, captchaToken }, res);
  }
  try {
    await verifyCaptcha(captchaToken, req.ip);
    // Check if email or phone already exists
    const existingMerchant = await merchantModel.findOne({
      $or: [{ email }],
    });
    const existingUser = await userModel.findOne({
      $or: [{ email }],
    });
    if (existingMerchant || existingUser) {
      return handleStatus(res, 409, "Email or phone already in use");
    }
    const user = new userModel({ name, email, password });
    const otp = await setOtp(user);
    await hashPassword(password, user);
    await sendOtp(email, otp);
    await user.save();
    return handleStatus(res, 201, "Registration successful. Please verify.");
  } catch (error) {
    console.error("Register Error:", error);
    return handleStatus(res, 500, error.message || "Failed to register user.");
  }
};
