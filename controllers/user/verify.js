import { validateFields, handleStatus } from "../../utils/utils.js";
import userModel from "../../models/userModel.js";
import { verifyOtp } from "../../utils/handleSchema.js";

export const verifyEmail = async (req, res) => {
  const { otp, email } = req.body;
  if (!email || !otp) {
    return validateFields({ email, otp }, res);
  }

  try {
    const user = await userModel
      .findOne({ email })
      .select("verification isVerified");
    if (!user) {
      return handleStatus(res, 404, "User not found with this token.");
    }
    // verify otp
    await verifyOtp(otp, user);
    await user.save();
    return handleStatus(res, 200, "Email verified successfully");
  } catch (error) {
    console.error("Error verifying email:", error.message);
    return handleStatus(res, 500, error.message || "Error verifying email.");
  }
};
