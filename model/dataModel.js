import mongoose from "mongoose";

const modal = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    img: {
      type: String,
    },
  },
  { timestamps: true }
);

const dataModel = new mongoose.model("data", modal);
export default dataModel;
