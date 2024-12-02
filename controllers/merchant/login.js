import merchantModel from "../../models/merchantModel.js";
import {
  generateAuthToken,
  validatePassword,
} from "../../utils/handleSchema.js";
import {
  getSelectFields,
  handleStatus,
  validateFields,
} from "../../utils/utils.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return validateFields({ email, password }, res);
  }
  const fields = getSelectFields(req.query.fields);
  try {
    const merchant = await merchantModel
      .findOne({ email })
      .select(`_id password tokens ${fields}`);
    if (!merchant) {
      return handleStatus(res, 404, "No account found for this email.");
    }
    if (!merchant.isVerified) {
      return handleStatus(res, 401, "Please verify your email first.");
    }
    await validatePassword(password, merchant);
    await generateAuthToken(merchant);
    const dataToReturn = merchant.toObject();
    delete dataToReturn.password;
    return handleStatus(res, 200, "", dataToReturn);
  } catch (error) {
    console.error("Login Error:", error);
    return handleStatus(res, 500, error.message || "Failed to login merchant");
  }
};
