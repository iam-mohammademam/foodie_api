import { Schema } from "mongoose";

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
