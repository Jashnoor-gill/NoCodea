const mongoose = require('mongoose');

const ProductCategorySchema = new mongoose.Schema({
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
  description: {
    type: String,
    trim: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    default: null,
  },
  ancestors: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategory'
    },
    name: String,
    slug: String
  }]
}, { timestamps: true });

// Middleware to update ancestors array on save
ProductCategorySchema.pre('save', async function(next) {
    if (this.isModified('parent')) {
        if (this.parent) {
            const parentCategory = await this.constructor.findById(this.parent);
            if (parentCategory) {
                this.ancestors = [...parentCategory.ancestors, { _id: parentCategory._id, name: parentCategory.name, slug: parentCategory.slug }];
            }
        } else {
            this.ancestors = [];
        }
    }
    next();
});

module.exports = mongoose.model('ProductCategory', ProductCategorySchema); 