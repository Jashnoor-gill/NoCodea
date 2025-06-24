const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const MenuItem = require('../models/MenuItem');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// --- Public Route ---

// @route   GET api/menus/:slug
// @desc    Get a fully resolved menu tree by slug
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const menu = await Menu.findOne({ slug: req.params.slug });
        if (!menu) return res.status(404).json({ msg: 'Menu not found' });

        const items = await MenuItem.find({ menu: menu._id }).populate('reference').sort('order');
        
        const itemMap = {};
        const menuTree = [];

        items.forEach(item => {
            const itemObj = item.toObject();
            
            // Generate URL for dynamic items
            if (itemObj.reference) {
                switch (itemObj.referenceType) {
                    case 'Product':
                        itemObj.url = `/products/${itemObj.reference.slug}`;
                        break;
                    case 'ProductCategory':
                        itemObj.url = `/category/${itemObj.reference.slug}`;
                        break;
                    // Add other cases for posts, etc.
                }
            }
            
            itemMap[itemObj._id] = { ...itemObj, children: [] };
        });

        items.forEach(item => {
            if (item.parent && itemMap[item.parent]) {
                itemMap[item.parent].children.push(itemMap[item._id]);
            } else {
                menuTree.push(itemMap[item._id]);
            }
        });

        res.json({ name: menu.name, items: menuTree });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// --- Admin Routes ---
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const newMenu = new Menu(req.body);
    const menu = await newMenu.save();
    res.json(menu);
});

router.post('/items', authMiddleware, adminMiddleware, async (req, res) => {
    const newMenuItem = new MenuItem(req.body);
    const menuItem = await newMenuItem.save();
    res.json(menuItem);
});

module.exports = router; 