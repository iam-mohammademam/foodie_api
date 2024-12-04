import { Schema } from "mongoose";

export const nameSchema = {
  type: String,
  required: true,
  trim: true,
  minlength: 3,
};
export const passwordSchema = {
  type: String,
  required: true,
  minlength: 6,
  select: false,
};
export const emailSchema = {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
  validate: {
    validator: (email) =>
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email),
    message: "Invalid email format",
  },
};
export const phoneSchema = {
  type: String,
  validate: {
    validator: (phone) => /^\d{10,15}$/.test(phone),
    message: "Phone number must be between 10-15 digits",
  },
};
export const ratingSchema = {
  type: Number,
  default: 0,
  min: [0, "Rating cannot be less than 0"],
  max: [5, "Rating cannot exceed 5"],
};
export const resetPasswordSchema = new Schema(
  {
    token: { type: String },
    expiresAt: { type: Date },
  },
  { _id: false }
);
export const verificationSchema = new Schema(
  {
    code: { type: String },
    expiresAt: { type: Date },
  },
  { _id: false }
);
export const addressSchema = new Schema(
  {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, default: "Bangladesh" },
  },
  { _id: false }
);
export const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);
// Schedule Schema
export const scheduleSchema = new Schema(
  {
    closedOn: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    ],
    openTime: { type: String, required: true }, // Format: HH:mm
    closeTime: { type: String, required: true },
  },
  { _id: false }
);
