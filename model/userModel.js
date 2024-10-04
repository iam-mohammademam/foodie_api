import mongoose from "mongoose";

const modal = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    status: {
      type: String,
      default: "user",
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userModal = new mongoose.model("user", modal);
export default userModal;
