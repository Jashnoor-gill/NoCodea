const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');

// @route   GET api/reviews/product/:productId
// @desc    Get all reviews and stats for a product
// @access  Public
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name avatar');
        
        const stats = await Review.aggregate([
            { $match: { product: mongoose.Types.ObjectId(req.params.productId) } },
            { $group: { _id: '$product', reviewCount: { $sum: 1 }, averageRating: { $avg: '$rating' } } }
        ]);
        
        const summary = await Review.aggregate([
            { $match: { product: mongoose.Types.ObjectId(req.params.productId) } },
            { $group: { _id: '$rating', count: { $sum: 1 } } },
            { $sort: { '_id': 1 } }
        ]);

        const ratingSummary = {};
        for(let i=1; i<=5; i++) ratingSummary[i] = { count: 0, percent: 0 };
        let totalReviews = 0;
        summary.forEach(item => {
            ratingSummary[item._id].count = item.count;
            totalReviews += item.count;
        });
        if(totalReviews > 0) {
            for(let i=1; i<=5; i++) ratingSummary[i].percent = (ratingSummary[i].count / totalReviews) * 100;
        }

        res.json({
            reviews,
            stats: stats.length > 0 ? stats[0] : { reviewCount: 0, averageRating: 0 },
            summary: ratingSummary
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/reviews
// @desc    Create a review
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newReview = new Review({ ...req.body, user: req.user.id });
        const review = await newReview.save();
        res.json(review);
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ msg: 'You have already reviewed this product.' });
        res.status(500).send('Server Error');
    }
});

module.exports = router; 