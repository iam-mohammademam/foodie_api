import crypto from "crypto";
// send success/error
export const handleStatus = (res, status, message = "", results = null) => {
  // Validate status
  if (typeof status !== "number") {
    throw new TypeError("Status must be a number.");
  }

  // Validate message
  if (message && typeof message !== "string") {
    throw new TypeError("Message must be a string.");
  }

  // Validate results
  if (results !== null && typeof results !== "object") {
    throw new TypeError("Results must be an object or null.");
  }

  // Construct the response object
  const response = {
    success: status >= 200 && status < 300,
  };

  if (message) response.message = message;
  if (results) response.results = results;

  // Send the response
  res.status(status).json(response);
}; // validate fields
export const validateFields = (fields, res) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      return handleStatus(res, 400, `${key} is required.`);
    }
  }
  return true;
}; // Get select fields based on user input
export const getSelectFields = (
  fields,
  defaultFields = "_id name cuisineTypes banner schedule"
) => {
  if (fields) {
    // If user has provided specific fields, concatenate them with the default fields
    const userFields = fields
      .split(",")
      .map((field) => field.trim())
      .join(" ");
    return `${defaultFields} ${userFields}`.trim();
  }
  // If no fields are provided, return the default fields
  return defaultFields;
}; // build the dynamic query object for searching
export const getQueryObject = ({
  cuisineType,
  name,
  minRating = 0,
  maxRating = 5,
  isActive,
  isVerified,
}) => {
  const query = {};

  // Filter by cuisineType if provided
  if (cuisineType) {
    const cuisineTypesArray = cuisineType
      .split(",")
      .map((type) => type.trim().toLowerCase());
    query.$text = { $search: cuisineTypesArray.join(" ") }; // Use text index for matching cuisine types
  }
  // Filter by name if provided
  if (name) {
    query.name = { $regex: name, $options: "i" }; // Case-insensitive search for name
  }

  // Filter by rating range
  query.rating = { $gte: minRating, $lte: maxRating };

  // Filter by active/verified status
  if (isActive !== undefined) query.isActive = isActive === "true";
  if (isVerified !== undefined) query.isVerified = isVerified === "true";

  return query;
}; // generate otp
export const generateOtp = () => {
  const otp = Math.floor(10000 + Math.random() * 90000);
  return otp;
}; // check fields are undefined
export const checkFields = (fields) => {
  const hasFieldsToUpdate = Object.values(fields).some(
    (value) => value != null
  );

  if (!hasFieldsToUpdate) {
    return handleStatus(res, 400, "No fields provided.");
  }
}; // generate random string
export const generateString = () => {
  const length = Math.floor(Math.random() * (15 - 11 + 1)) + 11;
  const string = crypto.randomBytes(length).toString("hex");
  return string;
};
generateOtp();
