const errorHandler = (err, req, res, next) => {
  console.log(err);

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.statusCode ? err.message : "Something went wrong",
  });
};

export default errorHandler;
