const express = require('express');
const router = express.Router();
const ProductCategory = require('../models/ProductCategory');
const authMiddleware = require('../middleware/auth');

// @route   GET api/product-categories
// @desc    Get all product categories (can be filtered by parent)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const filter = req.query.parent ? { parent: req.query.parent } : {};
    const categories = await ProductCategory.find(filter).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/product-categories/tree
// @desc    Get all product categories as a tree
// @access  Public
router.get('/tree', async (req, res) => {
    try {
        const categories = await ProductCategory.find({});
        const categoryMap = {};
        const tree = [];

        categories.forEach(category => {
            categoryMap[category._id] = { ...category.toObject(), children: [] };
        });

        categories.forEach(category => {
            if (category.parent && categoryMap[category.parent]) {
                categoryMap[category.parent].children.push(categoryMap[category._id]);
            } else {
                tree.push(categoryMap[category._id]);
            }
        });

        res.json(tree);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/product-categories/:id
// @desc    Get single product category by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const category = await ProductCategory.findById(req.params.id);
        if (!category) return res.status(404).json({ msg: 'Category not found' });
        res.json(category);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/product-categories/:id/breadcrumb
// @desc    Get breadcrumb path for a category
// @access  Public
router.get('/:id/breadcrumb', async (req, res) => {
    try {
        const category = await ProductCategory.findById(req.params.id).select('name slug ancestors');
        if (!category) return res.status(404).json({ msg: 'Category not found' });

        const breadcrumb = [...category.ancestors, { _id: category._id, name: category.name, slug: category.slug }];
        res.json(breadcrumb);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/product-categories/slug/:slug
// @desc    Get product category by slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const category = await ProductCategory.findOne({ slug, status: 'active' })
      .populate('parent', 'name slug')
      .populate('image');
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error getting category by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST api/product-categories
// @desc    Create a product category
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newCategory = new ProductCategory(req.body);
    const category = await newCategory.save();
    res.json(category);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Other CRUD routes (PUT, DELETE) would go here

module.exports = router; 