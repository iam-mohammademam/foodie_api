import { validateFields, handleStatus } from "../../utils/utils.js";
import userModel from "../../models/userModel.js";
import {
  verifyAuthToken,
  hashPassword,
  handleAddress,
  validatePassword,
  decodeToken,
} from "../../utils/handleSchema.js";

export const updateData = async (req, res) => {
  const { name, phone, password } = req.body;

  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token || !password) {
    return validateFields({ token, password }, res);
  }

  if (!name && !phone) {
    return handleStatus(res, 400, "No fields provided to update.");
  }
  const { email } = await decodeToken(token);
  if (!email) {
    return handleStatus(res, 401, "Invalid token");
  }
  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return handleStatus(res, 404, "User not found with this token.");
    }
    // verify token & password
    await verifyAuthToken(token, user);
    await validatePassword(password, user);
    // update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    // save user
    await user.save();
    // remove password from response
    const updatedUser = user.toObject();
    delete updatedUser.password;

    return handleStatus(res, 200, "User updated successfully.", updatedUser);
  } catch (error) {
    console.error("Update Error:", error);
    return handleStatus(res, 500, error.message || "Failed to update user.");
  }
};
export const updatePassword = async (req, res) => {
  const { password, newPassword } = req.body;

  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token || !password || !newPassword) {
    return validateFields({ token, password, newPassword }, res);
  }
  const { email } = await decodeToken(token);
  if (!email) {
    return handleStatus(res, 401, "Invalid token");
  }
  try {
    const user = await userModel
      .findOne({ email })
      .select("email tokens password");
    if (!user) {
      return handleStatus(res, 404, "User not found with this token.");
    }
    // verify token & password
    await verifyAuthToken(token, user);
    await validatePassword(password, user);
    // Update password
    await hashPassword(newPassword, user);
    await user.save();
    const updatedUser = user.toObject();
    delete updatedUser.password;

    return handleStatus(res, 200, "Password updated successfully.");
  } catch (error) {
    console.error("Update Error:", error);
    return handleStatus(res, 500, error.message || "Failed to update user.");
  }
};
export const updateAddress = async (req, res) => {
  const { password, state, street, city, postalCode, country } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token || !password) {
    return validateFields({ token, password }, res);
  }
  if (!state || !street || !city || !postalCode || !country) {
    return validateFields({ state, street, city, postalCode, country }, res);
  }
  const { email } = await decodeToken(token);
  if (!email) {
    return handleStatus(res, 401, "Invalid token");
  }
  try {
    const user = await userModel
      .findOne({ email })
      .select("email tokens password address");
    if (!user) {
      return handleStatus(res, 404, "User not found with this token.");
    }
    // verify token & password
    await verifyAuthToken(token, user);
    await validatePassword(password, user);
    await handleAddress({ state, street, city, postalCode, country }, user);
    await user.save();
    const updatedUser = user.toObject();
    delete updatedUser.password;
    delete updatedUser.verification;

    return handleStatus(res, 200, "Address updated successfully.", updatedUser);
  } catch (error) {
    console.error("Update Error:", error);
    return handleStatus(res, 500, error.message || "Failed to update user.");
  }
};
