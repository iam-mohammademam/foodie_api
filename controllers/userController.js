import bcrypt from "bcryptjs";
import userModel from "../model/userModel.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name,email & password are required!",
    });
  }
  try {
    const findUser = await userModel.findOne({ email });
    if (findUser)
      return res.status(403).json({
        message: "This email already in use, please login!",
      });
    const hashPassword = bcrypt.hashSync(
      password,
      Math.floor(Math.random() * 10)
    );
    // create a user
    const createUser = await userModel.create({
      name,
      email,
      // avatar: req.body.avatar || avatar,
      password: hashPassword,
    });
    return res.status(201).json({
      message: "Registration successful.",
      result: createUser,
    });
  } catch (error) {
    console.log(error?.message);
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email & password are required!",
    });
  }
  try {
    const findUser = await userModel.findOne({ email });
    if (!findUser) {
      return res.status(404).json({
        message: "No account found.",
      });
    }
    const checkPass = bcrypt.compareSync(password, findUser.password);
    if (!checkPass) {
      return res.status(401).json({
        message: "Incorrect password.",
      });
    }
    return res.json({
      result: findUser,
    });
  } catch (error) {
    console.log(error?.message);
  }
};
export const deleteUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email & password are required!",
    });
  }
  try {
    const findUser = await userModel.findOne({ email });
    if (!findUser) {
      return res.status(404).json({
        message: "No account found.",
      });
    }
    const checkPass = bcrypt.compareSync(password, findUser.password);
    if (!checkPass) {
      return res.status(401).json({
        message: "Incorrect password.",
      });
    }
    await userModel.findOneAndDelete({ email });
    return res.json({
      message: "Deleted.",
    });
  } catch (error) {
    console.log(error?.message);
  }
};
