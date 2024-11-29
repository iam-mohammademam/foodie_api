import { Schema } from "mongoose";
import { jwtSecret } from "../middlewares/variables.js";
import jwt from "jsonwebtoken";

export const handleStatus = (res, message, status = 500) => {
  return res.status(status).json({ message });
};
// validate fields
export const validateFields = (fields, res) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      return handleError(res, `The ${key} field is required.`, 400);
    }
  }
  return true;
};
// Get select fields based on user input
export const getSelectFields = (
  fields,
  defaultFields = "_id name cuisineTypes banner schedule"
) => {
  if (fields) {
    // If user has provided specific fields, concatenate them with the default fields
    const userFields = fields
      .split(",")
      .map((field) => field.trim())
      .join(" ");
    return `${defaultFields} ${userFields}`.trim();
  }
  // If no fields are provided, return the default fields
  return defaultFields;
};
// Function to build the dynamic query object for searching
export const getQueryObject = ({
  cuisineType,
  name,
  minRating = 0,
  maxRating = 5,
  isActive,
  isVerified,
}) => {
  const query = {};

  // Filter by cuisineType if provided
  if (cuisineType) {
    const cuisineTypesArray = cuisineType
      .split(",")
      .map((type) => type.trim().toLowerCase());
    query.$text = { $search: cuisineTypesArray.join(" ") }; // Use text index for matching cuisine types
  }
  // Filter by name if provided
  if (name) {
    query.name = { $regex: name, $options: "i" }; // Case-insensitive search for name
  }

  // Filter by rating range
  query.rating = { $gte: minRating, $lte: maxRating };

  // Filter by active/verified status
  if (isActive !== undefined) query.isActive = isActive === "true";
  if (isVerified !== undefined) query.isVerified = isVerified === "true";

  return query;
};
// Function to generate auth token
export const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);
export const generateAuthToken = async (user) => {
  try {
    const token = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn: "7d",
    });
    // Optionally add the token to the user's token list (if you want to store tokens)
    if (user.tokens) {
      user.tokens.push({ token });
      await user.save();
    }
    return token;
  } catch (error) {
    throw new Error("Token generation failed");
  }
};
export const verifyAuthToken = async (token, user) => {
  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, jwtSecret);

    // Check if the token exists in the user's tokens array
    const tokenExists = user.tokens.some((t) => t.token === token);
    if (!tokenExists) {
      throw new Error("Token not found in user's tokens list");
    }

    // Return decoded data if the token is valid
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a number between 100000 and 999999
};
