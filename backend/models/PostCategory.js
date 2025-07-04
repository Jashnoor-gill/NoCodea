const mongoose = require('mongoose');

const PostCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('PostCategory', PostCategorySchema); 