import { Router } from "express";
import { getAllData, postData } from "../controllers/dataController.js";

const data = Router();

data.post("/upload", postData);
data.get("/", getAllData);

export default data;
