import { validateFields, handleStatus } from "../../utils/utils.js";
import userModel from "../../models/userModel.js";
import {
  verifyAuthToken,
  hashPassword,
  handleAddress,
  validatePassword,
  decodeToken,
} from "../../utils/handleSchema.js";

export const updateUser = async (req, res) => {
  const { name, state, street, city, postalCode, country, phone, password } =
    req.body;
  const { id } = req.query;
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token || !id || !password) {
    return validateFields({ token, id, password }, res);
  }

  // Ensure there's something to update
  const fieldsToUpdate = {
    name,
    // state,
    // street,
    // city,
    // postalCode,
    // country,
    phone,
  };
  const hasFieldsToUpdate = Object.values(fieldsToUpdate).some(
    (value) => value != null
  );

  if (!hasFieldsToUpdate) {
    return handleStatus(res, 400, "No fields provided to update.");
  }

  try {
    const findUser = await userModel.findById(id).select("+password");
    if (!findUser) {
      return handleStatus(res, 404, "User not found with this token.");
    }

    await verifyAuthToken(token, findUser);
    await validatePassword(password, findUser);
    // if (state || street || city || postalCode || country) {
    //   await updateAddress(
    //     { state, street, city, postalCode, country },
    //     findUser
    //   );
    // }
    if (name) findUser.name = name;
    if (phone) findUser.phone = phone;

    await findUser.save();

    const updatedUser = findUser.toObject();
    delete updatedUser.password;

    return handleStatus(res, 200, "User updated successfully.", updatedUser);
  } catch (error) {
    console.error("Update Error:", error);
    return handleStatus(res, 500, error.message || "Failed to update user.");
  }
};
export const updatePassword = async (req, res) => {
  const { password, newPassword } = req.body;
  const { id } = req.query;
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token || !id || !password || !newPassword) {
    return validateFields({ token, id, password, newPassword }, res);
  }

  try {
    const user = await userModel.findById(id).select("email tokens password");
    if (!user) {
      return handleStatus(res, 404, "User not found with this token.");
    }

    await verifyAuthToken(token, user);
    await validatePassword(password, user);
    // Update password
    if (password) await hashPassword(newPassword, user);
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
  const { id } = req.query;
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token || !id || !password) {
    return validateFields({ token, id, password, newPassword }, res);
  }

  // Ensure there's something to update
  const fieldsToUpdate = {
    state,
    street,
    city,
    postalCode,
    country,
  };
  const hasFieldsToUpdate = Object.values(fieldsToUpdate).some(
    (value) => value != null
  );

  if (!hasFieldsToUpdate) {
    return handleStatus(res, 400, "No fields provided to update.");
  }
  const { email } = await decodeToken(token);
  if (!email) {
    return handleStatus(res, 401, "Invalid token");
  }
  try {
    const user = await userModel
      .findById(id)
      .select("email tokens password address");
    if (!user) {
      return handleStatus(res, 404, "User not found with this token.");
    }
    if (user.email !== email) {
      return handleStatus(res, 401, "Invalid token");
    }
    await verifyAuthToken(token, user);
    await validatePassword(password, user);
    await handleAddress({ state, street, city, postalCode, country }, user);
    await user.save();
    const updatedUser = user.toObject();
    delete updatedUser.password;
    delete updatedUser.verification;
    delete updatedUser.resetPassword;

    return handleStatus(res, 200, "Address updated successfully.", updatedUser);
  } catch (error) {
    console.error("Update Error:", error);
    return handleStatus(res, 500, error.message || "Failed to update user.");
  }
};
