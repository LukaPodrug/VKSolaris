export const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      message: 'Validation Error',
      errors
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired'
    });
  }

  // PostgreSQL errors
  if (error.code === '23505') { // Unique violation
    return res.status(409).json({
      message: 'Resource already exists',
      field: error.constraint
    });
  }

  if (error.code === '23503') { // Foreign key violation
    return res.status(400).json({
      message: 'Referenced resource not found'
    });
  }

  // Stripe errors
  if (error.type === 'StripeCardError') {
    return res.status(400).json({
      message: 'Payment failed',
      details: error.message
    });
  }

  if (error.type === 'StripeInvalidRequestError') {
    return res.status(400).json({
      message: 'Invalid payment request',
      details: error.message
    });
  }

  // Default error
  res.status(error.status || 500).json({
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};