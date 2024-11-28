import mongoose from "mongoose";
import { db_url } from "./variables.js";

/**
 * Connects to the MongoDB database.
 * @returns {Promise<void>} Resolves if the connection is successful, otherwise logs the error and exits the process.
 */
const connectDB = async () => {
  try {
    if (!db_url) {
      throw new Error("Database URL is not defined.");
    }

    await mongoose.connect(db_url, { dbName: "foodie" });

    console.log("✅ Connected to the database successfully.");
  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`);
    process.exit(1); // Exit the process on failure
  }
};

export default connectDB;
