import {
  validateFields,
  handleStatus,
  generateOtp,
} from "../../utils/utils.js";
import userModel from "../../models/userModel.js";
import { nodemailer } from "../../middlewares/nodemailer.js";
import {
  addOtp,
  decodeToken,
  generateAuthToken,
  hashPassword,
} from "../../utils/handleSchema.js";

export const resetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return validateFields({ email }, res);
  }

  try {
    const user = await userModel
      .findOne({ email })
      .select("resetPassword verification isVerified");
    if (!user) {
      return handleStatus(res, 404, "No account found with this email.");
    }
    if (!user.isVerified) {
      return handleStatus(res, 400, "First verify your email.");
    }
    const otp = generateOtp();
    await addOtp(otp, user);
    await nodemailer(email, otp);
    user.resetPassword = true;

    await user.save();
    const token = await generateAuthToken({ email });
    return handleStatus(res, 200, "Email sent successfully.", { token });
  } catch (error) {
    console.error("Resend Email Error:", error);
    return handleStatus(res, 500, error.message || "Failed to resend email.");
  }
};
export const forgotPassword = async (req, res) => {
  const { newPassword } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!newPassword || !token) {
    return validateFields({ newPassword, token }, res);
  }
  const { email } = await decodeToken(token);
  if (!email) {
    return handleStatus(res, 401, "Invalid token");
  }
  try {
    const user = await userModel.findOne({ email }).select("password email");
    if (!user) {
      return handleStatus(res, 404, "No account found for this token.");
    }

    await hashPassword(newPassword, user);
    await user.save();
    const updatedUser = user.toObject();
    delete updatedUser.password;
    return handleStatus(res, 200, "Added new password successfully.");
  } catch (error) {
    console.error("Update Error:", error);
    return handleStatus(res, 500, error.message || "Failed to update user.");
  }
};
