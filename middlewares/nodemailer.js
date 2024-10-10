import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "abir141578@gmail.com",
    pass: "vpjocrouawmevbre",
  },
});

const nodemailer = async () => {
  try {
    const info = await transporter.sendMail({
      from: '"Organization name" <maddison53@ethereal.email>', // sender address
      to: "mohammademam.info@gmail.com", // list of receivers`s email addresses
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
};
export default nodemailer;
// main().catch(console.error);
