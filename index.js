import express from "express";
import cors from "cors";
// import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import dotenv from "dotenv";
// Import routes and middlewares
import connectDB from "./middlewares/connectDB.js";
import userRoutes from "./routes/user.js";
import merchantRoutes from "./routes/merchant.js";
import authRoutes from "./routes/auth.js";
// Load environment variables
dotenv.config();
const app = express();
// Middleware Configuration
const configureMiddlewares = (app) => {
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "*", // Use environment variable for allowed origins
      credentials: true,
    })
  );
  app.use(express.json({ limit: "50mb" }));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(helmet());
  app.use(mongoSanitize());
  app.use(morgan("dev"));
}; // Route Configuration
const configureRoutes = (app) => {
  app.use("/user", userRoutes);
  app.use("/auth", authRoutes);
  app.use("/merchant", merchantRoutes);
  // Handle invalid routes
  app.use((req, res) => {
    res.status(404).json({ message: "Invalid endpoint" });
  });
}; // Initialize Server
const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Configure middlewares
    configureMiddlewares(app);

    // Configure routes
    configureRoutes(app);

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1); // Exit process on failure
  }
}; // Start server
startServer();
