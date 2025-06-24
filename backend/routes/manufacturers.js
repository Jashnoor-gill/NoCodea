const express = require('express');
const router = express.Router();
const Manufacturer = require('../models/Manufacturer');
const authMiddleware = require('../middleware/auth');

// @route   GET api/manufacturers
// @desc    Get all manufacturers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const manufacturers = await Manufacturer.find().sort({ name: 1 });
    res.json(manufacturers);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/manufacturers
// @desc    Create a manufacturer
// @access  Private (assuming only admins can create)
router.post('/', authMiddleware, async (req, res) => {
  // Add admin role check here in a real app
  try {
    const newManufacturer = new Manufacturer(req.body);
    const manufacturer = await newManufacturer.save();
    res.json(manufacturer);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/manufacturers/:id
// @desc    Update a manufacturer
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        let manufacturer = await Manufacturer.findById(req.params.id);
        if (!manufacturer) return res.status(404).json({ msg: 'Manufacturer not found' });

        manufacturer = await Manufacturer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(manufacturer);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/manufacturers/:id
// @desc    Delete a manufacturer
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const manufacturer = await Manufacturer.findById(req.params.id);
        if (!manufacturer) return res.status(404).json({ msg: 'Manufacturer not found' });

        await Manufacturer.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Manufacturer removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get manufacturer by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const manufacturer = await Manufacturer.findOne({ slug, status: 'active' })
      .populate('logo');
    
    if (!manufacturer) {
      return res.status(404).json({
        success: false,
        message: 'Manufacturer not found'
      });
    }
    
    res.json({
      success: true,
      data: manufacturer
    });
  } catch (error) {
    console.error('Error getting manufacturer by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 