const mongoose = require('mongoose');
const { AddressSchema } = require('./Address');

const OrderItemSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    price: { 
        type: Number, 
        required: true 
    } // Price at the time of purchase
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    // Can be null for guest checkouts
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }, 
    customerEmail: { 
        type: String, 
        required: true 
    },
    items: [OrderItemSchema],
    totals: {
        subtotal: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        shipping: { type: Number, default: 0 },
        tax: { type: Number, default: 0 }, // For future use
        grandTotal: { type: Number, required: true }
    },
    billingAddress: { 
        type: AddressSchema, 
        required: true 
    },
    shippingAddress: { 
        type: AddressSchema, 
        required: true 
    },
    paymentMethod: { 
        type: String, 
        required: true 
    },
    // To store payment gateway response, e.g., transaction ID
    paymentData: { 
        type: mongoose.Schema.Types.Mixed 
    }, 
    shippingMethod: { 
        type: String
    },
    // To store shipping provider response
    shippingData: { 
        type: mongoose.Schema.Types.Mixed 
    }, 
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
        default: 'Pending'
    },
    coupon: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Coupon' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema); 