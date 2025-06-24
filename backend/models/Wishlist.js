const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: 500
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  priceWhenAdded: {
    type: Number,
    min: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique user-product combinations
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Indexes for performance
wishlistSchema.index({ userId: 1, addedAt: -1 });
wishlistSchema.index({ userId: 1, priority: 1 });

// Virtual for product details
wishlistSchema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: '_id',
  justOne: true
});

// Instance methods
wishlistSchema.methods.updatePriority = async function(priority) {
  this.priority = priority;
  return await this.save();
};

wishlistSchema.methods.addNotes = async function(notes) {
  this.notes = notes;
  return await this.save();
};

// Static methods
wishlistSchema.statics.getUserWishlist = function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return this.find({ userId })
    .populate('productId')
    .sort({ addedAt: -1 })
    .skip(skip)
    .limit(limit);
};

wishlistSchema.statics.addToWishlist = async function(userId, productId, options = {}) {
  try {
    const existingItem = await this.findOne({ userId, productId });
    
    if (existingItem) {
      return { success: false, message: 'Product already in wishlist' };
    }

    const wishlistItem = new this({
      userId,
      productId,
      notes: options.notes,
      priority: options.priority || 'medium',
      priceWhenAdded: options.priceWhenAdded
    });

    await wishlistItem.save();
    return { success: true, data: wishlistItem };
  } catch (error) {
    if (error.code === 11000) {
      return { success: false, message: 'Product already in wishlist' };
    }
    throw error;
  }
};

wishlistSchema.statics.removeFromWishlist = async function(userId, productId) {
  const result = await this.deleteOne({ userId, productId });
  return result.deletedCount > 0;
};

wishlistSchema.statics.isInWishlist = async function(userId, productId) {
  const item = await this.findOne({ userId, productId });
  return !!item;
};

wishlistSchema.statics.getWishlistCount = function(userId) {
  return this.countDocuments({ userId });
};

wishlistSchema.statics.getWishlistByPriority = function(userId, priority) {
  return this.find({ userId, priority })
    .populate('productId')
    .sort({ addedAt: -1 });
};

// Pre-save middleware to get product price
wishlistSchema.pre('save', async function(next) {
  if (this.isNew && !this.priceWhenAdded) {
    try {
      const Product = mongoose.model('Product');
      const product = await Product.findById(this.productId);
      if (product && product.price) {
        this.priceWhenAdded = product.price;
      }
    } catch (error) {
      console.error('Error getting product price:', error);
    }
  }
  next();
});

module.exports = mongoose.model('Wishlist', wishlistSchema); 