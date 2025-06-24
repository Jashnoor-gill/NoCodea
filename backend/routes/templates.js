const express = require('express');
const Template = require('../models/Template');
const auth = require('../middleware/auth');
const TemplateParser = require('../services/templateParser');
const templateParser = new TemplateParser();
const SiteSettings = require('../models/SiteSettings');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// @route   GET /api/templates
// @desc    Get all templates
// @access  Public
router.get('/', async (req, res) => {
  try {
    const templatesDir = path.join(process.cwd(), 'templates');
    const files = await fs.readdir(templatesDir);
    
    const templates = await Promise.all(
      files
        .filter(file => file.endsWith('.html') || file.endsWith('.tpl'))
        .map(async (file) => {
          const filePath = path.join(templatesDir, file);
          const stats = await fs.stat(filePath);
          const content = await fs.readFile(filePath, 'utf8');
          
          return {
            name: file,
            path: file,
            size: stats.size,
            modified: stats.mtime,
            preview: content.substring(0, 200) + '...'
          };
        })
    );
    
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Error listing templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list templates'
    });
  }
});

// @route   GET /api/templates/featured
// @desc    Get featured templates
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const templates = await Template.getFeatured(8);

    res.json({
      success: true,
      data: templates
    });

  } catch (error) {
    console.error('Get featured templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/templates/:name
// @desc    Get template content
// @access  Private
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const templatePath = path.join(process.cwd(), 'templates', name);
    
    const content = await fs.readFile(templatePath, 'utf8');
    
    res.json({
      success: true,
      data: {
        name,
        content,
        path: name
      }
    });
  } catch (error) {
    console.error('Error reading template:', error);
    res.status(404).json({
      success: false,
      error: 'Template not found'
    });
  }
});

// @route   POST /api/templates
// @desc    Create new template
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, content } = req.body;
    
    if (!name || !content) {
      return res.status(400).json({
        success: false,
        error: 'Name and content are required'
      });
    }
    
    const templatePath = path.join(process.cwd(), 'templates', name);
    await fs.writeFile(templatePath, content, 'utf8');
    
    res.json({
      success: true,
      data: {
        name,
        path: name,
        message: 'Template created successfully'
      }
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create template'
    });
  }
});

// @route   PUT /api/templates/:name
// @desc    Update template
// @access  Private
router.put('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }
    
    const templatePath = path.join(process.cwd(), 'templates', name);
    await fs.writeFile(templatePath, content, 'utf8');
    
    // Clear cache for this template
    templateParser.clearCache();
    
    res.json({
      success: true,
      data: {
        name,
        message: 'Template updated successfully'
      }
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update template'
    });
  }
});

// @route   DELETE /api/templates/:name
// @desc    Delete template
// @access  Private
router.delete('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const templatePath = path.join(process.cwd(), 'templates', name);
    
    await fs.unlink(templatePath);
    
    res.json({
      success: true,
      data: {
        name,
        message: 'Template deleted successfully'
      }
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete template'
    });
  }
});

// @route   POST /api/templates/:name/process
// @desc    Process template with data
// @access  Private
router.post('/:name/process', async (req, res) => {
  try {
    const { name } = req.params;
    const { data = {}, seo = {}, theme = {} } = req.body;
    
    // Process the template
    let processed = await templateParser.processTemplate(name, data);
    
    // Apply SEO processing
    processed = templateParser.processSeo(processed, seo);
    
    // Apply theme processing
    processed = templateParser.processTheme(processed, theme);
    
    // Apply URL processing
    processed = templateParser.processUrls(processed, data.baseUrl || '');
    
    // Apply CSRF processing
    processed = templateParser.processCsrf(processed, data.csrfToken || '');
    
    res.json({
      success: true,
      data: {
        name,
        processed,
        originalData: data
      }
    });
  } catch (error) {
    console.error('Error processing template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process template',
      details: error.message
    });
  }
});

// @route   POST /api/templates/process-advanced
// @desc    Advanced template processing with all Vvveb features
// @access  Private
router.post('/process-advanced', async (req, res) => {
  try {
    const { 
      templateName, 
      data = {}, 
      seo = {}, 
      theme = {},
      countries = [],
      regions = [],
      post = {},
      checkout = {},
      csrfToken = '',
      baseUrl = ''
    } = req.body;
    
    // Combine all data for processing
    const combinedData = {
      ...data,
      countries,
      regions,
      post,
      checkout
    };
    
    // Process the template with all features
    let processed = await templateParser.processTemplate(templateName, combinedData);
    
    // Apply additional processing
    processed = templateParser.processSeo(processed, seo);
    processed = templateParser.processTheme(processed, theme);
    processed = templateParser.processUrls(processed, baseUrl);
    processed = templateParser.processCsrf(processed, csrfToken);
    
    res.json({
      success: true,
      data: {
        templateName,
        processed,
        processingInfo: {
          cacheSize: templateParser.getCacheSize(),
          dataKeys: Object.keys(combinedData),
          seoApplied: Object.keys(seo).length > 0,
          themeApplied: Object.keys(theme).length > 0
        }
      }
    });
  } catch (error) {
    console.error('Error in advanced template processing:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process template',
      details: error.message
    });
  }
});

// @route   GET /api/templates/cache/clear
// @desc    Clear template cache
// @access  Private
router.get('/cache/clear', (req, res) => {
  try {
    const cacheSize = templateParser.getCacheSize();
    templateParser.clearCache();
    
    res.json({
      success: true,
      data: {
        message: 'Template cache cleared',
        previousCacheSize: cacheSize
      }
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache'
    });
  }
});

// @route   GET /api/templates/cache/status
// @desc    Get cache status
// @access  Private
router.get('/cache/status', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        cacheSize: templateParser.getCacheSize(),
        globalData: templateParser.globalData
      }
    });
  } catch (error) {
    console.error('Error getting cache status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cache status'
    });
  }
});

module.exports = router; 