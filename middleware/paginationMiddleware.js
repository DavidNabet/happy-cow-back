const paginationMiddleware = (req, res, next) => {
  try {
    console.log("query", req.query);

    req.context = {
      page: +parseInt(req.query.page) || 1,
      limit: +parseInt(req.query.limit) || 10,
      skip: (req.query.page - 1) * req.query.limit,
      searchTerm: req.query.q,
      search: new RegExp(req.query.q, "gi"),
    };
    next();
    // page=2&limit=10&skip=2&q=Ice Cream
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export default paginationMiddleware;
