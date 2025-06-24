const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const fs = require('fs').promises;
const path = require('path');
const replacePlaceholders = require('./utils/replacePlaceholders');
require('dotenv').config();

const passport = require('passport');
require('./passport-google-config');
app.use(passport.initialize());

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const templateRoutes = require('./routes/templates');
const uploadRoutes = require('./routes/upload');
const postRoutes = require('./routes/posts');
const paymentRoutes = require('./routes/payment');
const shippingRoutes = require('./routes/shipping');
const subscriptionPlanRoutes = require('./routes/subscriptionPlans');
const manufacturerRoutes = require('./routes/manufacturers');
const productCategoryRoutes = require('./routes/productCategories');
const productRoutes = require('./routes/products');
const vendorRoutes = require('./routes/vendors');
const adminRoutes = require('./routes/admin');
const cartRoutes = require('./routes/cart');
const commentRoutes = require('./routes/comments');
const languageRoutes = require('./routes/languages');
const menuRoutes = require('./routes/menus');
const reviewRoutes = require('./routes/reviews');
const questionRoutes = require('./routes/questions');
const searchRoutes = require('./routes/search');
const settingsRoutes = require('./routes/settings');
const compareRoutes = require('./routes/compare');
const checkoutRoutes = require('./routes/checkout');
const postCategoryRoutes = require('./routes/postCategories');
const tagRoutes = require('./routes/tags');
const feedRoutes = require('./routes/feed');
const emailRoutes = require('./routes/emails');
const returnRoutes = require('./routes/returns');
const wishlistRoutes = require('./routes/wishlist');

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'NoCodea Website Builder API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Helper to load and serve JSON config with placeholder replacement
async function serveConfig(res, file, replacements = {}) {
  try {
    const filePath = path.join(__dirname, file);
    const raw = await fs.readFile(filePath, 'utf8');
    const json = JSON.parse(raw);
    const replaced = replacePlaceholders(json, replacements);
    res.json(replaced);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load config', details: err.message });
  }
}

// Example runtime values (replace with real logic as needed)
function getRuntimeReplacements(req) {
  return {
    ADMIN_PATH: '/admin/',
    HOME_URL: '/',
  };
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/subscription-plans', subscriptionPlanRoutes);
app.use('/api/manufacturers', manufacturerRoutes);
app.use('/api/product-categories', productCategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/post-categories', postCategoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Feed routes (public endpoints)
app.use('/feed', feedRoutes);
app.use('/manifest.json', feedRoutes);
app.use('/robots.txt', feedRoutes);
app.use('/sitemap.xml', feedRoutes);

// API endpoints for configs
app.get('/api/menu/admin', (req, res) => {
  serveConfig(res, 'admin-menu.json', getRuntimeReplacements(req));
});
app.get('/api/menu/custom-post', (req, res) => {
  serveConfig(res, 'custom-post-menu.json', getRuntimeReplacements(req));
});
app.get('/api/menu/custom-product', (req, res) => {
  serveConfig(res, 'custom-product-menu.json', getRuntimeReplacements(req));
});
app.get('/api/settings', (req, res) => {
  serveConfig(res, 'app.json', getRuntimeReplacements(req));
});
app.get('/api/routes', (req, res) => {
  serveConfig(res, 'app-routes.json', getRuntimeReplacements(req));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.NODE_ENV === 'production' 
        ? process.env.MONGODB_URI_PROD 
        : process.env.MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();

module.exports = app; 