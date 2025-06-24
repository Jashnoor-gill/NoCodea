const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: { // e.g., USD, EUR
    type: String,
    required: true,
    unique: true,
  },
  symbol: { // e.g., $, €
    type: String,
    required: true,
  },
  exchangeRate: { // Rate against a base currency (e.g., USD)
    type: Number,
    required: true,
    default: 1,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Currency', CurrencySchema); 