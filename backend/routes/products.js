const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// @route   GET api/products
// @desc    Get all products with advanced filtering, sorting, search, and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, manufacturer, vendor, sortBy = 'createdAt', direction = 'desc', search } = req.query;
    
    const filter = { status: 'published' };
    if (search) filter.$text = { $search: search };
    if (category) filter.categories = category;
    if (manufacturer) filter.manufacturer = manufacturer;
    if (vendor) filter.vendor = vendor;

    const products = await Product.find(filter)
      .populate('manufacturer', 'name')
      .populate('vendor', 'name')
      .populate('categories', 'name slug')
      .sort({ [sortBy]: direction })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalProducts: total,
    });

  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/products/:id
// @desc    Get a single product by ID or slug
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({
            $or: [{ _id: req.params.id }, { slug: req.params.id }],
            status: 'published'
        })
        .populate('manufacturer')
        .populate('vendor')
        .populate('categories')
        .populate('subscriptionPlans')
        .populate('digitalAsset');

        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Product not found' });
        res.status(500).send('Server Error');
    }
});

// Get product by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const product = await Product.findOne({ slug, status: 'active' })
      .populate('category', 'name slug')
      .populate('manufacturer', 'name slug logo')
      .populate('vendor', 'name slug image')
      .populate('images')
      .populate('image');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error getting product by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST api/products
// @desc    Create a product
// @access  Private (Admin)
router.post('/', authMiddleware, async (req, res) => {
    // Add admin check here
    try {
        const newProduct = new Product(req.body);
        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/products/:id
// @desc    Update a product (inspired by editorSave)
// @access  Private (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
    // Add admin check here
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router; 