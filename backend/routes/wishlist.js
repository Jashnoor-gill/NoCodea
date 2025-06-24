const express = require('express');
const { body, validationResult } = require('express-validator');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const priority = req.query.priority;

    let query = { userId: req.user.id };
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      query.priority = priority;
    }

    const wishlist = await Wishlist.find(query)
      .populate('productId')
      .sort({ addedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Wishlist.countDocuments(query);

    res.json({
      success: true,
      data: wishlist,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/wishlist/add
// @desc    Add product to wishlist
// @access  Private
router.post('/add', auth, [
  body('productId', 'Product ID is required').not().isEmpty(),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('notes').optional().isLength({ max: 500 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }

  const { productId, priority, notes } = req.body;

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Add to wishlist
    const result = await Wishlist.addToWishlist(req.user.id, productId, {
      priority,
      notes,
      priceWhenAdded: product.price
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    // Populate product details
    await result.data.populate('productId');

    res.json({
      success: true,
      message: 'Product added to wishlist',
      data: result.data
    });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/wishlist/remove/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const removed = await Wishlist.removeFromWishlist(req.user.id, productId);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist'
      });
    }

    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/wishlist/:productId/update
// @desc    Update wishlist item
// @access  Private
router.put('/:productId/update', auth, [
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('notes').optional().isLength({ max: 500 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }

  try {
    const { productId } = req.params;
    const { priority, notes } = req.body;

    const wishlistItem = await Wishlist.findOne({
      userId: req.user.id,
      productId
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist'
      });
    }

    if (priority) {
      wishlistItem.priority = priority;
    }
    if (notes !== undefined) {
      wishlistItem.notes = notes;
    }

    await wishlistItem.save();
    await wishlistItem.populate('productId');

    res.json({
      success: true,
      message: 'Wishlist item updated',
      data: wishlistItem
    });

  } catch (error) {
    console.error('Update wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/wishlist/check/:productId
// @desc    Check if product is in wishlist
// @access  Private
router.get('/check/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const isInWishlist = await Wishlist.isInWishlist(req.user.id, productId);

    res.json({
      success: true,
      data: {
        isInWishlist
      }
    });

  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/wishlist/count
// @desc    Get wishlist count
// @access  Private
router.get('/count', auth, async (req, res) => {
  try {
    const count = await Wishlist.getWishlistCount(req.user.id);

    res.json({
      success: true,
      data: {
        count
      }
    });

  } catch (error) {
    console.error('Get wishlist count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/wishlist/priority/:priority
// @desc    Get wishlist items by priority
// @access  Private
router.get('/priority/:priority', auth, async (req, res) => {
  try {
    const { priority } = req.params;

    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority level'
      });
    }

    const wishlist = await Wishlist.getWishlistByPriority(req.user.id, priority);

    res.json({
      success: true,
      data: wishlist
    });

  } catch (error) {
    console.error('Get wishlist by priority error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/wishlist/move-to-cart/:productId
// @desc    Move wishlist item to cart (placeholder for cart integration)
// @access  Private
router.post('/move-to-cart/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlistItem = await Wishlist.findOne({
      userId: req.user.id,
      productId
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist'
      });
    }

    // TODO: Add to cart logic here
    // For now, just return success
    res.json({
      success: true,
      message: 'Product moved to cart (placeholder)',
      data: {
        productId,
        moved: true
      }
    });

  } catch (error) {
    console.error('Move to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 