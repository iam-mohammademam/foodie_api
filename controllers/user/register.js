import { validateFields } from "../../utils/utils.js";
import userModel from "../../models/userModel.js";
import { addOtp, hashPassword } from "../../utils/handleSchema.js";
import { handleStatus, generateOtp } from "../../utils/utils.js";
import sendOtp from "../../utils/sendOtp.js";
// Register User
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  // Validate required fields
  if (!name || !email || !password) {
    return validateFields({ name, email, password }, res);
  }
  try {
    const findUser = await userModel.findOne({ email });
    if (findUser) {
      return handleStatus(res, 400, "User with this email already exists.");
    }
    const otp = generateOtp();
    const user = new userModel({ name, email, password });
    await addOtp(otp, user);
    await hashPassword(password, user);
    await sendOtp(email, otp);
    await user.save();
    return handleStatus(res, 201, "Registration successful. Please verify.");
  } catch (error) {
    console.error("Register Error:", error);
    return handleStatus(res, 500, error.message || "Failed to register user.");
  }
};
