import { createTransport } from "nodemailer";
import { nodemailerPass, nodemailerUser } from "./variables.js";

export const transporter = createTransport({
  service: "gmail",
  auth: {
    user: nodemailerUser,
    pass: nodemailerPass,
  },
});
