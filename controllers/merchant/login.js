import merchantModel from "../../models/merchantModel.js";
import {
  generateAuthToken,
  validatePassword,
} from "../../utils/handleSchema.js";
import { handleStatus, validateFields } from "../../utils/utils.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return validateFields({ email, password }, res);
  }
  try {
    const merchant = await merchantModel.findOne({ email }).select(`+password`);
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
    delete dataToReturn.verification;
    return handleStatus(res, 200, "", dataToReturn);
  } catch (error) {
    console.error("Login Error:", error);
    return handleStatus(res, 500, error.message || "Failed to login merchant");
  }
};
