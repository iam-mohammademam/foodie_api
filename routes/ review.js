import { Router } from "express";
import { getAllReview, postReview } from "../controllers/reviewController.js";

const review = Router();

review.post("/", postReview);
review.get("/list", getAllReview);

export default review;
