const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuestionSchema = new Schema({
    content: { type: String, required: true },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    parent: { // For answers
        type: Schema.Types.ObjectId,
        ref: 'Question',
        default: null,
    },
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema); 