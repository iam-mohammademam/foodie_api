import {
  addOtp,
  decodeToken,
  generateAuthToken,
  handleLogout,
  validatePassword,
} from "../../utils/handleSchema.js";
import {
  generateOtp,
  handleStatus,
  validateFields,
} from "../../utils/utils.js";
import userModel from "../../models/userModel.js";
import { nodemailer } from "../../middlewares/nodemailer.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return validateFields({ email, password }, res);
  }

  try {
    const findUser = await userModel.findOne({ email }).select("+password");
    if (!findUser) {
      return handleStatus(res, 404, "No account found for this email.");
    }
    if (!findUser.isVerified) {
      const otp = generateOtp();
      const token = await generateAuthToken({ email });
      await addOtp(otp, findUser);
      await findUser.save();
      await nodemailer(email, otp);
      return handleStatus(res, 401, "Please verify your email first.", {
        token,
      });
    }
    await validatePassword(password, findUser);
    await generateAuthToken(findUser);
    // exlude password from response
    const userToReturn = findUser.toObject();
    delete userToReturn.password;
    delete userToReturn.verification;
    delete userToReturn.resetPassword;

    return handleStatus(res, 200, "", userToReturn);
  } catch (error) {
    console.error("Login Error:", error);
    return handleStatus(res, 500, error.message || "Failed to login.");
  }
};
export const logout = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return handleStatus(res, 400, "Token is required.");
  }
  const { email } = await decodeToken(token);
  if (!email) {
    return handleStatus(res, 401, "Invalid token");
  }

  try {
    const user = await userModel
      .findOne({ "tokens.token": token })
      .select("email tokens");

    if (!user) {
      return handleStatus(res, 404, "No account found for this token.");
    }
    if (user.email !== email) {
      return handleStatus(res, 401, "Invalid token");
    }
    await handleLogout(token, user);
    return handleStatus(res, 200, "Successfully logged out.");
  } catch (error) {
    console.error("Logout Error:", error);
    return handleStatus(res, 500, error.message || "Failed to logout.");
  }
};
