import dataModel from "../model/dishModel.js";

export const postData = async (req, res) => {
  const { title, img, price, desc, category } = req.body;

  if (!title || !img || !price || !desc || !category) {
    return res.status(400).json({
      message: "Body can't be empty!",
    });
  }
  try {
    const createData = await dataModel.create({
      title,
      price,
      img,
      desc,
      category,
    });
    return res.json({
      result: createData,
    });
  } catch (error) {
    console.log(error?.message);
  }
};
export const getAllData = async (req, res) => {
  try {
    const findData = await dataModel.find();
    if (!findData) {
      return res.status(404).json({
        message: "No data found!",
      });
    }
    return res.json({
      result: findData,
    });
  } catch (error) {
    console.log(error?.message);
  }
};
