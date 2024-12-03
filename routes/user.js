import { Router } from "express";

import { register } from "../controllers/user/register.js";
import { login, logout } from "../controllers/user/login&out.js";
import { deleteUser } from "../controllers/user/delete.js";

const user = Router();
// routes
user.post("/register", register);
user.post("/login", login);
user.post("/logout", logout);
user.delete("/delete", deleteUser);

export default user;
