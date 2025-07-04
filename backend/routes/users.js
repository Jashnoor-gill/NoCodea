const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const Address = require('../models/Address');
const Comment = require('../models/Comment');
const DigitalAsset = require('../models/DigitalAsset');
const Country = require('../models/Country');
const Region = require('../models/Region');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// @route   GET api/users/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone },
      { new: true }
    ).select('-password');
    
    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user profile'
    });
  }
});

// Get user addresses
router.get('/addresses', authMiddleware, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id })
      .populate('country', 'name')
      .populate('region', 'name')
      .sort({ isDefault: -1, createdAt: -1 });
    
    // Add country and region names for easier access
    const addressesWithNames = addresses.map(address => ({
      ...address.toObject(),
      countryName: address.country?.name,
      regionName: address.region?.name
    }));
    
    res.json({
      success: true,
      data: addressesWithNames
    });
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching addresses'
    });
  }
});

// Get single address
router.get('/addresses/:id', authMiddleware, async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('country', 'name').populate('region', 'name');
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching address'
    });
  }
});

// Create new address
router.post('/addresses', authMiddleware, async (req, res) => {
  try {
    const addressData = {
      ...req.body,
      user: req.user.id
    };
    
    // If this is set as default, unset other defaults
    if (addressData.isDefault) {
      await Address.updateMany(
        { user: req.user.id },
        { isDefault: false }
      );
    }
    
    const address = new Address(addressData);
    await address.save();
    
    const populatedAddress = await Address.findById(address._id)
      .populate('country', 'name')
      .populate('region', 'name');
    
    res.status(201).json({
      success: true,
      data: populatedAddress,
      message: 'Address created successfully'
    });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating address'
    });
  }
});

// Update address
router.put('/addresses/:id', authMiddleware, async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // If this is set as default, unset other defaults
    if (req.body.isDefault) {
      await Address.updateMany(
        { user: req.user.id, _id: { $ne: req.params.id } },
        { isDefault: false }
      );
    }
    
    Object.assign(address, req.body);
    await address.save();
    
    const updatedAddress = await Address.findById(address._id)
      .populate('country', 'name')
      .populate('region', 'name');
    
    res.json({
      success: true,
      data: updatedAddress,
      message: 'Address updated successfully'
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating address'
    });
  }
});

// Set address as default
router.put('/addresses/:id/default', authMiddleware, async (req, res) => {
  try {
    // Unset all other defaults
    await Address.updateMany(
      { user: req.user.id },
      { isDefault: false }
    );
    
    // Set this address as default
    await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isDefault: true }
    );
    
    res.json({
      success: true,
      message: 'Default address updated successfully'
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting default address'
    });
  }
});

// Delete address
router.delete('/addresses/:id', authMiddleware, async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting address'
    });
  }
});

// Get user comments/reviews
router.get('/comments', authMiddleware, async (req, res) => {
  try {
    const { type = 'reviews' } = req.query;
    
    let query = { user: req.user.id };
    if (type === 'reviews') {
      query.type = 'review';
    } else if (type === 'questions') {
      query.type = 'question';
    }
    
    const comments = await Comment.find(query)
      .populate('product', 'name slug')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('Error fetching user comments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments'
    });
  }
});

// Get user downloads
router.get('/downloads', authMiddleware, async (req, res) => {
  try {
    const downloads = await DigitalAsset.find({
      user: req.user.id,
      orderStatus: 4, // Completed orders
      expiresAt: { $gt: new Date() }
    })
    .populate('product', 'name slug')
    .populate('order', 'orderNumber')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: downloads
    });
  } catch (error) {
    console.error('Error fetching user downloads:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching downloads'
    });
  }
});

// Download digital asset
router.get('/downloads/:id/download', authMiddleware, async (req, res) => {
  try {
    const download = await DigitalAsset.findOne({
      _id: req.params.id,
      user: req.user.id,
      orderStatus: 4
    });
    
    if (!download) {
      return res.status(404).json({
        success: false,
        message: 'Download not found or not authorized'
      });
    }
    
    // Check if download is expired
    if (new Date(download.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Download has expired'
      });
    }
    
    // Check download limit
    if (download.downloadCount >= download.maxDownloads) {
      return res.status(400).json({
        success: false,
        message: 'Download limit reached'
      });
    }
    
    // Increment download count
    download.downloadCount += 1;
    await download.save();
    
    // Log download
    const DigitalAssetLog = require('../models/DigitalAssetLog');
    await DigitalAssetLog.create({
      digitalAsset: download._id,
      user: req.user.id,
      ip: req.ip,
      site: req.headers.host
    });
    
    // Get file path
    const filePath = path.join(__dirname, '../storage/digital_assets', download.filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // Set headers for file download
    res.setHeader('Content-Description', 'File Transfer');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${download.public || download.filename}"`);
    res.setHeader('Expires', '0');
    res.setHeader('Cache-Control', 'must-revalidate');
    res.setHeader('Pragma', 'public');
    res.setHeader('Content-Length', fs.statSync(filePath).size);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading file'
    });
  }
});

// --- Wishlist Routes ---

// @route   GET api/users/me/wishlist
// @desc    Get user's wishlist with filtering, sorting, and pagination
// @access  Private
router.get('/me/wishlist', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const { page = 1, limit = 10, sortBy = 'createdAt', direction = 'desc', manufacturer, vendor, category } = req.query;

        // Base query for products in user's wishlist
        let query = { _id: { $in: user.wishlist } };

        // Apply filters
        if (manufacturer) query.manufacturer = manufacturer;
        if (vendor) query.vendor = vendor;
        if (category) query.category = category;

        const totalProducts = await Product.countDocuments(query);
        const products = await Product.find(query)
            .sort({ [sortBy]: direction === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('category manufacturer vendor');

        res.json({
            products,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/users/me/wishlist
// @desc    Add a product to wishlist
// @access  Private
router.post('/me/wishlist', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user.id);
        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/users/me/wishlist/:productId
// @desc    Remove a product from wishlist
// @access  Private
router.delete('/me/wishlist/:productId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.wishlist.pull(req.params.productId);
        await user.save();
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- Public User Profile ---

// @route   GET api/users/:id
// @desc    Get public user profile
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name username createdAt avatar');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/users/me
// @desc    Delete current user's account and related data
// @access  Private
router.delete('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    // Delete related addresses
    await Address.deleteMany({ user: userId });
    // Delete related comments
    await Comment.deleteMany({ user: userId });
    // Delete related digital assets
    await DigitalAsset.deleteMany({ user: userId });
    // TODO: Delete other related data if needed (orders, etc.)
    // Delete the user
    await User.findByIdAndDelete(userId);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ success: false, message: 'Error deleting account' });
  }
});

// @route   PUT api/users/change-password
// @desc    Change password for authenticated user
// @access  Private
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Old and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Old password is incorrect' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'Error changing password' });
  }
});

module.exports = router; 