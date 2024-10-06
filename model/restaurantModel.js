import mongoose from "mongoose";

const modal = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    tags: {
      type: Array,
      //   required: true,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    img: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const restaurantModel = new mongoose.model("restaurant", modal);
export default restaurantModel;
