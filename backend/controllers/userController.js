const User = require('../models/User');

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      total: users.length,
      users,
    });
  } catch (error) {
    console.error('Get All Users Error:', error.message);
    res.status(500).json({ error: error.message || 'Error fetching users' });
  }
};
