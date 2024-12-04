import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../middlewares/variables.js";
import { generateOtp, generateString } from "./utils.js";

// hash & update password
export const hashPassword = async (password, data) => {
  if (!password || !data) {
    throw new Error("Password or data is missing");
  }
  const salt = await bcrypt.genSalt(10);
  data.password = await bcrypt.hash(password, salt);
}; // validate password
export const validatePassword = async (password, data) => {
  if (!password || !data) {
    throw new Error("Password or data is missing");
  }
  const isPasswordValid = await bcrypt.compare(password, data.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
}; // generate auth token
export const generateAuthToken = async (data) => {
  if (!data) {
    throw new Error("Data is required.");
  }
  const token = generateString();
  if (data.tokens) {
    data.tokens.push({ token });
  }
  return token;
}; // verify auth token
export const verifyAuthToken = async (token, data) => {
  const tokenExists = data.tokens.some((t) => t.token === token);
  if (!tokenExists) {
    throw new Error("Token not found in data's tokens list");
  }
}; // decode token
export const decodeToken = async (token) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}; // delete auth token on logout
export const handleLogout = async (token, data) => {
  try {
    data.tokens = data.tokens.filter((t) => t.token !== token);
    await data.save();
  } catch (error) {
    throw new Error("Logout failed");
  }
}; // update address
export const handleAddress = async (addressFields, user) => {
  try {
    if (!user || !addressFields) {
      throw new Error("User or addressFields is missing");
    }
    // Ensure that the address subdocument exists
    if (!user.address) {
      user.address = {}; // Initialize address if it doesn't exist
    }
    // List of valid fields to update in the address
    const allowedFields = ["street", "city", "state", "postalCode", "country"];
    // Validate and update only the allowed address fields
    Object.keys(addressFields).forEach((field) => {
      if (!allowedFields.includes(field)) {
        throw new Error(`Invalid address field: ${field}`);
      }
      const newValue = addressFields[field];
      // Ensure the new value is defined and not empty
      if (newValue !== undefined && newValue !== null && newValue !== "") {
        // Replace the existing value with the new value
        user.address[field] = newValue;
      }
    });
  } catch (error) {
    throw new Error(`Error updating address: ${error.message}`);
  }
}; // add otp
export const setOtp = async (data) => {
  if (!data) {
    throw new Error("Data is missing");
  }
  const otp = generateOtp();
  data.verification = {
    code: otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  };
  return otp;
}; // verify otp
export const verifyOtp = async (otp, data) => {
  if (!otp || !data.verification) {
    throw new Error("OTP or data is missing");
  }
  if (data.isVerified) {
    throw new Error("Account is already verified");
  }
  const isOtpValid = data.verification.code === otp;
  if (!isOtpValid) {
    throw new Error("Invalid OTP");
  }
  const isOtpExpired = data.verification.expiresAt < new Date();
  if (isOtpExpired) {
    throw new Error("OTP has expired");
  }
  data.verification = { code: null, expiresAt: null };
  data.isVerified = true;
}; // delete data
export const deleteData = async (data) => {
  if (!data) {
    throw new Error("Data is missing");
  }
  await data.deleteOne();
};
