import {
  generateAuthToken,
  validatePassword,
} from "../../utils/handleSchema.js";
import { handleStatus, validateFields } from "../../utils/utils.js";
import userModel from "../../models/userModel.js";
import merchantModel from "../../models/merchantModel.js";

export const login = async (req, res) => {
  const { isMerchant } = req.query;
  const { email, password } = req.body;
  if (!email || !password) {
    return validateFields({ email, password }, res);
  }
  try {
    let data;
    if (isMerchant) {
      data = await merchantModel
        .findOne({ email })
        .select("+password +verification");
    } else {
      data = await userModel.findOne({ email }).select("+password");
    }
    if (!data) {
      return handleStatus(res, 404, "No account found for this email.");
    } // send verification email
    if (!data.isVerified) {
      return handleStatus(res, 401, "Please verify your email first.");
    } // validate password and set token
    await generateAuthToken(data);
    await validatePassword(password, data);
    await data.save();
    // exlude password,verification & resetPass from response
    const userToReturn = data.toObject();
    delete userToReturn.password;
    delete userToReturn.verification;
    delete userToReturn.resetPassword;
    // response
    return handleStatus(res, 200, "", userToReturn);
  } catch (error) {
    console.error("Login Error:", error);
    return handleStatus(res, 500, error.message || "Failed to login.");
  }
};
