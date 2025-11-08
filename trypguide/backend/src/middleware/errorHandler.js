const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Validation errors
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation Error';
    errors = err.errors;
  }

  // Database errors
  if (err.code === '23505') {
    status = 409;
    message = 'Resource already exists';
  }

  if (err.code === '23503') {
    status = 400;
    message = 'Invalid reference';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
  }

  // Send response
  res.status(status).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
