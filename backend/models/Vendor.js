const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  logo: {
    type: String, // URL to the logo image
  },
  contact: {
    email: String,
    phone: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', VendorSchema); 