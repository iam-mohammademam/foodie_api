const paginate = (model) => async (filter, options) => {
  const { page = 1, limit = 10, sort = {} } = options;
  const skip = (page - 1) * limit;

  const [results, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(limit),
    model.countDocuments(filter),
  ]);

  return {
    total,
    page,
    limit,
    results,
  };
};

export default paginate;
