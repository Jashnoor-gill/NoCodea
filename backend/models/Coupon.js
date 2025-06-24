const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', CouponSchema); 