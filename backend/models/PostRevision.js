const mongoose = require('mongoose');

const PostRevisionSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    editor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String
    }
}, { timestamps: true });

PostRevisionSchema.index({ post: 1, createdAt: -1 });

module.exports = mongoose.model('PostRevision', PostRevisionSchema); 