import { validateFields, handleStatus } from "../../utils/utils.js";
import userModel from "../../models/userModel.js";
import merchantModel from "../../models/merchantModel.js";
import { verifyOtp } from "../../utils/handleSchema.js";

export const verifyEmail = async (req, res) => {
  const { otp, email } = req.body;
  const { isMerchant } = req.query;
  if (!email || !otp) {
    return validateFields({ email, otp }, res);
  }

  try {
    let data;
    if (isMerchant) {
      data = await merchantModel
        .findOne({ email })
        .select("verification isVerified");
    } else {
      data = await userModel
        .findOne({ email })
        .select("verification isVerified");
    }
    // return if data not found
    if (!data) {
      return handleStatus(res, 404, "No account found with this email.");
    } // verify otp
    await verifyOtp(otp, data);
    await data.save();
    return handleStatus(res, 200, "Email verified successfully");
  } catch (error) {
    console.error("Error verifying email:", error.message);
    return handleStatus(res, 500, error.message || "Error verifying email.");
  }
};
