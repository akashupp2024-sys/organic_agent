const mongoSanitize = require('express-mongo-sanitize');

const sanitizeOptions = {
  replaceWith: '_',
};

function sanitizeRequest(req, res, next) {
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body, sanitizeOptions);
  }

  if (req.params) {
    req.params = mongoSanitize.sanitize(req.params, sanitizeOptions);
  }

  if (req.headers) {
    req.headers = mongoSanitize.sanitize(req.headers, sanitizeOptions);
  }

  if (req.query) {
    const sanitizedQuery = mongoSanitize.sanitize({ ...req.query }, sanitizeOptions);
    Object.defineProperty(req, 'query', {
      value: sanitizedQuery,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }

  next();
}

module.exports = sanitizeRequest;
