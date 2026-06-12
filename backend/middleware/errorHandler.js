function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const normalizedStatus = statusCode >= 400 && statusCode < 600 ? statusCode : 500;
  const isProduction = process.env.NODE_ENV === 'production';

  const response = {
    success: false,
    error: normalizedStatus === 500 && isProduction ? 'Internal Server Error' : err.message || 'Server Error',
    status: normalizedStatus,
  };

  if (err.details) {
    response.details = err.details;
  }

  if (err.name === 'MulterError') {
    response.error = err.code === 'LIMIT_FILE_SIZE' ? 'Uploaded file is too large' : err.message;
    response.status = 400;
    return res.status(400).json(response);
  }

  if (err.name === 'ValidationError') {
    response.error = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
    response.status = 400;
    return res.status(400).json(response);
  }

  if (err.name === 'CastError') {
    response.error = 'Resource not found';
    response.status = 404;
    return res.status(404).json(response);
  }

  if (err.code === 11000) {
    response.error = 'Duplicate field value entered';
    response.status = 400;
    return res.status(400).json(response);
  }

  if (!isProduction && err.stack) {
    response.stack = err.stack;
  }

  return res.status(response.status).json(response);
}

module.exports = errorHandler;
