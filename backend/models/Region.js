const mongoose = require('mongoose');

const RegionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    country: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Country', 
        required: true 
    },
    status: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

// Ensure region names are unique within a single country
RegionSchema.index({ name: 1, country: 1 }, { unique: true });

module.exports = mongoose.model('Region', RegionSchema); 