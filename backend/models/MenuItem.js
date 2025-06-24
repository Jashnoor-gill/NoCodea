const mongoose = require('mongoose');
const { Schema } = mongoose;

const MenuItemSchema = new Schema({
    label: { type: String, required: true },
    type: {
        type: String,
        enum: ['link', 'page', 'product', 'product-category', 'post-category', 'home', 'shop', 'blog'],
        required: true,
    },
    url: { type: String }, // For 'link' type
    reference: { // For dynamic types like 'page', 'product', etc.
        type: Schema.Types.ObjectId,
        refPath: 'referenceType'
    },
    referenceType: { // To tell Mongoose which model to look in for the 'reference'
        type: String,
        enum: ['Post', 'Product', 'ProductCategory']
    },
    menu: {
        type: Schema.Types.ObjectId,
        ref: 'Menu',
        required: true,
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
        default: null,
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema); 