import { handleLogout } from "../../utils/handleSchema.js";
import { handleStatus } from "../../utils/utils.js";
import userModel from "../../models/userModel.js";
import merchantModel from "../../models/merchantModel.js";

export const logout = async (req, res) => {
  const { isMerchant } = req.query;
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return handleStatus(res, 400, "Token is required.");
  }
  try {
    let user;
    if (isMerchant) {
      user = await merchantModel
        .findOne({ "tokens.token": token })
        .select("tokens");
    } else {
      user = await userModel
        .findOne({ "tokens.token": token })
        .select("tokens");
    }
    if (!user) {
      return handleStatus(res, 404, "No account found for this token.");
    }
    await handleLogout(token, user);
    return handleStatus(res, 200, "Successfully logged out.");
  } catch (error) {
    console.error("Logout Error:", error);
    return handleStatus(res, 500, error.message || "Failed to logout.");
  }
};
