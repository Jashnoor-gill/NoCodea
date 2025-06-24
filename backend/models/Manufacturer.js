const mongoose = require('mongoose');

const ManufacturerSchema = new mongoose.Schema({
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
  website: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Manufacturer', ManufacturerSchema); 