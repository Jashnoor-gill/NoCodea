const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// @route   GET api/compare
// @desc    Get user's comparison list with product details
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'compare',
            populate: ['category', 'manufacturer', 'vendor', 'attributes.attribute']
        });
        res.json(user.compare);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/compare
// @desc    Add a product to comparison list
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user.id);
        if (!user.compare.includes(productId)) {
            user.compare.push(productId);
            await user.save();
        }
        res.json(user.compare);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/compare/:productId
// @desc    Remove a product from comparison list
// @access  Private
router.delete('/:productId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.compare.pull(req.params.productId);
        await user.save();
        res.json(user.compare);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router; 