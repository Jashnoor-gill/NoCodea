const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  customerOrderId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  returnReasonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReturnReason',
    required: true
  },
  returnStatusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReturnStatus',
    default: 'pending'
  },
  returnResolutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReturnResolution',
    default: 'pending'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  images: [{
    url: String,
    alt: String
  }],
  adminNotes: {
    type: String,
    maxlength: 1000
  },
  refundAmount: {
    type: Number,
    min: 0
  },
  refundMethod: {
    type: String,
    enum: ['original_payment', 'store_credit', 'bank_transfer'],
    default: 'original_payment'
  },
  trackingNumber: String,
  returnLabel: {
    url: String,
    expiresAt: Date
  },
  estimatedProcessingTime: {
    type: Number, // in days
    default: 7
  },
  processedAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

// Indexes
returnSchema.index({ orderId: 1, userId: 1 });
returnSchema.index({ customerOrderId: 1, email: 1 });
returnSchema.index({ returnStatusId: 1 });
returnSchema.index({ createdAt: -1 });

// Virtual for status
returnSchema.virtual('status').get(function() {
  return this.returnStatusId;
});

// Virtual for reason
returnSchema.virtual('reason').get(function() {
  return this.returnReasonId;
});

// Instance methods
returnSchema.methods.updateStatus = async function(newStatusId) {
  this.returnStatusId = newStatusId;
  if (newStatusId === 'completed') {
    this.completedAt = new Date();
  }
  return await this.save();
};

returnSchema.methods.processRefund = async function(amount, method) {
  this.refundAmount = amount;
  this.refundMethod = method;
  this.processedAt = new Date();
  return await this.save();
};

// Static methods
returnSchema.statics.findByOrderAndEmail = function(customerOrderId, email) {
  return this.findOne({ customerOrderId, email })
    .populate('orderId')
    .populate('returnReasonId')
    .populate('returnStatusId')
    .populate('productId');
};

returnSchema.statics.getUserReturns = function(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ userId })
    .populate('orderId')
    .populate('returnReasonId')
    .populate('returnStatusId')
    .populate('productId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

returnSchema.statics.getReturnStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$returnStatusId',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Pre-save middleware
returnSchema.pre('save', function(next) {
  if (this.isNew) {
    // Set default status if not provided
    if (!this.returnStatusId) {
      this.returnStatusId = 'pending';
    }
    if (!this.returnResolutionId) {
      this.returnResolutionId = 'pending';
    }
  }
  next();
});

module.exports = mongoose.model('Return', returnSchema); 