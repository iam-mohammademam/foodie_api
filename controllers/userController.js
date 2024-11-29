import userModel from "../model/userModel.js";
import { handleError, validateFields } from "../utils/utils.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  const isValid = validateFields({ name, email, password }, res);
  if (isValid !== true) return;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return handleError(res, "User with this email already exists.", 400);
    }

    const user = new userModel({ name, email, password });
    await user.hashPassword(password);
    await user.save();

    await user.generateAuthToken();
    const userToReturn = user.toObject();
    delete userToReturn.password;

    return res.status(201).json({ user: userToReturn });
  } catch (error) {
    console.error("Register Error:", error);
    return handleError(res, error.message || "Failed to register user.");
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const isValid = validateFields({ email, password }, res);
  if (isValid !== true) return;

  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return handleError(res, "No account found for this email.", 404);
    }

    await user.validatePassword(password);

    const token = await user.generateAuthToken();
    const userToReturn = user.toObject();
    delete userToReturn.password;

    return res.status(200).json({ user: userToReturn, token });
  } catch (error) {
    console.error("Login Error:", error);
    return handleError(res, error.message || "Failed to login.");
  }
};

export const logoutUser = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return handleError(res, "Token is required.", 400);
  }

  try {
    const user = await userModel.findOne({ "tokens.token": token });
    if (!user) {
      return handleError(res, "User not found.", 404);
    }

    await user.logout(token);
    return res.status(200).json({ message: "Successfully logged out." });
  } catch (error) {
    console.error("Logout Error:", error);
    return handleError(res, error.message || "Failed to logout.");
  }
};

export const updateUser = async (req, res) => {
  const { name, address, phone, password, newPassword } = req.body;
  const { id } = req.query;
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token || !id || !password) {
    return validateFields({ token, id, password }, res);
  }

  if (!name && !address && !newPassword && !phone) {
    return handleError(res, "No fields provided to update.", 400);
  }

  try {
    const user = await userModel.findById(id).select("+password");
    if (!user) {
      return handleError(res, "User not found.", 404);
    }

    await user.verifyAuthToken(token);

    await user.validatePassword(password);

    if (newPassword) await user.updatePassword(password, newPassword);

    if (name) user.name = name;
    if (address) user.address = address;

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    return res.status(200).json({
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Error:", error);
    return handleError(res, error.message || "Failed to update user.");
  }
};
export const deleteUser = async (req, res) => {
  const { password } = req.body;
  const { id } = req.query;
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token || !id || !password) {
    return validateFields({ token, id, password }, res);
  }

  try {
    const user = await userModel.findById(id).select("+password");
    if (!user) {
      return handleError(res, "User not found.", 404);
    }

    await user.verifyAuthToken(token);
    await user.validatePassword(password);
    await user.deleteUser();

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete Error:", error);
    return handleError(res, error.message || "Failed to delete user.");
  }
};
