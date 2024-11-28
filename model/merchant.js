import { Schema, model } from "mongoose";

// Address Schema for reusability
const addressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "Bangladesh" },
  },
  { _id: false }
); // Embedded sub-document

// Schedule Schema
const scheduleSchema = new Schema(
  {
    day: {
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
      required: true,
    },
    openTime: { type: String, required: true }, // Format: HH:mm
    closeTime: { type: String, required: true },
  },
  { _id: false }
);

// Merchant Schema
const merchantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8 }, // Password hashing recommended in controllers
    phone: { type: String, required: true, unique: true },
    address: { type: addressSchema, required: true },
    cuisineTypes: [{ type: String }], // e.g., ["Italian", "Chinese"]
    logo: { type: String }, // URL for the logo
    banner: { type: String }, // URL for the banner image
    schedule: [scheduleSchema], // Open/Close times for each day
    rating: { type: Number, default: 0, min: 0, max: 5 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes for performance
merchantSchema.index({ name: "text", cuisineTypes: 1 });

// Static Methods (Reusable across instances)
merchantSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

// Instance Methods (Reusable for each instance)
merchantSchema.methods.verifyMerchant = function () {
  this.isVerified = true;
  return this.save();
};

// Exporting the Model
const merchant = model("Merchant", merchantSchema);

export default merchant;
