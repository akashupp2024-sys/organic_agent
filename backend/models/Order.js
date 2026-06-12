const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
});

const shippingAddressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Recipient name is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number'],
  },
  street: {
    type: String,
    required: [true, 'Street address is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  state: {
    type: String,
    required: [true, 'State is required'],
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    match: [/^\d{6}$/, 'Please provide a valid 6-digit pincode'],
  },
});

const paymentResultSchema = new mongoose.Schema({
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    orderItems: {
      type: [orderItemSchema],
      required: [true, 'Order must have items'],
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: 'Order must have at least one item',
      },
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['UPI', 'Card', 'Razorpay', 'COD'],
    },
    paymentResult: {
      type: paymentResultSchema,
      default: {},
    },
    itemsPrice: {
      type: Number,
      required: true,
      min: [0, 'Items price cannot be negative'],
    },
    deliveryCharge: {
      type: Number,
      default: 0,
      min: [0, 'Delivery charge cannot be negative'],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative'],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        message: 'Invalid order status',
      },
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save validation: auto-update status based on delivery status
orderSchema.pre('save', function (next) {
  if (this.isDelivered && this.status !== 'Delivered') {
    this.status = 'Delivered';
    this.deliveredAt = Date.now();
  }

  if (this.isPaid && !this.paidAt) {
    this.paidAt = Date.now();
  }

  next();
});

// Populate user details when fetching orders
orderSchema.pre('find', function () {
  this.populate('user', 'name email phone');
});

orderSchema.pre('findOne', function () {
  this.populate('user', 'name email phone');
});

module.exports = mongoose.model('Order', orderSchema);
