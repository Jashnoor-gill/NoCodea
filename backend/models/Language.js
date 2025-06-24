const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
  name: { // e.g., English, Español
    type: String,
    required: true,
  },
  code: { // e.g., en, es
    type: String,
    required: true,
    unique: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Language', LanguageSchema); 