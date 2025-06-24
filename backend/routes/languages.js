const express = require('express');
const router = express.Router();
const Language = require('../models/Language');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// @route   GET api/languages
// @desc    Get all active languages
// @access  Public
router.get('/', async (req, res) => {
    try {
        const languages = await Language.find({ isActive: true });
        res.json(languages);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/languages
// @desc    Create a language
// @access  Admin
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const newLanguage = new Language(req.body);
        const language = await newLanguage.save();
        res.json(language);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router; 