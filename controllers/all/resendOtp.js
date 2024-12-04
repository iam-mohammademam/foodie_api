import { validateFields, handleStatus } from "../../utils/utils.js";
import userModel from "../../models/userModel.js";
import merchantModel from "../../models/merchantModel.js";
import { setOtp } from "../../utils/handleSchema.js";
import sendOtp from "../../utils/sendOtp.js";

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return validateFields({ email }, res);
  }
  try {
    const user = await userModel.findOne({ email });
    const merchant = await merchantModel.findOne({ email });
    if (!user || !merchant) {
      return handleStatus(res, 404, "No user found with this email.");
    }
    //
    const otp = await setOtp(user);
    await sendOtp(email, otp);
    await user.save();
    return handleStatus(res, 200, "Email sent successfully.");
  } catch (error) {
    console.error("Resend Email Error:", error);
    return handleStatus(res, 500, error.message || "Failed to resend email.");
  }
};
