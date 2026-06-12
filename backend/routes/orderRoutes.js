const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Validation middleware
const validateOrder = [
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Order must have at least one item'),
  body('shippingAddress.name')
    .trim()
    .notEmpty()
    .withMessage('Recipient name is required'),
  body('shippingAddress.phone')
    .matches(/^\d{10}$/)
    .withMessage('Phone must be a 10-digit number'),
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.pincode')
    .matches(/^\d{6}$/)
    .withMessage('Pincode must be a 6-digit number'),
  body('paymentMethod')
    .isIn(['UPI', 'Card', 'Razorpay', 'COD'])
    .withMessage('Invalid payment method'),
];

const validateOrderStatus = [
  body('status')
    .optional()
    .isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'])
    .withMessage('Invalid order status'),
  body('isPaid')
    .optional()
    .isBoolean()
    .withMessage('isPaid must be a boolean'),
  body('isDelivered')
    .optional()
    .isBoolean()
    .withMessage('isDelivered must be a boolean'),
];

// Protected routes (user)
router.post('/', protect, validateOrder, validateRequest, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, validateOrderStatus, validateRequest, updateOrderStatus);

module.exports = router;
