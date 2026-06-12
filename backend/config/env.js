const mongoUriPattern = /^mongodb(\+srv)?:\/\//i;
const placeholderPattern = /(your_|replace_|placeholder|example|dummy|xxxx|<|>)/i;

function isMissingOrPlaceholder(value) {
  return !value || placeholderPattern.test(value);
}

function validateMongoUri() {
  const mongoUri = process.env.MONGO_URI;

  if (isMissingOrPlaceholder(mongoUri)) {
    return 'MONGO_URI must be set to your local MongoDB or MongoDB Atlas connection string.';
  }

  if (!mongoUriPattern.test(mongoUri)) {
    return 'MONGO_URI must start with mongodb:// or mongodb+srv://.';
  }

  return null;
}

function validateServerEnv() {
  const errors = [];
  const mongoUriError = validateMongoUri();

  if (mongoUriError) {
    errors.push(mongoUriError);
  }

  if (isMissingOrPlaceholder(process.env.JWT_SECRET) || process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be set to a non-placeholder value at least 32 characters long.');
  }

  if (process.env.NODE_ENV === 'production') {
    const productionFrontendUrl =
      process.env.VERCEL_FRONTEND_URL || process.env.FRONTEND_URL || process.env.CLIENT_ORIGIN;

    if (isMissingOrPlaceholder(productionFrontendUrl)) {
      errors.push('Set VERCEL_FRONTEND_URL or FRONTEND_URL to your deployed frontend URL in production.');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Environment configuration error:\n- ${errors.join('\n- ')}`);
  }
}

module.exports = {
  isMissingOrPlaceholder,
  validateMongoUri,
  validateServerEnv,
};
