const mongoose = require('mongoose');

const digitalAssetLogSchema = new mongoose.Schema({
  digitalAsset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DigitalAsset',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  site: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  downloadDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
digitalAssetLogSchema.index({ digitalAsset: 1, user: 1 });
digitalAssetLogSchema.index({ downloadDate: -1 });

module.exports = mongoose.model('DigitalAssetLog', digitalAssetLogSchema); 