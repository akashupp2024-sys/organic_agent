const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { isMissingOrPlaceholder } = require('../config/env');

function getRazorpayConfigError() {
  if (
    isMissingOrPlaceholder(process.env.RAZORPAY_KEY_ID) ||
    isMissingOrPlaceholder(process.env.RAZORPAY_KEY_SECRET)
  ) {
    return 'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.';
  }

  return null;
}

function createRazorpayClient() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// @route   POST /api/payment/create-order
// @desc    Create a Razorpay order (Protected)
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const configError = getRazorpayConfigError();
    if (configError) {
      return res.status(503).json({ success: false, error: configError });
    }

    const { orderId, amount } = req.body;

    // Validate input
    if (!orderId || !amount) {
      return res.status(400).json({ error: 'Order ID and amount are required' });
    }

    // Fetch order from database
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to pay for this order' });
    }

    // Create Razorpay order
    // Amount should be in paise (1 rupee = 100 paise)
    const razorpay = createRazorpayClient();
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${orderId}`,
      notes: {
        orderId: orderId,
        userId: req.user._id.toString(),
      },
    });

    res.status(200).json({
      success: true,
      razorpayOrder,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Create Razorpay Order Error:', error.message);
    res.status(500).json({ error: error.message || 'Error creating payment order' });
  }
};

// @route   POST /api/payment/verify
// @desc    Verify payment signature and update order (Protected)
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const configError = getRazorpayConfigError();
    if (configError) {
      return res.status(503).json({ success: false, error: configError });
    }

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Validate input
    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ error: 'Missing payment verification details' });
    }

    // Fetch order from database
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to verify this payment' });
    }

    // Verify signature using HMAC SHA256
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed - Invalid signature',
      });
    }

    // Signature is valid - update order
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      status: 'success',
    };
    order.status = 'Processing'; // Update status to Processing after payment

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order,
    });
  } catch (error) {
    console.error('Verify Payment Error:', error.message);
    res.status(500).json({ error: error.message || 'Error verifying payment' });
  }
};
