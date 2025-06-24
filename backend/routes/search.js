const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const Manufacturer = require('../models/Manufacturer');
const Vendor = require('../models/Vendor');
const Post = require('../models/Post');

// @route   GET api/search
// @desc    Search across all content types
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { q, type, page = 1, limit = 12 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: [],
        meta: {
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: 0
        }
      });
    }

    const searchQuery = { $regex: q, $options: 'i' };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    let results = [];
    let total = 0;

    // Search based on type
    switch (type) {
      case 'product':
        const products = await Product.find({
          $or: [
            { name: searchQuery },
            { shortDescription: searchQuery },
            { description: searchQuery },
            { sku: searchQuery }
          ],
          status: 'active'
        })
        .populate('category', 'name slug')
        .populate('manufacturer', 'name slug')
        .populate('vendor', 'name slug')
        .populate('image')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

        total = await Product.countDocuments({
          $or: [
            { name: searchQuery },
            { shortDescription: searchQuery },
            { description: searchQuery },
            { sku: searchQuery }
          ],
          status: 'active'
        });

        results = products.map(product => ({
          ...product.toObject(),
          type: 'product'
        }));
        break;

      case 'category':
        const categories = await ProductCategory.find({
          $or: [
            { name: searchQuery },
            { description: searchQuery }
          ],
          status: 'active'
        })
        .populate('parent', 'name slug')
        .populate('image')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

        total = await ProductCategory.countDocuments({
          $or: [
            { name: searchQuery },
            { description: searchQuery }
          ],
          status: 'active'
        });

        results = categories.map(category => ({
          ...category.toObject(),
          type: 'category'
        }));
        break;

      case 'manufacturer':
        const manufacturers = await Manufacturer.find({
          $or: [
            { name: searchQuery },
            { description: searchQuery }
          ],
          status: 'active'
        })
        .populate('logo')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

        total = await Manufacturer.countDocuments({
          $or: [
            { name: searchQuery },
            { description: searchQuery }
          ],
          status: 'active'
        });

        results = manufacturers.map(manufacturer => ({
          ...manufacturer.toObject(),
          type: 'manufacturer'
        }));
        break;

      case 'vendor':
        const vendors = await Vendor.find({
          $or: [
            { name: searchQuery },
            { description: searchQuery }
          ],
          status: 'active'
        })
        .populate('image')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

        total = await Vendor.countDocuments({
          $or: [
            { name: searchQuery },
            { description: searchQuery }
          ],
          status: 'active'
        });

        results = vendors.map(vendor => ({
          ...vendor.toObject(),
          type: 'vendor'
        }));
        break;

      case 'post':
        const posts = await Post.find({
          $or: [
            { title: searchQuery },
            { content: searchQuery },
            { excerpt: searchQuery }
          ],
          status: 'published'
        })
        .populate('category', 'name slug')
        .populate('author', 'name')
        .populate('featuredImage')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ publishedAt: -1 });

        total = await Post.countDocuments({
          $or: [
            { title: searchQuery },
            { content: searchQuery },
            { excerpt: searchQuery }
          ],
          status: 'published'
        });

        results = posts.map(post => ({
          ...post.toObject(),
          type: 'post'
        }));
        break;

      default: // Search all types
        const [productResults, categoryResults, manufacturerResults, vendorResults, postResults] = await Promise.all([
          Product.find({
            $or: [
              { name: searchQuery },
              { shortDescription: searchQuery },
              { description: searchQuery },
              { sku: searchQuery }
            ],
            status: 'active'
          })
          .populate('category', 'name slug')
          .populate('manufacturer', 'name slug')
          .populate('vendor', 'name slug')
          .populate('image')
          .limit(parseInt(limit))
          .sort({ createdAt: -1 }),

          ProductCategory.find({
            $or: [
              { name: searchQuery },
              { description: searchQuery }
            ],
            status: 'active'
          })
          .populate('parent', 'name slug')
          .populate('image')
          .limit(parseInt(limit))
          .sort({ createdAt: -1 }),

          Manufacturer.find({
            $or: [
              { name: searchQuery },
              { description: searchQuery }
            ],
            status: 'active'
          })
          .populate('logo')
          .limit(parseInt(limit))
          .sort({ createdAt: -1 }),

          Vendor.find({
            $or: [
              { name: searchQuery },
              { description: searchQuery }
            ],
            status: 'active'
          })
          .populate('image')
          .limit(parseInt(limit))
          .sort({ createdAt: -1 }),

          Post.find({
            $or: [
              { title: searchQuery },
              { content: searchQuery },
              { excerpt: searchQuery }
            ],
            status: 'published'
          })
          .populate('category', 'name slug')
          .populate('author', 'name')
          .populate('featuredImage')
          .limit(parseInt(limit))
          .sort({ publishedAt: -1 })
        ]);

        // Combine and sort results by relevance
        const allResults = [
          ...productResults.map(p => ({ ...p.toObject(), type: 'product' })),
          ...categoryResults.map(c => ({ ...c.toObject(), type: 'category' })),
          ...manufacturerResults.map(m => ({ ...m.toObject(), type: 'manufacturer' })),
          ...vendorResults.map(v => ({ ...v.toObject(), type: 'vendor' })),
          ...postResults.map(p => ({ ...p.toObject(), type: 'post' }))
        ];

        // Simple relevance scoring (exact matches first, then partial)
        allResults.sort((a, b) => {
          const aName = (a.name || a.title || '').toLowerCase();
          const bName = (b.name || b.title || '').toLowerCase();
          const query = q.toLowerCase();
          
          const aExact = aName === query;
          const bExact = bName === query;
          const aStartsWith = aName.startsWith(query);
          const bStartsWith = bName.startsWith(query);
          
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          
          return 0;
        });

        results = allResults.slice(skip, skip + parseInt(limit));
        total = allResults.length;
        break;
    }

    res.json({
      success: true,
      data: results,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET api/search/autocomplete
// @desc    Get autocomplete suggestions
// @access  Public
router.get('/autocomplete', async (req, res) => {
  try {
    const { q, type } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const searchQuery = { $regex: q, $options: 'i' };
    let results = [];

    // Autocomplete based on type
    switch (type) {
      case 'product':
        const products = await Product.find({
          $or: [
            { name: searchQuery },
            { sku: searchQuery }
          ],
          status: 'active'
        })
        .select('name sku slug')
        .limit(5)
        .sort({ createdAt: -1 });

        results = products.map(product => ({
          _id: product._id,
          name: product.name,
          slug: product.slug,
          type: 'product'
        }));
        break;

      case 'category':
        const categories = await ProductCategory.find({
          name: searchQuery,
          status: 'active'
        })
        .select('name slug')
        .limit(5)
        .sort({ createdAt: -1 });

        results = categories.map(category => ({
          _id: category._id,
          name: category.name,
          slug: category.slug,
          type: 'category'
        }));
        break;

      case 'manufacturer':
        const manufacturers = await Manufacturer.find({
          name: searchQuery,
          status: 'active'
        })
        .select('name slug')
        .limit(5)
        .sort({ createdAt: -1 });

        results = manufacturers.map(manufacturer => ({
          _id: manufacturer._id,
          name: manufacturer.name,
          slug: manufacturer.slug,
          type: 'manufacturer'
        }));
        break;

      case 'vendor':
        const vendors = await Vendor.find({
          name: searchQuery,
          status: 'active'
        })
        .select('name slug')
        .limit(5)
        .sort({ createdAt: -1 });

        results = vendors.map(vendor => ({
          _id: vendor._id,
          name: vendor.name,
          slug: vendor.slug,
          type: 'vendor'
        }));
        break;

      case 'post':
        const posts = await Post.find({
          $or: [
            { title: searchQuery },
            { excerpt: searchQuery }
          ],
          status: 'published'
        })
        .select('title slug excerpt')
        .limit(5)
        .sort({ publishedAt: -1 });

        results = posts.map(post => ({
          _id: post._id,
          title: post.title,
          slug: post.slug,
          type: 'post'
        }));
        break;

      default: // Autocomplete all types
        const [products, categories, manufacturers, vendors, posts] = await Promise.all([
          Product.find({
            $or: [
              { name: searchQuery },
              { sku: searchQuery }
            ],
            status: 'active'
          })
          .select('name sku slug')
          .limit(3)
          .sort({ createdAt: -1 }),

          ProductCategory.find({
            name: searchQuery,
            status: 'active'
          })
          .select('name slug')
          .limit(2)
          .sort({ createdAt: -1 }),

          Manufacturer.find({
            name: searchQuery,
            status: 'active'
          })
          .select('name slug')
          .limit(2)
          .sort({ createdAt: -1 }),

          Vendor.find({
            name: searchQuery,
            status: 'active'
          })
          .select('name slug')
          .limit(2)
          .sort({ createdAt: -1 }),

          Post.find({
            $or: [
              { title: searchQuery },
              { excerpt: searchQuery }
            ],
            status: 'published'
          })
          .select('title slug excerpt')
          .limit(3)
          .sort({ publishedAt: -1 })
        ]);

        results = [
          ...products.map(p => ({
            _id: p._id,
            name: p.name,
            slug: p.slug,
            type: 'product'
          })),
          ...categories.map(c => ({
            _id: c._id,
            name: c.name,
            slug: c.slug,
            type: 'category'
          })),
          ...manufacturers.map(m => ({
            _id: m._id,
            name: m.name,
            slug: m.slug,
            type: 'manufacturer'
          })),
          ...vendors.map(v => ({
            _id: v._id,
            name: v.name,
            slug: v.slug,
            type: 'vendor'
          })),
          ...posts.map(p => ({
            _id: p._id,
            title: p.title,
            slug: p.slug,
            type: 'post'
          }))
        ];

        // Limit total results
        results = results.slice(0, 10);
        break;
    }

    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Autocomplete error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 