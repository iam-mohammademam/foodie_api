import express from "express";
import cors from "cors";
import session from "cookie-session";
import passport from "passport";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import cluster from "cluster";
import os from "os";

// Import routes and middlewares
import connectDB from "./middlewares/connectDB.js";
import userRoutes from "./routes/user.js";
import merchantRoutes from "./routes/merchant.js";
import authRoutes from "./routes/auth.js";
import dishRoutes from "./routes/dish.js";
import { sessionSecret } from "./middlewares/variables.js";
import google from "./routes/google.js";

// Environment Variables
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";

// Configure middlewares
const configureMiddlewares = (app) => {
  // Security headers
  app.use(helmet());
  // Sanitize inputs to prevent NoSQL injection
  app.use(mongoSanitize());
  // Enable CORS
  app.use(
    cors({
      origin: CLIENT_ORIGIN,
      credentials: true,
    })
  ); // Parse incoming requests
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  // Session setup
  app.use(
    session({
      name: "google-auth-session",
      keys: [sessionSecret],
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
  ); // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  // Add request logging
  app.use(morgan("dev"));
  // Disable X-Powered-By for security
  app.disable("x-powered-by");
}; // configure routes
const configureRoutes = (app) => {
  app.use("/user", userRoutes);
  app.use("/auth", authRoutes);
  app.use("/merchant", merchantRoutes);
  app.use("/dish", dishRoutes);
  app.use("/", google);
  // 404 Handler for undefined routes
  app.use((req, res) => {
    res.status(404).json({ message: "Invalid endpoint" });
  });
}; // start server function
const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();
    // Create Express app
    const app = express();
    // Configure middlewares and routes
    configureMiddlewares(app);
    configureRoutes(app);
    // Start the server
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1); // Exit process on failure
  }
}; // clustering logic
if (cluster.isPrimary) {
  // Clustering logic for utilizing all CPU cores
  const numCPUs = os.cpus().length;
  console.log(
    `Primary process running on PID ${process.pid}, starting ${numCPUs} workers...`
  );
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    console.error(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // Worker process: start the server
  startServer();
}
