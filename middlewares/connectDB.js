import mongoose from "mongoose";
import { db_url } from "./variables.js";

const connectDB = async () => {
  if (!db_url) {
    return console.log("undefined database url.");
  }

  try {
    await mongoose.connect(db_url, {
      dbName: "foodie",
    });
    return console.log("connected to  database");
  } catch (error) {
    console.log(error?.message || "couldn't connect to the database.");
    process.exit(1);
  }
};
export default connectDB;
