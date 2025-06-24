const express = require('express');
const router = express.Router();
const SubscriptionPlan = require('../models/SubscriptionPlan');

// @route   GET api/subscription-plans
// @desc    Get all active subscription plans
// @access  Public
router.get('/', async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ status: 'active' }).sort({ price: 1 });
    res.json(plans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// We can add more routes here later (e.g., for creating/updating plans in an admin panel)

module.exports = router; 