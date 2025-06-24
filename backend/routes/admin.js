const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// All routes in this file are protected by auth and admin middleware
router.use(authMiddleware);
router.use(adminMiddleware);

// @route   GET api/admin/users
// @desc    Get all users (for admin)
// @access  Admin
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/users/:id
// @desc    Get user by ID (for admin)
// @access  Admin
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router; 