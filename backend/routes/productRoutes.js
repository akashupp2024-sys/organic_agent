const express = require('express');
const {
  getAllProducts,
  getProductById,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Validation middleware
const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Comment is required')
    .isLength({ min: 10 })
    .withMessage('Comment must be at least 10 characters long'),
];

const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn(['Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Beverages'])
    .withMessage('Invalid category'),
  body('image')
    .isURL()
    .withMessage('Please provide a valid image URL'),
];

// Public routes
router.get('/', getAllProducts);
router.get('/admin/all', protect, adminOnly, getAdminProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, adminOnly, validateProduct, validateRequest, createProduct);
router.put('/:id', protect, adminOnly, validateProduct, validateRequest, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

// User review route
router.post('/:id/review', protect, validateReview, validateRequest, addReview);

module.exports = router;
