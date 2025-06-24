const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
    // Use a single document to store all settings, identified by a name.
    name: {
        type: String,
        default: 'default',
        unique: true,
    },
    settings: {
        // Basic site information
        siteName: { type: String, default: 'NoCodea' },
        siteDescription: { type: String, default: 'No Code Website Builder' },
        siteUrl: { type: String, default: 'https://nocodea.com' },
        
        // Contact information
        contactEmail: { type: String, default: 'contact@nocodea.com' },
        contactPhone: { type: String, default: '' },
        contactAddress: { type: String, default: '' },
        
        // Social media
        facebookUrl: { type: String, default: '' },
        twitterUrl: { type: String, default: '' },
        instagramUrl: { type: String, default: '' },
        linkedinUrl: { type: String, default: '' },
        youtubeUrl: { type: String, default: '' },
        
        // SEO settings
        metaTitle: { type: String, default: 'NoCodea - No Code Website Builder' },
        metaDescription: { type: String, default: 'Build beautiful websites without code using our drag-and-drop website builder' },
        metaKeywords: { type: String, default: 'website builder, no code, drag and drop, web design' },
        googleAnalyticsId: { type: String, default: '' },
        googleTagManagerId: { type: String, default: '' },
        
        // PWA settings
        logo: { type: String, default: '/images/logo-144.png' },
        favicon: { type: String, default: '/images/favicon-96.png' },
        webbanner: { type: String, default: '/images/screenshot-desktop.png' },
        themeColor: { type: String, default: '#3367D6' },
        backgroundColor: { type: String, default: '#3367D6' },
        
        // Language and localization
        defaultLanguage: { type: String, default: 'en' },
        supportedLanguages: [{ type: String, default: ['en'] }],
        timezone: { type: String, default: 'UTC' },
        
        // E-commerce settings
        currency: { type: String, default: 'USD' },
        currencySymbol: { type: String, default: '$' },
        taxRate: { type: Number, default: 0 },
        shippingEnabled: { type: Boolean, default: true },
        
        // Content settings
        postsPerPage: { type: Number, default: 10 },
        productsPerPage: { type: Number, default: 12 },
        enableComments: { type: Boolean, default: true },
        moderateComments: { type: Boolean, default: true },
        
        // Security settings
        maintenanceMode: { type: Boolean, default: false },
        maintenanceMessage: { type: String, default: 'Site is under maintenance. Please check back later.' },
        
        // Custom CSS/JS
        customCSS: { type: String, default: '' },
        customJS: { type: String, default: '' },
        
        // Footer settings
        footerText: { type: String, default: '© 2024 NoCodea. All rights reserved.' },
        showFooterLinks: { type: Boolean, default: true },
        
        // Header settings
        showHeader: { type: Boolean, default: true },
        stickyHeader: { type: Boolean, default: true },
        
        // Performance settings
        enableCaching: { type: Boolean, default: true },
        cacheDuration: { type: Number, default: 3600 }, // in seconds
        enableCompression: { type: Boolean, default: true },
        
        // Email settings
        smtpHost: { type: String, default: '' },
        smtpPort: { type: Number, default: 587 },
        smtpUser: { type: String, default: '' },
        smtpPass: { type: String, default: '' },
        smtpSecure: { type: Boolean, default: true },
        
        // File upload settings
        maxFileSize: { type: Number, default: 5242880 }, // 5MB in bytes
        allowedFileTypes: [{ type: String, default: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'] }],
        
        // API settings
        apiRateLimit: { type: Number, default: 100 },
        apiRateLimitWindow: { type: Number, default: 900000 }, // 15 minutes in ms
    }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema); 