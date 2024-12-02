import {
  validateFields,
  handleStatus,
  generateString,
} from "../../utils/utils.js";
import userModel from "../../models/userModel.js";
import { hashPassword } from "../../utils/handleSchema.js";
import sendResetLink from "../../utils/sendLink.js";
// send reset password email with link
// verify the link and add new password
export const sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return validateFields({ email }, res);
  }

  try {
    const user = await userModel
      .findOne({ email })
      .select("resetPassword isVerified");
    if (!user) {
      return handleStatus(res, 404, "No account found with this email.");
    }
    if (!user.isVerified) {
      return handleStatus(res, 400, "First verify your email.");
    } // generate token and expiration date
    const token = generateString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Token valid for 5 minutes
    // add token to user
    user.resetPassword = {
      token,
      expiresAt,
    };
    await user.save();
    await sendResetLink(email, token);
    return handleStatus(res, 200, "Email sent successfully.", { email });
  } catch (error) {
    console.error("SendReset Password Error:", error.message);
    return handleStatus(
      res,
      500,
      error.message || "Failed to send reset password email."
    );
  }
};
export const resetPassword = async (req, res) => {
  const { email, password, token } = req.body;
  if (!password || !password || !token) {
    return validateFields({ password, email }, res);
  }

  try {
    const user = await userModel
      .findOne({ email })
      .select("password resetPassword");
    if (!user) {
      return handleStatus(res, 404, "No account found with this email.");
    }

    if (
      user.resetPassword.token !== token ||
      user.resetPassword.expiresAt < Date.now()
    ) {
      return handleStatus(res, 400, "Invalid token or token has expired.");
    }
    await hashPassword(password, user);
    await user.save();

    return handleStatus(res, 200, "Added new password successfully.");
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    return handleStatus(res, 500, error.message || "Failed to reset password.");
  }
};
