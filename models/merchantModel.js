import { Schema, model } from "mongoose";
import {
  addressSchema,
  emailSchema,
  nameSchema,
  passwordSchema,
  phoneSchema,
  ratingSchema,
  resetPasswordSchema,
  scheduleSchema,
  tokenSchema,
  verificationSchema,
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
    schedule: { type: scheduleSchema }, // Open/Close times for each day
    rating: ratingSchema,
    tokens: [tokenSchema],
    verification: verificationSchema,
    resetPassword: { type: resetPasswordSchema },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: "merchant" },
    f2a: { type: Boolean, default: false },
    // isActive: { type: Boolean, default: true },
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
merchantSchema.methods.format = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    address: this.address,
    cuisineTypes: this.cuisineTypes,
    cuisineString: this.cuisineString,
    logo: this.logo,
    banner: this.banner,
    schedule: this.schedule,
    rating: this.rating,
    tokens: this.tokens,
    verification: this.verification,
    isVerified: this.isVerified,
    role: this.role,
    f2a: this.f2a,
  };
};
// Exporting the Model
const merchant = model("Merchant", merchantSchema);

export default merchant;
