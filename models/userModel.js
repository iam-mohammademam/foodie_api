import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs"; // Use a simpler import name
import jwt from "jsonwebtoken";
import { jwtSecret } from "../middlewares/variables.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (email) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Prevent password from being returned in queries
    },
    phone: {
      type: String,
      validate: {
        validator: (phone) => /^\d{10,15}$/.test(phone),
        message: "Phone number must be between 10-15 digits",
      },
    },
    address: {
      type: String,
      // required: [true, "Address is required"],
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10); // Use a constant salt rounds value
  this.password = await bcrypt.hash(password, salt);
};
// Method to update password
userSchema.methods.updatePassword = async function (
  currentPassword,
  newPassword
) {
  // Ensure new password is not empty
  if (!newPassword) {
    throw new Error("New password is required");
  }
  await this.validatePassword(currentPassword);
  await this.hashPassword(newPassword);
};
// Method to generate auth token
userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ id: this._id, isAdmin: this.isAdmin }, jwtSecret, {
      expiresIn: "7d",
    });
    this.tokens.push({ token });
    await this.save();
    return token;
  } catch (error) {
    throw new Error("Token generation failed");
  }
};
// Method to verify auth token
userSchema.methods.verifyAuthToken = async function (token) {
  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, jwtSecret);

    // Check if the token exists in the user's tokens array
    const tokenExists = this.tokens.some((t) => t.token === token);
    if (!tokenExists) {
      throw new Error("Token not found in user's tokens list");
    }

    // Return decoded data if the token is valid
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
// Method to validate password
userSchema.methods.validatePassword = async function (password) {
  const isPasswordValid = await bcrypt.compare(password, this.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
};
// Clean up tokens after logout
userSchema.methods.logout = async function (token) {
  this.tokens = this.tokens.filter((t) => t.token !== token);
  await this.save();
};
// Delete user
userSchema.methods.deleteUser = async function (id) {
  await this.deleteOne();
};

export default model("User", userSchema);
