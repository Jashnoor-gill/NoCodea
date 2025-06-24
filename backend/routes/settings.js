const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// @route   GET api/settings
// @desc    Get site settings
// @access  Public
router.get('/', async (req, res) => {
    try {
        let settings = await SiteSettings.findOne({ name: 'default' });
        if (!settings) {
            settings = await SiteSettings.create({ name: 'default' });
        }
        res.json(settings.settings);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/settings
// @desc    Update site settings
// @access  Admin
router.put('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const updatedSettings = await SiteSettings.findOneAndUpdate(
            { name: 'default' },
            { $set: { settings: req.body } },
            { new: true, upsert: true }
        );
        res.json(updatedSettings.settings);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router; 