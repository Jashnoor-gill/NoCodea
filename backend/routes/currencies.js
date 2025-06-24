const express = require('express');
const router = express.Router();
const Currency = require('../models/Currency');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// @route   GET api/currencies
// @desc    Get all active currencies
// @access  Public
router.get('/', async (req, res) => {
    try {
        const currencies = await Currency.find({ isActive: true });
        res.json(currencies);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/currencies
// @desc    Create a currency
// @access  Admin
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const newCurrency = new Currency(req.body);
        const currency = await newCurrency.save();
        res.json(currency);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router; 