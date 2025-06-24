const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');
const path = require('path');

router.use(authMiddleware);

// @route   GET api/downloads
// @desc    Get a list of user's available digital assets
// @access  Private
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id, status: 'completed' })
            .populate({
                path: 'items.product',
                select: 'name digitalAsset',
                populate: {
                    path: 'digitalAsset'
                }
            });

        const digitalAssets = orders
            .flatMap(order => order.items)
            .filter(item => item.product && item.product.digitalAsset)
            .map(item => ({
                orderId: item._id,
                productName: item.product.name,
                asset: item.product.digitalAsset
            }));
        
        res.json(digitalAssets);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/downloads/:assetId
// @desc    Download a digital asset
// @access  Private
router.get('/:assetId', async (req, res) => {
    try {
        // In a real app, you would have much more robust security here,
        // checking if the user actually purchased this specific asset.
        // This is a simplified version for demonstration.
        
        // This is a placeholder for file serving logic.
        // For now, it sends a message. In a real app, you would use res.download().
        res.send(`(Simulated) Downloading asset ${req.params.assetId}`);

    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router; 