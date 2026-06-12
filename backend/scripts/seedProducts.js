const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const seedProducts = require('../data/seedProducts');
const { validateMongoUri } = require('../config/env');

async function seedProductsInDatabase() {
  const mongoUriError = validateMongoUri();

  if (mongoUriError) {
    throw new Error(mongoUriError);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const shouldReset = process.argv.includes('--reset');

  if (shouldReset) {
    await Product.deleteMany({});
  }

  const existingProducts = await Product.find({ name: { $in: seedProducts.map((product) => product.name) } })
    .select('name')
    .lean();
  const existingNames = new Set(existingProducts.map((product) => product.name));
  const productsToInsert = seedProducts.filter((product) => !existingNames.has(product.name));

  if (productsToInsert.length > 0) {
    await Product.insertMany(productsToInsert);
  }

  const total = await Product.countDocuments();

  console.log(
    `Seed complete. Inserted ${productsToInsert.length} product(s). Database now has ${total} product(s).`
  );
}

seedProductsInDatabase()
  .catch((error) => {
    console.error(`Seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
