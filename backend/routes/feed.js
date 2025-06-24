const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const SiteSettings = require('../models/SiteSettings');
const fs = require('fs');
const path = require('path');

// RSS Feed Index - handles dynamic RSS feed requests
router.get('/:rss', async (req, res) => {
  try {
    const { rss } = req.params;
    
    // Sanitize filename
    const sanitizedRss = rss.replace(/[^a-zA-Z0-9-_]/g, '').replace('.xml', '');
    
    // Check if RSS file exists in public/feed directory
    const feedPath = path.join(__dirname, '../public/feed', `${sanitizedRss}.xml`);
    
    if (fs.existsSync(feedPath)) {
      res.setHeader('Content-Type', 'text/xml');
      const feedContent = fs.readFileSync(feedPath, 'utf8');
      
      // Replace dynamic content
      const updatedContent = feedContent
        .replace('{{pubDate}}', new Date().toUTCString())
        .replace('{{siteUrl}}', `${req.protocol}://${req.get('host')}`);
      
      return res.send(updatedContent);
    }
    
    res.status(404).json({ error: 'RSS feed not found' });
  } catch (error) {
    console.error('RSS feed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PWA Manifest
router.get('/manifest.json', async (req, res) => {
  try {
    const settings = await SiteSettings.findOne({ name: 'default' });
    
    if (!settings) {
      return res.status(404).json({ error: 'Site settings not found' });
    }
    
    const siteUrl = `${req.protocol}://${req.get('host')}`;
    const config = settings.settings;
    
    const manifest = {
      short_name: config.siteName || 'NoCodea',
      lang: config.defaultLanguage || 'en',
      dir: 'ltr',
      name: config.siteName || 'NoCodea',
      icons: [
        {
          src: config.logo || `${siteUrl}/images/logo-144.png`,
          type: 'image/png',
          sizes: '144x144'
        },
        {
          src: config.logo || `${siteUrl}/images/logo-192.png`,
          type: 'image/png',
          sizes: '192x192'
        },
        {
          src: config.logo || `${siteUrl}/images/logo-512.png`,
          type: 'image/png',
          sizes: '512x512'
        }
      ],
      id: siteUrl,
      start_url: `${siteUrl}/?source=pwa`,
      background_color: config.backgroundColor || '#3367D6',
      display: 'standalone',
      scope: '/',
      theme_color: config.themeColor || '#3367D6',
      shortcuts: [
        {
          name: config.siteDescription || 'NoCodea - No Code Website Builder',
          short_name: config.siteName || 'NoCodea',
          description: config.metaDescription || 'Build beautiful websites without code',
          url: '/?source=pwa',
          icons: [
            {
              src: config.favicon || `${siteUrl}/images/favicon-96.png`,
              sizes: '96x96'
            }
          ]
        }
      ],
      description: config.metaDescription || 'Build beautiful websites without code',
      screenshots: [
        {
          src: config.webbanner || `${siteUrl}/images/screenshot-mobile.png`,
          type: 'image/png',
          sizes: '540x720',
          form_factor: 'narrow'
        },
        {
          src: config.webbanner || `${siteUrl}/images/screenshot-desktop.png`,
          type: 'image/jpg',
          sizes: '1280x920',
          form_factor: 'wide'
        }
      ]
    };
    
    res.json(manifest);
  } catch (error) {
    console.error('Manifest error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Posts Feed (RSS/JSON)
router.get('/posts', async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 })
      .limit(20);
    
    // Process posts for feed
    const processedPosts = posts.map(post => {
      const processedPost = {
        id: post._id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || (post.content ? post.content.substring(0, 200).replace(/<[^>]*>/g, '') : ''),
        content: post.content,
        author: post.author?.name || 'Anonymous',
        category: post.category?.name || '',
        tags: post.tags?.map(tag => tag.name) || [],
        publishedAt: post.publishedAt || post.createdAt,
        updatedAt: post.updatedAt,
        url: `${req.protocol}://${req.get('host')}/posts/${post.slug}`
      };
      
      // Process images
      if (post.images && post.images.length > 0) {
        processedPost.images = post.images.map(image => 
          image.startsWith('http') ? image : `${req.protocol}://${req.get('host')}/uploads/${image}`
        );
      } else if (post.image) {
        processedPost.images = [
          post.image.startsWith('http') ? post.image : `${req.protocol}://${req.get('host')}/uploads/${post.image}`
        ];
      }
      
      return processedPost;
    });
    
    if (format === 'rss') {
      // Generate RSS XML
      const rssXml = generateRSSFeed(processedPosts, req, 'posts');
      res.setHeader('Content-Type', 'application/rss+xml');
      return res.send(rssXml);
    }
    
    res.json({
      success: true,
      data: processedPosts,
      meta: {
        total: processedPosts.length,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Posts feed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Products Feed (RSS/JSON)
router.get('/products', async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    
    const products = await Product.find({ status: 'active' })
      .populate('category', 'name slug')
      .populate('manufacturer', 'name')
      .populate('vendor', 'name')
      .sort({ createdAt: -1 })
      .limit(20);
    
    // Process products for feed
    const processedProducts = products.map(product => {
      const processedProduct = {
        id: product._id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription || (product.description ? product.description.substring(0, 200).replace(/<[^>]*>/g, '') : ''),
        price: product.price,
        salePrice: product.salePrice,
        category: product.category?.name || '',
        manufacturer: product.manufacturer?.name || '',
        vendor: product.vendor?.name || '',
        sku: product.sku,
        stock: product.stock,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        url: `${req.protocol}://${req.get('host')}/products/${product.slug}`
      };
      
      // Process images
      if (product.images && product.images.length > 0) {
        processedProduct.images = product.images.map(image => 
          image.startsWith('http') ? image : `${req.protocol}://${req.get('host')}/uploads/${image}`
        );
      } else if (product.image) {
        processedProduct.images = [
          product.image.startsWith('http') ? product.image : `${req.protocol}://${req.get('host')}/uploads/${product.image}`
        ];
      }
      
      return processedProduct;
    });
    
    if (format === 'rss') {
      // Generate RSS XML
      const rssXml = generateRSSFeed(processedProducts, req, 'products');
      res.setHeader('Content-Type', 'application/rss+xml');
      return res.send(rssXml);
    }
    
    res.json({
      success: true,
      data: processedProducts,
      meta: {
        total: processedProducts.length,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Products feed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Categories Feed (JSON only)
router.get('/categories', async (req, res) => {
  try {
    const categories = await ProductCategory.find({ status: 'active' })
      .populate('parent', 'name slug')
      .sort({ name: 1 });
    
    const processedCategories = categories.map(category => ({
      id: category._id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parent: category.parent?.name || '',
      image: category.image ? `${req.protocol}://${req.get('host')}/uploads/${category.image}` : null,
      url: `${req.protocol}://${req.get('host')}/categories/${category.slug}`
    }));
    
    res.json({
      success: true,
      data: processedCategories,
      meta: {
        total: processedCategories.length,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Categories feed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Robots.txt
router.get('/robots.txt', async (req, res) => {
  try {
    const robotsPath = path.join(__dirname, '../public/robots.txt');
    let robotsContent = '';
    
    if (fs.existsSync(robotsPath)) {
      robotsContent = fs.readFileSync(robotsPath, 'utf8');
    } else {
      // Default robots.txt content
      robotsContent = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml
Sitemap: ${req.protocol}://${req.get('host')}/sitemap-posts.xml
Sitemap: ${req.protocol}://${req.get('host')}/sitemap-products.xml`;
    }
    
    // Replace relative URLs with absolute URLs
    const host = `${req.protocol}://${req.get('host')}`;
    robotsContent = robotsContent.replace(/sitemap:\s+\//g, `sitemap: ${host}/`);
    
    res.setHeader('Content-Type', 'text/plain');
    res.send(robotsContent);
  } catch (error) {
    console.error('Robots.txt error:', error);
    res.status(500).send('Error generating robots.txt');
  }
});

// Sitemap generation
router.get('/sitemap.xml', async (req, res) => {
  try {
    const siteUrl = `${req.protocol}://${req.get('host')}`;
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/posts</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/products</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
    
    res.setHeader('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to generate RSS feed
function generateRSSFeed(items, req, type = 'posts') {
  const siteUrl = `${req.protocol}://${req.get('host')}`;
  const settings = {
    title: type === 'products' ? 'NoCodea Products' : 'NoCodea Blog',
    description: type === 'products' ? 'Latest products from NoCodea' : 'Latest posts from NoCodea',
    language: 'en',
    siteUrl: siteUrl
  };
  
  const rssItems = items.map(item => {
    const title = item.title || item.name;
    const description = item.excerpt || item.shortDescription || item.description;
    const url = item.url;
    const pubDate = item.publishedAt || item.createdAt;
    const category = item.category || '';
    const tags = item.tags || [];
    const images = item.images || [];
    
    return `
  <item>
    <title><![CDATA[${title}]]></title>
    <link>${url}</link>
    <guid>${url}</guid>
    <pubDate>${new Date(pubDate).toUTCString()}</pubDate>
    <description><![CDATA[${description}]]></description>
    ${images.length > 0 ? `<enclosure url="${images[0]}" type="image/jpeg" />` : ''}
    <category>${category}</category>
    ${tags.map(tag => `<category>${tag}</category>`).join('')}
  </item>`;
  }).join('');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <channel>
    <title>${settings.title}</title>
    <atom:link href="${siteUrl}/feed/${type}?format=rss" rel="self" type="application/rss+xml" />
    <link>${siteUrl}</link>
    <description>${settings.description}</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>${settings.language}</language>
    <sy:updatePeriod>daily</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    ${rssItems}
  </channel>
</rss>`;
}

module.exports = router; 