import { handleStatus, validateFields } from "../../utils/utils.js";
import userModel from "../../models/userModel.js";
import {
  verifyAuthToken,
  validatePassword,
  deleteData,
} from "../../utils/handleSchema.js";
import merchant from "../../models/merchantModel.js";

export const deleteAccount = async (req, res) => {
  const { isMerchant } = req.query;
  const { password } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token || !password) {
    return validateFields({ token, password }, res);
  }
  try {
    let user;
    if (isMerchant) {
      user = await merchantModel
        .findOne({ "tokens.token": token })
        .select("tokens password");
    } else {
      user = await userModel
        .findOne({ "tokens.token": token })
        .select("tokens password");
    }
    await verifyAuthToken(token, user);
    await validatePassword(password, user);
    await deleteData(user);
    return handleStatus(res, 200, "User deleted successfully.");
  } catch (error) {
    console.error("Delete Error:", error);
    return handleStatus(res, 500, error.message || "Failed to delete user.");
  }
};
