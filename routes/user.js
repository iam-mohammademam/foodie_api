import { Router } from "express";

import { register } from "../controllers/user/register.js";

const user = Router();
// routes
user.post("/register", register);

export default user;
