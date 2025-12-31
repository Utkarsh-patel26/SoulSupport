/**
 * Global Error Handling Middleware
 */

const errorHandler = (err, req, res, next) => {
  // Set default error values
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong MongoDB ID error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = {
      statusCode: 400,
      message,
    };
  }

  // Duplicate key error (MongoDB)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    err = {
      statusCode: 400,
      message,
    };
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please authenticate again.";
    err = {
      statusCode: 401,
      message,
    };
  }

  // JWT expired error
  if (err.name === "TokenExpiredError") {
    const message = "Token has expired. Please login again.";
    err = {
      statusCode: 401,
      message,
    };
  }

  // Validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    err = {
      statusCode: 400,
      message: messages.join(", "),
    };
  }

  res.status(err.statusCode).json({
    success: false,
    statusCode: err.statusCode,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * Async Handler Wrapper (handles promise rejections)
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Custom API Error Class
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = {
  errorHandler,
  asyncHandler,
  ApiError,
};
