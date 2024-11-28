import dotenv from "dotenv";
dotenv.config();

export const db_url = process.env.DB_URL;
export const pass = process.env.PASS;
export const jwtSecret = process.env.JWT_SECRET;
