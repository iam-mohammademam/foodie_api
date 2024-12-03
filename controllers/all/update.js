import { validateFields, handleStatus } from "../../utils/utils.js";
import userModel from "../../models/userModel.js";
import merchantModel from "../../models/merchantModel.js";
import {
  hashPassword,
  handleAddress,
  validatePassword,
  decodeToken,
} from "../../utils/handleSchema.js";

export const updateData = async (req, res) => {
  const { name, phone, password } = req.body;
  const { isMerchant } = req.query;
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
    let data;
    if (isMerchant) {
      data = await merchantModel.findOne({ email }).select("+password");
    } else {
      data = await userModel.findOne({ email }).select("+password");
    }
    if (!data) {
      return handleStatus(res, 404, "User not found with this token.");
    }
    // verify token & password
    await validatePassword(password, data);
    // update fields
    if (name) data.name = name;
    if (phone) data.phone = phone;
    // save user
    await data.save();
    // remove password from response
    const updatedUser = data.toObject();
    delete updatedUser.password;
    delete updatedUser.verification;

    return handleStatus(res, 200, "User updated successfully.", updatedUser);
  } catch (error) {
    console.error("Update Error:", error);
    return handleStatus(res, 500, error.message || "Failed to update user.");
  }
}; //
export const updatePassword = async (req, res) => {
  const { isMerchant } = req.query;
  const { password, newPassword } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");
  // return if token, password or newPassword not provided
  if (!token || !password || !newPassword) {
    return validateFields({ token, password, newPassword }, res);
  }
  // decode token
  const { email } = await decodeToken(token);
  if (!email) {
    return handleStatus(res, 401, "Invalid token");
  }
  try {
    let data;
    if (isMerchant) {
      data = await merchantModel
        .findOne({ email })
        .select("email tokens password");
    } else {
      data = await userModel.findOne({ email }).select("email tokens password");
    }
    if (!data) {
      return handleStatus(res, 404, "User not found with this token.");
    }
    // verify token & password
    await validatePassword(password, data);
    // Update password
    await hashPassword(newPassword, data);
    await data.save();
    const updatedUser = data.toObject();
    delete updatedUser.password;
    delete updatedUser.verification;
    return handleStatus(res, 200, "Password updated successfully.");
  } catch (error) {
    console.error("Update Error:", error);
    return handleStatus(res, 500, error.message || "Failed to update user.");
  }
}; //
export const updateAddress = async (req, res) => {
  const { isMerchant } = req.query;
  const { password, state, street, city, postalCode, country } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");
  // return if token &password not provided
  if (!token || !password) {
    return validateFields({ token, password }, res);
  } // Ensure there's something to update
  if (!state && !street && !city && !postalCode) {
    return handleStatus(res, 400, "No fields provided to update.");
  }
  // decode token
  const { email } = await decodeToken(token);
  if (!email) {
    return handleStatus(res, 401, "Invalid token");
  }
  try {
    let data;
    if (isMerchant) {
      data = await merchantModel
        .findOne({ email })
        .select("email tokens password address");
    } else {
      data = await userModel
        .findOne({ email })
        .select("email tokens password address");
    }
    if (!data) {
      return handleStatus(res, 404, "User not found with this token.");
    }
    // verify token & password
    await validatePassword(password, data);
    await handleAddress({ state, street, city, postalCode, country }, data);
    // save user
    await data.save();
    // remove password from response
    const updatedUser = data.toObject();
    delete updatedUser.password;
    delete updatedUser.verification;
    return handleStatus(res, 200, "Address updated successfully.", updatedUser);
  } catch (error) {
    console.error("Update Error:", error);
    return handleStatus(res, 500, error.message || "Failed to update user.");
  }
};
