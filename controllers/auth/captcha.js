import { captchaKey } from "../../middlewares/variables";
import { handleStatus } from "../../utils/utils";

export const verifyCaptcha = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return handleStatus(res, 400, "Captcha is required");
  }
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${captchaKey}&response=${token}&remoteip=${req.ip}`
    );
    const data = await response.json();
    console.log(data);
    if (data.success) {
      return handleStatus(res, 200, "Captcha  has been verified");
    } else {
      return handleStatus(res, 500, "Captcha verification failed");
    }
  } catch (err) {
    console.log(err.message);
    return handleStatus(res, 500, err.message || "Error verifying CAPTCHA");
  }
};
