const express = require('express');
const router = express.Router();
const shippingService = require('../services/shippingService');

// @route   GET api/shipping/methods
// @desc    Get available shipping methods
// @access  Public
router.get('/methods', (req, res) => {
  try {
    // const checkoutInfo = req.session.checkout || {};
    const methods = shippingService.getMethods();
    res.json(methods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 