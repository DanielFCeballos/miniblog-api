function errorHandler(error, req, res, next) {
  console.error(error);

  res.status(500).json({
    error: "internal server error"
  });
}

module.exports = errorHandler;
