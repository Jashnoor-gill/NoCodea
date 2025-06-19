const express = require('express');
const Template = require('../models/Template');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/templates
// @desc    Get all templates
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = {
      status: 'published',
      visibility: { $in: ['public', 'featured'] }
    };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    const templates = await Template.find(filter)
      .populate('creator', 'name avatar')
      .sort({ 'stats.downloads': -1, 'stats.rating': -1 })
      .skip(skip)
      .limit(limit);

    const total = await Template.countDocuments(filter);

    res.json({
      success: true,
      data: templates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/templates/featured
// @desc    Get featured templates
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const templates = await Template.getFeatured(8);

    res.json({
      success: true,
      data: templates
    });

  } catch (error) {
    console.error('Get featured templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/templates/:id
// @desc    Get template by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id)
      .populate('creator', 'name avatar');

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Increment downloads if user is authenticated
    if (req.user) {
      await template.incrementDownloads();
    }

    res.json({
      success: true,
      data: template
    });

  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 