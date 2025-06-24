const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    images: [String], // URLs to review images
}, { timestamps: true });

// Prevent a user from leaving more than one review per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// After a review is saved, update the average rating on the product
ReviewSchema.post('save', async function() {
    await this.constructor.calculateAverageRating(this.product);
});

// Also update on removal
ReviewSchema.post('remove', async function() {
    await this.constructor.calculateAverageRating(this.product);
});

// Static method to calculate the average rating
ReviewSchema.statics.calculateAverageRating = async function(productId) {
    const Product = mongoose.model('Product');
    const stats = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: '$product',
                reviewCount: { $sum: 1 },
                averageRating: { $avg: '$rating' },
            }
        }
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            reviewCount: stats[0].reviewCount,
            averageRating: stats[0].averageRating,
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            reviewCount: 0,
            averageRating: 0,
        });
    }
};

module.exports = mongoose.model('Review', ReviewSchema); 