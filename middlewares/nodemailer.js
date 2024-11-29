import { createTransport } from "nodemailer";
import { nodemailerPass, nodemailerUser } from "./variables.js";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: nodemailerUser,
    pass: nodemailerPass,
  },
});

export const nodemailer = async (receiverEmail, otp) => {
  if (!receiverEmail || !otp) {
    throw new Error("Receiver email & OTP are required");
  }
  try {
    const info = await transporter.sendMail({
      from: '"Foodie" <foodie@gmail.com>', // sender address
      to: receiverEmail, // recipient email
      subject: "Your Foodie OTP Code", // Subject line
      text: `Hello,

Thank you for using Foodie! Your One-Time Password (OTP) is: ${otp}

This code will expire in 10 minutes. Please do not share this code with anyone.

If you did not request this OTP, please ignore this email.

Best regards,
The Foodie Team`, // plain text body
      html: `
    <div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333;">
      <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
        <header style="text-align: center; margin-bottom: 20px;">
          <img src="https://your-logo-url.com/logo.png" alt="Foodie Logo" style="width: 150px;"/>
        </header>
        <main>
          <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
          <p style="font-size: 16px; line-height: 1.6;">
            Thank you for using <strong>Foodie</strong>! Your One-Time Password (OTP) is:
          </p>
          <p style="width: fit; font-size: 24px; font-weight: bold; text-align: center; margin: 20px auto; padding: 10px; border-radius: 5px; background-color: #ff6600; color: #fff;">${otp}</p>
          <p style="font-size: 16px; line-height: 1.6;">
            This code will expire in <strong>10 minutes</strong>. Please do not share this code with anyone.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            If you did not request this OTP, please ignore this email.
          </p>
        </main>
        <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #666;">
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p>
            Need help? Contact our support team at 
            <a href="mailto:support@foodie.com" style="color: #ff6600; text-decoration: none;">support@foodie.com</a>
          </p>
          <p style="margin-top: 10px;">&copy; ${new Date().getFullYear()} Foodie. All rights reserved.</p>
        </footer>
      </div>
    </div>
  `, // HTML body
    });

    return { messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
