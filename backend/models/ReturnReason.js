const mongoose = require('mongoose');

const returnReasonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  category: {
    type: String,
    enum: ['product_issue', 'customer_preference', 'shipping_issue', 'other'],
    default: 'other'
  },
  requiresImage: {
    type: Boolean,
    default: false
  },
  requiresDescription: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  autoApprove: {
    type: Boolean,
    default: false
  },
  refundPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  }
}, {
  timestamps: true
});

// Indexes
returnReasonSchema.index({ isActive: 1, sortOrder: 1 });
returnReasonSchema.index({ category: 1 });

// Static methods
returnReasonSchema.statics.getActiveReasons = function() {
  return this.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 });
};

returnReasonSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true })
    .sort({ sortOrder: 1, name: 1 });
};

// Instance methods
returnReasonSchema.methods.toggleActive = async function() {
  this.isActive = !this.isActive;
  return await this.save();
};

module.exports = mongoose.model('ReturnReason', returnReasonSchema); 