import { Schema, model } from "mongoose";
import {
  addressSchema,
  emailSchema,
  nameSchema,
  passwordSchema,
  phoneSchema,
  ratingSchema,
  scheduleSchema,
  tokenSchema,
} from "./globalSchema.js";

// Merchant Schema
const merchantSchema = new Schema(
  {
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    phone: phoneSchema,
    address: { type: addressSchema, required: true },
    cuisineTypes: [{ type: String }], // e.g., ["Italian", "Chinese"]
    cuisineString: { type: String }, // Preprocessed string for indexing
    logo: { type: String }, // URL for the logo
    banner: { type: String }, // URL for the banner image
    schedule: [scheduleSchema], // Open/Close times for each day
    rating: ratingSchema,
    tokens: [tokenSchema],
    verification: {
      code: { type: String }, // OTP code
      expiresAt: { type: Date }, // Expiry time for the OTP
    },
    resetPassword: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: "merchant" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes for performance
merchantSchema.index({ name: "text", cuisineString: "text" });
// Hook to preprocess cuisineTypes
merchantSchema.pre("save", async function (next) {
  // Preprocess cuisineTypes into a single string
  if (this.cuisineTypes && Array.isArray(this.cuisineTypes)) {
    this.cuisineString = this.cuisineTypes.join(" ").toLowerCase();
  }
  next();
});

// Exporting the Model
const merchant = model("Merchant", merchantSchema);

export default merchant;
