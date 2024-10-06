import restaurantModel from "../model/restaurantModel.js";

export const postRestaurant = async (req, res) => {
  const { title, img, tags, desc, latitude, longitude } = req.body;

  if (!title || !img || !longitude || !latitude || !tags) {
    return res.status(400).json({
      message: "Body can't be empty!",
    });
  }
  try {
    const createRestaurant = await restaurantModel.create({
      title,
      img,
      tags,
      desc,
      latitude,
      longitude,
    });
    return res.json({
      result: createRestaurant,
    });
  } catch (error) {
    console.log(error?.message);
  }
};
export const getAllRestaurant = async (req, res) => {
  try {
    const findData = await restaurantModel.find();
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
export const deleteRestaurant = async (req, res) => {};
export const updateRestaurant = async (req, res) => {};
