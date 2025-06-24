const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// @route   GET api/tags
// @desc    Get all tags
// @access  Public
router.get('/', async (req, res) => {
    try {
        const tags = await Tag.find().sort({ name: 1 });
        res.json(tags);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/tags
// @desc    Create a tag
// @access  Admin
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const { name, slug, description } = req.body;
    try {
        const newTag = new Tag({ name, slug, description });
        const tag = await newTag.save();
        res.json(tag);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/tags/:id
// @desc    Update a tag
// @access  Admin
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const tag = await Tag.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(tag);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/tags/:id
// @desc    Delete a tag
// @access  Admin
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await Tag.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Tag removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router; 