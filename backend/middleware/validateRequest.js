const { validationResult } = require('express-validator');

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const error = new Error('Validation failed');
  error.status = 400;
  error.details = errors.array().map((item) => ({
    field: item.path,
    message: item.msg,
  }));

  return next(error);
}

module.exports = validateRequest;
