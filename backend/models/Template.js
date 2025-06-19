const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a template name'],
    trim: true,
    maxlength: [100, 'Template name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a template description'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['business', 'portfolio', 'blog', 'ecommerce', 'landing', 'restaurant', 'agency', 'personal', 'other']
  },
  tags: [{
    type: String,
    trim: true
  }],
  thumbnail: {
    type: String,
    required: [true, 'Please provide a thumbnail image']
  },
  previewImages: [{
    type: String
  }],
  demoUrl: {
    type: String
  },
  elements: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['container', 'text', 'image', 'button', 'form', 'video', 'map', 'social', 'custom']
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    styles: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 }
    },
    size: {
      width: { type: String, default: 'auto' },
      height: { type: String, default: 'auto' }
    },
    children: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Element'
    }],
    parent: {
      type: String,
      default: null
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  pages: [{
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    isHome: {
      type: Boolean,
      default: false
    },
    elements: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Element'
    }],
    settings: {
      title: String,
      description: String,
      layout: {
        type: String,
        enum: ['default', 'full-width', 'sidebar'],
        default: 'default'
      }
    }
  }],
  settings: {
    theme: {
      primaryColor: { type: String, default: '#3b82f6' },
      secondaryColor: { type: String, default: '#8b5cf6' },
      backgroundColor: { type: String, default: '#ffffff' },
      textColor: { type: String, default: '#1f2937' },
      fontFamily: { type: String, default: 'Inter' }
    },
    responsive: {
      mobile: { type: Boolean, default: true },
      tablet: { type: Boolean, default: true },
      desktop: { type: Boolean, default: true }
    },
    customCSS: { type: String, default: '' },
    customJS: { type: String, default: '' }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['private', 'public', 'featured'],
    default: 'public'
  },
  isOfficial: {
    type: Boolean,
    default: false
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  estimatedTime: {
    type: Number, // in minutes
    default: 30
  },
  features: [{
    type: String,
    enum: ['responsive', 'seo-optimized', 'fast-loading', 'customizable', 'multilingual', 'ecommerce-ready', 'blog-ready', 'contact-form', 'analytics', 'social-media']
  }],
  stats: {
    downloads: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    lastDownloaded: { type: Date }
  },
  requirements: {
    minVersion: { type: String, default: '1.0.0' },
    dependencies: [String],
    browserSupport: [String]
  },
  license: {
    type: String,
    enum: ['free', 'premium', 'commercial'],
    default: 'free'
  },
  price: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
templateSchema.index({ category: 1, status: 1, visibility: 1 });
templateSchema.index({ tags: 1 });
templateSchema.index({ creator: 1 });
templateSchema.index({ isOfficial: 1, status: 1 });
templateSchema.index({ 'stats.downloads': -1 });
templateSchema.index({ 'stats.rating': -1 });

// Virtual for template URL
templateSchema.virtual('url').get(function() {
  return `/templates/${this._id}`;
});

// Method to get public template data
templateSchema.methods.getPublicData = function() {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    category: this.category,
    tags: this.tags,
    thumbnail: this.thumbnail,
    previewImages: this.previewImages,
    demoUrl: this.demoUrl,
    difficulty: this.difficulty,
    estimatedTime: this.estimatedTime,
    features: this.features,
    stats: this.stats,
    license: this.license,
    price: this.price,
    creator: this.creator,
    isOfficial: this.isOfficial,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Method to increment downloads
templateSchema.methods.incrementDownloads = function() {
  this.stats.downloads += 1;
  this.stats.lastDownloaded = new Date();
  return this.save();
};

// Method to update rating
templateSchema.methods.updateRating = function(newRating) {
  const currentTotal = this.stats.rating * this.stats.reviews;
  this.stats.reviews += 1;
  this.stats.rating = (currentTotal + newRating) / this.stats.reviews;
  return this.save();
};

// Static method to get featured templates
templateSchema.statics.getFeatured = function(limit = 10) {
  return this.find({
    status: 'published',
    visibility: { $in: ['public', 'featured'] }
  })
  .sort({ 'stats.downloads': -1, 'stats.rating': -1 })
  .limit(limit)
  .populate('creator', 'name avatar');
};

// Static method to get templates by category
templateSchema.statics.getByCategory = function(category, limit = 20) {
  return this.find({
    category,
    status: 'published',
    visibility: 'public'
  })
  .sort({ 'stats.downloads': -1 })
  .limit(limit)
  .populate('creator', 'name avatar');
};

module.exports = mongoose.model('Template', templateSchema); 