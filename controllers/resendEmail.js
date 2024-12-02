import { validateFields, handleStatus, generateOtp } from "../utils/utils.js";
import userModel from "../models/userModel.js";
import { nodemailer } from "../middlewares/nodemailer.js";
import { addOtp } from "../utils/handleSchema.js";
// Resend email verification
export const resendEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return validateFields({ email }, res);
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return handleStatus(res, 404, "No user found with this email.");
    }
    const otp = generateOtp();
    await addOtp(otp, user);
    await nodemailer(email, otp);
    user.resetPassword = true;
    await user.save();
    return handleStatus(res, 200, "Email sent successfully.");
  } catch (error) {
    console.error("Resend Email Error:", error);
    return handleStatus(res, 500, error.message || "Failed to resend email.");
  }
};
