const mongoose = require('mongoose');
const { Schema } = mongoose;

const AttributeSchema = new Schema({
  name: String,
  value: String,
});

const VariantSchema = new Schema({
  sku: { type: String, unique: true, sparse: true },
  price: Number,
  stock: Number,
  image: String,
  optionValues: [{
    optionName: String,
    value: String,
  }],
});

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: String,
  basePrice: {
    type: Number,
    required: true,
  },
  oldPrice: {
    type: Number,
  },
  stock: {
    type: Number,
    default: 0,
  },
  images: [String],
  manufacturer: {
    type: Schema.Types.ObjectId,
    ref: 'Manufacturer',
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'ProductCategory',
  }],
  attributes: [AttributeSchema],
  options: [{
    name: String,
    values: [String],
  }],
  variants: [VariantSchema],
  subscriptionPlans: [{
    type: Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
  }],
  digitalAsset: {
    type: Schema.Types.ObjectId,
    ref: 'DigitalAsset',
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  taxable: {
    type: Boolean,
    default: true,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

// Add text index for searching
ProductSchema.index({ name: 'text', description: 'text', sku: 'text' });

module.exports = mongoose.model('Product', ProductSchema); 