const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    price: Number, // Storing price at time of adding to cart
});

const CartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    items: [CartItemSchema],
    coupon: {
        type: Schema.Types.ObjectId,
        ref: 'Coupon',
    },
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema); 