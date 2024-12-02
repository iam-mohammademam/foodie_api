import { validateFields, handleStatus } from "../../utils/utils.js";
import userModel from "../../models/userModel.js";
import { decodeToken, verifyOtp } from "../../utils/handleSchema.js";

export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token || !otp) {
    return validateFields({ id, otp }, res);
  }
  const { email } = await decodeToken(token);

  if (!email) {
    return handleStatus(res, 401, "Invalid token");
  }
  try {
    const user = await userModel
      .findOne({ email })
      .select("resetPassword verification isVerified");
    if (!user) {
      return handleStatus(res, 404, "User not found with this token.");
    }
    await verifyOtp(otp, user);
    await user.save();

    return handleStatus(res, 200, "Email verified successfully");
  } catch (error) {
    console.error("Error verifying email:", error.message);
    return handleStatus(res, 500, error.message || "Error verifying email.");
  }
};
