import { transporter } from "../middlewares/nodemailer.js";

const sendLink = async (receiverEmail, resetLink) => {
  try {
    const info = await transporter.sendMail({
      from: '"Foodie" <abir141578@gmail.com>', // sender address
      to: receiverEmail, // recipient email
      subject: "Reset Your Password", // Subject line
      text: `Hello,
      We received a request to reset your password for your Foodie account. Click the link below to reset your password:
      ${resetLink}
      This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.
      Best regards,
      The Foodie Team`,
      html: `
    <div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; color: #333;">
      <table align="center" width="600" cellpadding="0" cellspacing="0" style="margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; background-color: #ffffff; overflow: hidden;">
        <tr>
          <td style="background-color: #007bff; padding: 20px; text-align: center; color: #ffffff; font-size: 24px; font-weight: bold;">
            Reset Your Password
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; text-align: left; font-size: 16px; line-height: 1.6;">
            <p>Hello,</p>
            <p>We received a request to reset your password for your <strong>Foodie</strong> account. Click the button below to reset your password:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 4px;">Reset Password</a>
            </p>
            <p>If the button above does not work, you can also copy and paste the following link into your browser:</p>
            <p style="word-break: break-all; color: #007bff; font-size: 14px;">${resetLink}</p>
            <p>This link will expire in <strong>5 minutes</strong>. If you did not request a password reset, you can safely ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f8f9fa; text-align: center; padding: 15px; font-size: 14px; color: #666;">
            <p>If you have any questions, feel free to contact our support team at <a href="mailto:support@yourcompany.com" style="color: #007bff;">support@yourcompany.com</a>.</p>
            <p style="margin-top: 10px;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </div>
  `,
    });

    return { messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
export default sendLink;
