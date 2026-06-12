const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all products with filtering, searching, sorting, and pagination
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 10 } = req.query;

    // Build filter object
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    let sortOption = { createdAt: -1 }; // Default: newest first

    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    // Get products
    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(limitNum)
      .skip(skip);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    console.error('Get All Products Error:', error.message);
    res.status(500).json({ error: error.message || 'Error fetching products' });
  }
};

// @route   GET /api/products/admin/all
// @desc    Get all products for admin dashboard
// @access  Private/Admin
exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      total: products.length,
      products,
    });
  } catch (error) {
    console.error('Get Admin Products Error:', error.message);
    res.status(500).json({ error: error.message || 'Error fetching products' });
  }
};

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.userId', 'name email');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.error('Get Product Error:', error.message);
    res.status(500).json({ error: error.message || 'Error fetching product' });
  }
};

// @route   POST /api/products
// @desc    Create a new product (Admin only)
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, originalPrice, discount, category, image, inStock } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if product already exists
    let product = await Product.findOne({ name });
    if (product) {
      return res.status(400).json({ error: 'Product with this name already exists' });
    }

    // Create new product
    product = new Product({
      name,
      description,
      price,
      originalPrice,
      discount,
      category,
      image,
      inStock: inStock !== undefined ? inStock : true,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create Product Error:', error.message);
    res.status(500).json({ error: error.message || 'Error creating product' });
  }
};

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update fields
    const { name, description, price, originalPrice, discount, category, image, inStock } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (originalPrice !== undefined) product.originalPrice = originalPrice;
    if (discount !== undefined) product.discount = discount;
    if (category) product.category = category;
    if (image) product.image = image;
    if (inStock !== undefined) product.inStock = inStock;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.error('Update Product Error:', error.message);
    res.status(500).json({ error: error.message || 'Error updating product' });
  }
};

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.error('Delete Product Error:', error.message);
    res.status(500).json({ error: error.message || 'Error deleting product' });
  }
};

// @route   POST /api/products/:id/review
// @desc    Add a review to a product (Logged-in users only)
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Validate input
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Please provide rating and comment' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      (review) => review.userId.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    // Add review
    const review = {
      userId: req.user._id,
      name: req.user.name,
      rating,
      comment,
      date: Date.now(),
    };

    product.reviews.push(review);

    // Update rating and numReviews
    const totalRating = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    product.rating = parseFloat((totalRating / product.reviews.length).toFixed(1));
    product.numReviews = product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      product,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.error('Add Review Error:', error.message);
    res.status(500).json({ error: error.message || 'Error adding review' });
  }
};
