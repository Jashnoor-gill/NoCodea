const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const User = require('../models/User');
const Order = require('../models/Order');

// @route   POST api/emails/test
// @desc    Test email service
// @access  Admin
router.post('/test', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    
    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide to, subject, and message'
      });
    }

    const result = await emailService.sendEmail({
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Test Email from NoCodea</h2>
          <p>${message}</p>
          <p>This is a test email to verify the email service is working correctly.</p>
          <p>Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// @route   POST api/emails/welcome
// @desc    Send welcome email to user
// @access  Admin
router.post('/welcome/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const result = await emailService.sendWelcomeEmail(user);

    if (result.success) {
      res.json({
        success: true,
        message: 'Welcome email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send welcome email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Welcome email error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// @route   POST api/emails/password-reset
// @desc    Send password reset email
// @access  Public
router.post('/password-reset', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate reset token (you might want to use JWT or crypto)
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    
    // Save reset token to user (you'll need to add this field to User model)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    const result = await emailService.sendPasswordReset(user, resetToken);

    if (result.success) {
      res.json({
        success: true,
        message: 'Password reset email sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send password reset email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Password reset email error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// @route   POST api/emails/order-confirmation
// @desc    Send order confirmation email
// @access  Admin
router.post('/order-confirmation/:orderId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('user', 'name email')
      .populate('items.product', 'name price');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const result = await emailService.sendOrderConfirmation(order, order.user);

    if (result.success) {
      res.json({
        success: true,
        message: 'Order confirmation email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send order confirmation email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Order confirmation email error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// @route   POST api/emails/order-status-update
// @desc    Send order status update email
// @access  Admin
router.post('/order-status-update/:orderId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const order = await Order.findById(req.params.orderId)
      .populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const result = await emailService.sendOrderStatusUpdate(order, order.user, status);

    if (result.success) {
      res.json({
        success: true,
        message: 'Order status update email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send order status update email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Order status update email error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// @route   POST api/emails/newsletter
// @desc    Send newsletter to subscribers
// @access  Admin
router.post('/newsletter', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, subject, content, subscriberEmails } = req.body;
    
    if (!title || !subject || !content || !subscriberEmails) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, subject, content, and subscriber emails'
      });
    }

    const newsletter = { title, subject, content };
    const subscribers = subscriberEmails.map(email => ({ email }));

    const results = await emailService.sendNewsletter(newsletter, subscribers);

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    res.json({
      success: true,
      message: `Newsletter sent to ${successCount} subscribers`,
      results: {
        total: results.length,
        success: successCount,
        failed: failureCount,
        details: results
      }
    });
  } catch (error) {
    console.error('Newsletter email error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// @route   GET api/emails/status
// @desc    Get email service status
// @access  Admin
router.get('/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const config = emailService.settings?.settings || {};
    
    const status = {
      initialized: !!emailService.transporter,
      smtpConfigured: !!(config.smtpHost && config.smtpUser && config.smtpPass),
      templatesLoaded: Object.keys(emailService.templates).length,
      availableTemplates: Object.keys(emailService.templates),
      smtpConfig: {
        host: config.smtpHost || 'Not configured',
        port: config.smtpPort || 587,
        secure: config.smtpSecure || false,
        user: config.smtpUser ? 'Configured' : 'Not configured'
      }
    };

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Email status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router; 