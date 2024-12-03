class ErrorHandler extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.stack = new Error().stack;
  }
}

module.exports = ErrorHandler;
