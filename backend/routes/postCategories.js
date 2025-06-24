const express = require('express');
const router = express.Router();
const PostCategory = require('../models/PostCategory');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// @route   GET api/post-categories
// @desc    Get all post categories
// @access  Public
router.get('/', async (req, res) => {
    try {
        const categories = await PostCategory.find().sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/post-categories/:slug
// @desc    Get a single post category by slug
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const category = await PostCategory.findOne({ slug: req.params.slug });
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/post-categories
// @desc    Create a post category
// @access  Admin
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    // ... validation ...
    const { name, slug, description } = req.body;
    try {
        const newCategory = new PostCategory({ name, slug, description });
        const category = await newCategory.save();
        res.json(category);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/post-categories/:id
// @desc    Update a post category
// @access  Admin
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const category = await PostCategory.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(category);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/post-categories/:id
// @desc    Delete a post category
// @access  Admin
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await PostCategory.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Category removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router; 