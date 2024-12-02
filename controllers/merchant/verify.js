import { decodeToken, verifyOtp } from "../../utils/handleSchema.js";
import { handleStatus, validateFields } from "../../utils/utils.js";
import merchantModel from "../../models/merchantModel.js";

export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!otp || !token) {
    return validateFields({ token, otp }, res);
  }
  const { email } = await decodeToken(token);

  if (!email) {
    return handleStatus(res, 401, "Invalid token");
  }
  try {
    const merchant = await merchantModel
      .findOne({ email })
      .select("verification resetPassword");
    if (!merchant) {
      return handleStatus(res, 404, "No account found for this token.");
    }

    await verifyOtp(otp, merchant);
    await merchant.save();

    return handleStatus(res, 200, "Account verified successfully.");
  } catch (error) {
    console.error("Error verifying email:", error.message);
    return handleStatus(
      res,
      500,
      error.message || "Error verifying email merchant"
    );
  }
};
