const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const authMiddleware = require('../middleware/auth');

// @route   GET api/vendors
// @desc    Get all vendors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ name: 1 });
    res.json(vendors);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/vendors
// @desc    Create a vendor
// @access  Private (user must be logged in)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newVendor = new Vendor({
        ...req.body,
        owner: req.user.id
    });
    const vendor = await newVendor.save();
    res.json(vendor);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get vendor by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const vendor = await Vendor.findOne({ slug, status: 'active' })
      .populate('image');
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }
    
    res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    console.error('Error getting vendor by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add PUT and DELETE routes here for managing vendors

module.exports = router; 