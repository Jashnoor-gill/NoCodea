const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

// Index for efficient comment retrieval for a post
CommentSchema.index({ post: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', CommentSchema); 