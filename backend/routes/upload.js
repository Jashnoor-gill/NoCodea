const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and common web assets
    if (file.mimetype.startsWith('image/') || 
        file.mimetype.startsWith('text/') ||
        file.mimetype.includes('javascript') ||
        file.mimetype.includes('css')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// @route   POST /api/upload/image
// @desc    Upload image
// @access  Private
router.post('/image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // For now, we'll return a mock URL
    // In production, you'd upload to Cloudinary, AWS S3, etc.
    const mockUrl = `https://via.placeholder.com/800x600/3b82f6/ffffff?text=Uploaded+Image`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: mockUrl,
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });

  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during upload'
    });
  }
});

// @route   POST /api/upload/assets
// @desc    Upload multiple assets
// @access  Private
router.post('/assets', auth, upload.array('assets', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      url: `https://via.placeholder.com/400x300/8b5cf6/ffffff?text=${file.originalname}`,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      success: true,
      message: 'Assets uploaded successfully',
      data: uploadedFiles
    });

  } catch (error) {
    console.error('Upload assets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during upload'
    });
  }
});

module.exports = router; 