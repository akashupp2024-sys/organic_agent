const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @middleware  Protect routes - verify JWT token
// @desc        Verify JWT token from Authorization header and attach user to req.user
// @access      Private
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({ error: 'Not authorized to access this route - no token provided' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Get user from token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    res.status(401).json({ error: 'Not authorized to access this route' });
  }
};

// @middleware  Admin only - check if user is admin
// @desc        Verify if req.user.role === 'admin'
// @access      Private/Admin
exports.adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized - user not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied - admin privileges required' });
    }

    next();
  } catch (error) {
    console.error('Admin Middleware Error:', error.message);
    res.status(403).json({ error: 'Access denied' });
  }
};
