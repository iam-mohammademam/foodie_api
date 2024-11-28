// Adjust the path as per your project structure

import userModel from "../model/userModel.js";

export const registerUser = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  // Validate required fields
  if (!name || !email || !password || !address) {
    return res.status(400).json({
      message:
        "All required fields (name, email, password, address) must be provided.",
    });
  }

  try {
    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists.",
      });
    }

    // Create a new user instance
    const user = new userModel({
      name,
      email,
      password,
      phone,
      address,
    });

    // Save the user to the database
    await user.save();
    // Generate an authentication token
    await user.generateAuthToken();
    // Return the newly created user (without the password) and the token
    const userToReturn = user.toObject();
    delete userToReturn.password; // Ensure password is not included

    return res.status(201).json({ user: userToReturn });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: error.message || "Failed to register user. Please try again.",
    });
  }
};
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password must be provided.",
    });
  }

  try {
    // Find the user by email
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        message: "No account found for this email.",
      });
    }

    // Validate the password
    await user.validatePassword(password);

    await user.generateAuthToken();

    // Return the logged-in user (without the password) and the token
    const userToReturn = user.toObject();
    delete userToReturn.password;

    // Send the response back to the client
    return res.status(200).json({ user: userToReturn });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: error.message || "Failed to login. Please try again.",
    });
  }
};
export const logoutUser = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  if (!token) {
    return res.status(400).json({
      message: "Token is required.",
    });
  }

  try {
    // Find the user by token
    const user = await userModel.findOne({ "tokens.token": token });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Use the logout method defined in the user schema
    await user.logout(token);

    return res.status(200).json({
      message: "Successfully logged out.",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: error.message || "Failed to logout. Please try again.",
    });
  }
};
export const updateUser = async (req, res) => {
  const { name, address, password } = req.body;
  const { id } = req.query; // Assuming the user is identified by a userId from the URL
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");

  if (!token) {
    return res.status(400).json({
      message: "Invalid authorization token.",
    });
  }

  if (!id) {
    return res.status(400).json({
      message: "User ID is required to update.",
    });
  }
  if (!name && !address && !password) {
    return res.status(400).json({
      message: "At least one field must be provided to update.",
    });
  }

  try {
    // Find the user by ID
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    await user.verifyAuthToken(token);

    await user.validatePassword(password);

    if (name) user.name = name;
    if (address) user.address = address;

    // Save the updated user data to the database
    await user.save();

    // Return the updated user (without password)
    const updatedUser = user.toObject();
    delete updatedUser.password;

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: error.message || "Failed to update user. Please try again.",
    });
  }
};
