const mongoose = require('mongoose');

const digitalAssetSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  public: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number
  },
  mimeType: {
    type: String
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  maxDownloads: {
    type: Number,
    default: 5
  },
  expiresAt: {
    type: Date,
    required: true
  },
  orderStatus: {
    type: Number,
    default: 1 // 1: Pending, 2: Processing, 3: Shipped, 4: Completed, 5: Cancelled
  },
  customerOrderId: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
digitalAssetSchema.index({ user: 1, orderStatus: 1 });
digitalAssetSchema.index({ user: 1, expiresAt: 1 });
digitalAssetSchema.index({ product: 1, user: 1 });

// Virtual for checking if download is expired
digitalAssetSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiresAt;
});

// Virtual for checking if download limit reached
digitalAssetSchema.virtual('limitReached').get(function() {
  return this.downloadCount >= this.maxDownloads;
});

// Virtual for remaining downloads
digitalAssetSchema.virtual('remainingDownloads').get(function() {
  return Math.max(0, this.maxDownloads - this.downloadCount);
});

module.exports = mongoose.model('DigitalAsset', digitalAssetSchema); 