const Order = require('../models/Order');
const Product = require('../models/Product');

// @route   POST /api/orders
// @desc    Create a new order (Protected)
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    // Validate input
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: 'No order items provided' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: 'Payment method is required' });
    }

    // Validate and update order items with current product details
    let itemsPrice = 0;
    const validatedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      if (!product.inStock) {
        return res.status(400).json({ error: `Product ${product.name} is out of stock` });
      }

      // Use current product price from database
      const price = product.price;
      const quantity = parseInt(item.quantity);

      if (quantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be greater than 0' });
      }

      validatedItems.push({
        productId: product._id,
        name: product.name,
        image: product.image,
        price,
        quantity,
      });

      itemsPrice += price * quantity;
    }

    // Calculate delivery charge (free for orders > 500, else 50)
    const deliveryCharge = itemsPrice > 500 ? 0 : 50;
    const totalPrice = itemsPrice + deliveryCharge;

    // Create order
    const order = new Order({
      user: req.user._id,
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      deliveryCharge,
      totalPrice,
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Create Order Error:', error.message);
    res.status(500).json({ error: error.message || 'Error creating order' });
  }
};

// @route   GET /api/orders/my
// @desc    Get logged-in user's orders (Protected)
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Get My Orders Error:', error.message);
    res.status(500).json({ error: error.message || 'Error fetching orders' });
  }
};

// @route   GET /api/orders/:id
// @desc    Get order by ID (Protected - only owner or admin)
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is owner or admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Order not found' });
    }
    console.error('Get Order Error:', error.message);
    res.status(500).json({ error: error.message || 'Error fetching order' });
  }
};

// @route   GET /api/orders
// @desc    Get all orders with user info (Admin only)
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build filter
    let filter = {};
    if (status) {
      filter.status = status;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count
    const total = await Order.countDocuments(filter);

    // Get orders
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      orders,
    });
  } catch (error) {
    console.error('Get All Orders Error:', error.message);
    res.status(500).json({ error: error.message || 'Error fetching orders' });
  }
};

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, isPaid, isDelivered } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update status if provided
    if (status) {
      order.status = status;
    }

    // Update payment status if provided
    if (isPaid !== undefined) {
      order.isPaid = isPaid;
      if (isPaid && !order.paidAt) {
        order.paidAt = Date.now();
      }
    }

    // Update delivery status if provided
    if (isDelivered !== undefined) {
      order.isDelivered = isDelivered;
      if (isDelivered && !order.deliveredAt) {
        order.deliveredAt = Date.now();
        order.status = 'Delivered';
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Order not found' });
    }
    console.error('Update Order Status Error:', error.message);
    res.status(500).json({ error: error.message || 'Error updating order status' });
  }
};
