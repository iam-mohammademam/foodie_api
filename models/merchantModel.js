import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

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
);

// Schedule Schema
const scheduleSchema = new Schema(
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

// Merchant Schema
const merchantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    phone: { type: String, required: true, unique: true },
    address: { type: addressSchema, required: true },
    cuisineTypes: [{ type: String }], // e.g., ["Italian", "Chinese"]
    cuisineString: { type: String }, // Preprocessed string for indexing
    logo: { type: String }, // URL for the logo
    banner: { type: String }, // URL for the banner image
    schedule: [scheduleSchema], // Open/Close times for each day
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
    },
    isVerified: { type: Boolean, default: false },
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

// Hash password method
merchantSchema.methods.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10); // Use a constant salt rounds value
  this.password = await bcrypt.hash(password, salt);
};

// Static Method to find by email
merchantSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

// Instance Method to verify a merchant
merchantSchema.methods.verifyMerchant = async function () {
  this.isVerified = true;
  return this.save();
};

// Instance Method to validate a password
merchantSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Exporting the Model
const merchant = model("Merchant", merchantSchema);

export default merchant;
