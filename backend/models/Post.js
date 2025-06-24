const mongoose = require('mongoose');

const PostContentSchema = new mongoose.Schema({
    language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language',
        required: true
    },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    excerpt: { type: String, trim: true },
    content: { type: String, required: true }
}, { _id: false });

const PostSchema = new mongoose.Schema({
  // Content is now an array of language-specific sub-documents
  localizedContent: [PostContentSchema],

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // The primary category for the post
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostCategory'
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: null,
  },
  type: {
    type: String,
    enum: ['post', 'page'],
    default: 'post'
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  // To assign a specific frontend template file
  template: {
      type: String,
      trim: true
  }
}, { timestamps: true });

// Add text index for searching on all localized titles and content
PostSchema.index({ "localizedContent.title": 'text', "localizedContent.content": 'text' });

module.exports = mongoose.model('Post', PostSchema); 