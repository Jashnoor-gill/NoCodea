const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
    trim: true,
    maxlength: [100, 'Project name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template'
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
  settings: {
    theme: {
      primaryColor: { type: String, default: '#3b82f6' },
      secondaryColor: { type: String, default: '#8b5cf6' },
      backgroundColor: { type: String, default: '#ffffff' },
      textColor: { type: String, default: '#1f2937' },
      fontFamily: { type: String, default: 'Inter' }
    },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      keywords: [String],
      ogImage: { type: String, default: '' }
    },
    responsive: {
      mobile: { type: Boolean, default: true },
      tablet: { type: Boolean, default: true },
      desktop: { type: Boolean, default: true }
    },
    customCSS: { type: String, default: '' },
    customJS: { type: String, default: '' }
  },
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
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['private', 'public', 'unlisted'],
    default: 'private'
  },
  publishedUrl: {
    type: String,
    default: ''
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  analytics: {
    views: { type: Number, default: 0 },
    lastViewed: { type: Date },
    popularPages: [{
      page: String,
      views: { type: Number, default: 0 }
    }]
  },
  tags: [String],
  category: {
    type: String,
    enum: ['business', 'portfolio', 'blog', 'ecommerce', 'landing', 'other'],
    default: 'other'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
projectSchema.index({ owner: 1, createdAt: -1 });
projectSchema.index({ status: 1, visibility: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ category: 1 });

// Virtual for project URL
projectSchema.virtual('url').get(function() {
  return `/projects/${this._id}`;
});

// Method to get public project data
projectSchema.methods.getPublicData = function() {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    status: this.status,
    visibility: this.visibility,
    publishedUrl: this.publishedUrl,
    version: this.version,
    analytics: this.analytics,
    tags: this.tags,
    category: this.category,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Method to update analytics
projectSchema.methods.incrementViews = function(pageSlug = null) {
  this.analytics.views += 1;
  this.analytics.lastViewed = new Date();
  
  if (pageSlug) {
    const pageIndex = this.analytics.popularPages.findIndex(p => p.page === pageSlug);
    if (pageIndex > -1) {
      this.analytics.popularPages[pageIndex].views += 1;
    } else {
      this.analytics.popularPages.push({ page: pageSlug, views: 1 });
    }
  }
  
  return this.save();
};

// Pre-save middleware to ensure at least one page exists
projectSchema.pre('save', function(next) {
  if (this.pages.length === 0) {
    this.pages.push({
      name: 'Home',
      slug: 'home',
      isHome: true,
      elements: [],
      settings: {
        title: this.name,
        description: this.description,
        layout: 'default'
      }
    });
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema); 