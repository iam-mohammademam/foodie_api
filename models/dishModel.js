import { Schema, model } from "mongoose";

// Schema Definition
const dishSchema = new Schema(
  {
    merchant: {
      type: Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Dish name is required"],
      trim: true,
      maxlength: [100, "Dish name must not exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description must not exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    category: {
      type: String,
      //   enum: ["Appetizer", "Main Course", "Dessert", "Beverage"],
      required: [true, "Category is required"],
    },
    image: {
      type: String, // URL for the dish image
      required: [true, "Image URL is required"],
    },
    availability: {
      type: Boolean,
      default: true, // Indicates if the dish is currently available
    },
    ratings: {
      type: Number,
      min: [0, "Ratings must be at least 0"],
      max: [5, "Ratings must not exceed 5"],
      default: 0,
    },
    ingredients: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
    toObject: { virtuals: true },
  }
);

// Indexing for better performance
dishSchema.index({ name: "text", category: 1 });

// Virtual property: Price in different currency
dishSchema.virtual("priceInUSD").get(function () {
  return (this.price / 100).toFixed(2); // Assuming price is stored in cents
});

// Static method: Get dishes by category
dishSchema.statics.findByCategory = async function (category) {
  return this.find({ category, availability: true });
};

// Instance method: Format data
dishSchema.methods.format = function () {
  return {
    id: this._id,
    merchant: this.merchant,
    name: this.name,
    description: this.description,
    price: `$${this.priceInUSD}`,
    category: this.category,
    image: this.image,
    ratings: this.ratings,
    ingredients: this.ingredients,
    availability: this.availability,
  };
};

// Compile Model
const Dish = model("Dish", dishSchema);

export default Dish;
