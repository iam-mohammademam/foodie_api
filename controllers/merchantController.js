import merchant from "../model/merchant";

export const createMerchant = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    address,
    cuisineTypes,
    schedule,
    logo,
    banner,
  } = req.body;
  try {
    const merchant = new merchant({
      name,
      email,
      password,
      phone,
      address,
      logo,
      banner,
      cuisineTypes,
      schedule,
    });

    const savedMerchant = await merchant.save();
    console.log("Merchant created:", savedMerchant);
  } catch (err) {
    return res.status(500).json({
      message: err?.message || "Error creating merchant",
    });
  }
};
