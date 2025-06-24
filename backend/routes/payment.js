const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');

// @route   GET api/payment/methods
// @desc    Get available payment methods
// @access  Public
router.get('/methods', (req, res) => {
  try {
    // In a real app, you might pass checkout info from the session or request body
    // const checkoutInfo = req.session.checkout || {};
    const methods = paymentService.getMethods();
    res.json(methods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 