const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    isoCode: { 
        type: String, 
        required: true, 
        unique: true, 
        uppercase: true, 
        trim: true 
    },
    status: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Country', CountrySchema); 