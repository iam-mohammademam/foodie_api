import dotenv from "dotenv";
dotenv.config();

export const db_url = process.env.DB_URL;
export const nodemailerPass = process.env.NODEMAILER_PASS;
export const nodemailerUser = process.env.NODEMAILER_USER;
export const jwtSecret = process.env.JWT_SECRET;
