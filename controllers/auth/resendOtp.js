import { validateFields, handleStatus } from "../../utils/utils.js";
import userModel from "../../models/userModel.js";
import merchantModel from "../../models/merchantModel.js";
import { setOtp } from "../../utils/handleSchema.js";
import sendOtp from "../../utils/sendOtp.js";

export const resendOtp = async (req, res) => {
  const { email, isMerchant } = req.query;
  if (!email) {
    return validateFields({ email }, res);
  }

  try {
    let user;
    if (isMerchant) {
      user = await merchantModel.findOne({ email });
    } else {
      user = await userModel.findOne({ email });
    }

    if (!user) {
      return handleStatus(res, 404, "No user found with this email.");
    }
    if (user.isVerified) {
      return handleStatus(res, 400, "Your email is already verified.");
    }
    const otp = await setOtp(user);
    await sendOtp(email, otp);
    await user.save();
    return handleStatus(res, 200, "OTP sent successfully.");
  } catch (error) {
    console.error("Resend Email Error:", error);
    return handleStatus(res, 500, error.message || "Failed to resend email.");
  }
};
