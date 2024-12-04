import dotenv from "dotenv";
dotenv.config();

export const db_url = process.env.DB_URL;
export const nodemailerPass = process.env.NODEMAILER_PASS;
export const nodemailerUser = process.env.NODEMAILER_USER;
export const jwtSecret = process.env.JWT_SECRET;
export const googleClientId = process.env.GOOGLE_CLIENT_ID;
export const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
export const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL;
export const sessionSecret = process.env.SESSION_SECRET;
