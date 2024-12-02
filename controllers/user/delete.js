import { handleStatus, validateFields } from "../../utils/utils.js";
import userModel from "../../models/userModel.js";
import {
  verifyAuthToken,
  validatePassword,
  deleteData,
  decodeToken,
} from "../../utils/handleSchema.js";

export const deleteUser = async (req, res) => {
  const { password } = req.body;
  const { id } = req.query;
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token || !id || !password) {
    return validateFields({ token, id, password }, res);
  }
  const { email } = await decodeToken(token);
  if (!email) {
    return handleStatus(res, 401, "Invalid token");
  }
  try {
    const findUser = await userModel
      .findById(id)
      .select("email tokens password");
    if (!findUser) {
      return handleStatus(res, 404, "User not found with this id.", null);
    }
    if (findUser.email !== email) {
      return handleStatus(res, 401, "Invalid token");
    }
    await verifyAuthToken(token, findUser);
    await validatePassword(password, findUser);
    await deleteData(findUser);

    return handleStatus(res, 200, "User deleted successfully.");
  } catch (error) {
    console.error("Delete Error:", error);
    return handleStatus(res, 500, error.message || "Failed to delete user.");
  }
};
