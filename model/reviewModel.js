import mongoose from "mongoose";

const modal = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Data",
      required: true,
    },
  },
  { timestamps: true }
);

const reviewModel = new mongoose.model("review", modal);
export default reviewModel;
