import { Router } from "express";
import { login, register } from "../controllers/userController";
import { getAllData, postData } from "../controllers/dataController";

const data = Router();

data.post("/upload", postData);
data.get("/", getAllData);

export default data;
