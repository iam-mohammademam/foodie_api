import userModel from "../models/userModel.js";
import {
  generateAuthToken,
  handleLogout,
  hashPassword,
  updateAddress,
  updatePassword,
  validatePassword,
  verifyAuthToken,
} from "../utils/handleSchema.js";
import { handleStatus, validateFields } from "../utils/utils.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return validateFields({ name, email, password }, res);
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return handleStatus(res, "User with this email already exists.", 400);
    }

    const user = new userModel({ name, email, password });
    await hashPassword(password, user);

    await user.save();
    await generateAuthToken(user);

    const userToReturn = user.toObject();
    delete userToReturn.password;

    return res.status(201).json({ user: userToReturn });
  } catch (error) {
    console.error("Register Error:", error);
    return handleStatus(res, error.message || "Failed to register user.");
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return validateFields({ email, password }, res);
  }

  try {
    const findUser = await userModel.findOne({ email }).select("+password");
    if (!findUser) {
      return handleStatus(res, "No account found for this email.", 404);
    }
    await validatePassword(password, findUser);
    await generateAuthToken(findUser);
    // exlude password from response
    const userToReturn = findUser.toObject();
    delete userToReturn.password;

    return res.status(200).json({ results: userToReturn });
  } catch (error) {
    console.error("Login Error:", error);
    return handleStatus(res, error.message || "Failed to login.");
  }
};

export const logoutUser = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return handleStatus(res, "Token is required.", 400);
  }

  try {
    const user = await userModel.findOne({ "tokens.token": token });
    if (!user) {
      return handleStatus(res, "User not found.", 404);
    }

    await handleLogout(token, user);
    return handleStatus(res, "Successfully logged out.", 200);
  } catch (error) {
    console.error("Logout Error:", error);
    return handleStatus(res, error.message || "Failed to logout.");
  }
};
export const updateUser = async (req, res) => {
  const {
    name,
    state,
    street,
    city,
    postalCode,
    country,
    phone,
    password,
    newPassword,
  } = req.body;
  const { id } = req.query;
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token || !id || !password) {
    return validateFields({ token, id, password }, res);
  }

  // Ensure there's something to update
  const fieldsToUpdate = {
    name,
    state,
    street,
    city,
    postalCode,
    country,
    phone,
    newPassword,
  };
  const hasFieldsToUpdate = Object.values(fieldsToUpdate).some(
    (value) => value != null
  );

  if (!hasFieldsToUpdate) {
    return handleStatus(res, "No fields provided to update.", 400);
  }

  try {
    const findUser = await userModel.findById(id).select("+password");
    if (!findUser) {
      return handleStatus(res, "User not found.", 404);
    }

    await verifyAuthToken(token, findUser);
    await validatePassword(password, findUser);

    if (newPassword) await updatePassword(newPassword, findUser);
    if (state || street || city || postalCode || country) {
      await updateAddress(
        { state, street, city, postalCode, country },
        findUser
      );
    }
    if (name) findUser.name = name;
    if (phone) findUser.phone = phone;

    await findUser.save();

    const updatedUser = findUser.toObject();
    delete updatedUser.password;

    return res.status(200).json({
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Error:", error);
    return handleStatus(res, error.message || "Failed to update user.");
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
    const findUser = await userModel.findById(id).select("+password");
    if (!findUser) {
      return handleStatus(res, "User not found.", 404);
    }
    await verifyAuthToken(token, findUser);
    await validatePassword(password, findUser);
    await findUser.deleteUser();

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete Error:", error);
    return handleStatus(res, error.message || "Failed to delete user.");
  }
};
