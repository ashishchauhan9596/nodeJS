const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message,
  };
  if (err.details) {
    response.validationErrors = err.details; // Add detailed validation messages
  }
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  console.log(response);
  res.status(err.statusCode).json(response);
};

module.exports = errorMiddleware;
