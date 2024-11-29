export const handleError = (res, message, status = 500) => {
  return res.status(status).json({ message });
};

export const validateFields = (fields, res) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      return handleError(res, `The ${key} field is required.`, 400);
    }
  }
  return true;
};
