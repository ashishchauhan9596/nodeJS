const ErrorHandler = require("../utilities/ErrorHandler");

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body || req.params, {
      abortEarly: false,
    });
    if (error) {
      const messages = error.details.map((err) => err.message); // Extract validation error messages
      return next(new ErrorHandler("Validation Error", 400, messages));
    }
    next();
  };
};

module.exports = validationMiddleware;
