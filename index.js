import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import ExpressMongoSanitize from "express-mongo-sanitize";
import user from "./routes/user.js";
import dish from "./routes/dish.js";
import connectDB from "./middlewares/connectDB.js";
import restaurant from "./routes/restaurant.js";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(morgan("dev"));
app.use(ExpressMongoSanitize());
app.use(helmet());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use("/user", user);
app.use("/dish", dish);
app.use("/restaurant", restaurant);
app.use("/review", dish);

app.use((req, res) => {
  return res.status(400).json({ message: "Invalid endpoints" });
});

connectDB();
app.listen(4000, () => console.log("Server is running.."));
