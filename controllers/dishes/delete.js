import { handleStatus } from "../../utils/utils.js";
import dishModel from "../../models/dishModel.js";

export const deleteDish = async (req, res) => {
  const { id } = req.params;
  const { merchantId } = req.query;
  if (!id || !merchantId) {
    return handleStatus(res, 400, "Dish ID and merchant ID are required.");
  }
  try {
    const dish = await dishModel.findById(id);
    if (!dish) {
      return handleStatus(res, 404, "Dish not found.");
    }
    console.log(dish.merchant.toString());
    console.log(merchantId);
    if (dish.merchant.toString() !== merchantId) {
      return handleStatus(
        res,
        403,
        "You are not authorized to delete this dish."
      );
    }
    await dish.deleteOne();
    return handleStatus(res, 200, "Dish deleted successfully.");
  } catch (error) {
    console.error("Error deleting dish:", error.message);
    return handleStatus(res, 500, error.message);
  }
};
