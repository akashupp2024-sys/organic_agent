const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Validation middleware
const validateCreateOrder = [
  body('orderId')
    .trim()
    .notEmpty()
    .withMessage('Order ID is required'),
  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Amount must be a positive number'),
];

const validateVerifyPayment = [
  body('orderId')
    .trim()
    .notEmpty()
    .withMessage('Order ID is required'),
  body('razorpayOrderId')
    .trim()
    .notEmpty()
    .withMessage('Razorpay Order ID is required'),
  body('razorpayPaymentId')
    .trim()
    .notEmpty()
    .withMessage('Razorpay Payment ID is required'),
  body('razorpaySignature')
    .trim()
    .notEmpty()
    .withMessage('Razorpay Signature is required'),
];

// Protected routes
router.post('/create-order', protect, validateCreateOrder, validateRequest, createOrder);
router.post('/verify', protect, validateVerifyPayment, validateRequest, verifyPayment);

module.exports = router;
