const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const SiteSettings = require('../models/SiteSettings');

class EmailService {
  constructor() {
    this.transporter = null;
    this.settings = null;
    this.templates = {};
    this.init();
  }

  async init() {
    try {
      // Load site settings
      this.settings = await SiteSettings.findOne({ name: 'default' });
      const config = this.settings?.settings || {};
      
      // Initialize transporter
      if (config.smtpHost && config.smtpUser && config.smtpPass) {
        this.transporter = nodemailer.createTransporter({
          host: config.smtpHost,
          port: config.smtpPort || 587,
          secure: config.smtpSecure || false,
          auth: {
            user: config.smtpUser,
            pass: config.smtpPass
          }
        });
      } else {
        // Use default SMTP or create test account
        this.transporter = nodemailer.createTransporter({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: 'test@example.com',
            pass: 'testpass'
          }
        });
      }

      // Load email templates
      await this.loadTemplates();
      
      console.log('Email service initialized successfully');
    } catch (error) {
      console.error('Email service initialization error:', error);
    }
  }

  async loadTemplates() {
    const templatesDir = path.join(__dirname, '../templates/emails');
    
    try {
      if (fs.existsSync(templatesDir)) {
        const templateFiles = fs.readdirSync(templatesDir);
        
        for (const file of templateFiles) {
          if (file.endsWith('.hbs')) {
            const templateName = path.basename(file, '.hbs');
            const templatePath = path.join(templatesDir, file);
            const templateContent = fs.readFileSync(templatePath, 'utf8');
            this.templates[templateName] = handlebars.compile(templateContent);
          }
        }
      }
    } catch (error) {
      console.error('Error loading email templates:', error);
    }
  }

  async sendEmail(options) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      const config = this.settings?.settings || {};
      
      const mailOptions = {
        from: options.from || config.contactEmail || 'noreply@nocodea.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments || []
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendOrderConfirmation(order, user) {
    try {
      const config = this.settings?.settings || {};
      const siteName = config.siteName || 'NoCodea';
      
      const templateData = {
        siteName,
        orderNumber: order.orderNumber,
        orderDate: new Date(order.createdAt).toLocaleDateString(),
        customerName: user.name,
        customerEmail: user.email,
        orderItems: order.items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price
        })),
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shipping,
        total: order.total,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        paymentMethod: order.paymentMethod,
        orderStatus: order.status,
        trackingNumber: order.trackingNumber || 'Not available yet',
        supportEmail: config.contactEmail || 'support@nocodea.com',
        siteUrl: config.siteUrl || 'https://nocodea.com'
      };

      const html = this.templates['order-confirmation'] 
        ? this.templates['order-confirmation'](templateData)
        : this.generateOrderConfirmationHTML(templateData);

      return await this.sendEmail({
        to: user.email,
        subject: `Order Confirmation - ${order.orderNumber}`,
        html
      });
    } catch (error) {
      console.error('Order confirmation email error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendOrderStatusUpdate(order, user, status) {
    try {
      const config = this.settings?.settings || {};
      const siteName = config.siteName || 'NoCodea';
      
      const templateData = {
        siteName,
        orderNumber: order.orderNumber,
        customerName: user.name,
        orderStatus: status,
        orderDate: new Date(order.createdAt).toLocaleDateString(),
        trackingNumber: order.trackingNumber || 'Not available yet',
        supportEmail: config.contactEmail || 'support@nocodea.com',
        siteUrl: config.siteUrl || 'https://nocodea.com'
      };

      const html = this.templates['order-status-update']
        ? this.templates['order-status-update'](templateData)
        : this.generateOrderStatusUpdateHTML(templateData);

      return await this.sendEmail({
        to: user.email,
        subject: `Order Status Update - ${order.orderNumber}`,
        html
      });
    } catch (error) {
      console.error('Order status update email error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(user) {
    try {
      const config = this.settings?.settings || {};
      const siteName = config.siteName || 'NoCodea';
      
      const templateData = {
        siteName,
        customerName: user.name,
        customerEmail: user.email,
        loginUrl: `${config.siteUrl || 'https://nocodea.com'}/login`,
        supportEmail: config.contactEmail || 'support@nocodea.com',
        siteUrl: config.siteUrl || 'https://nocodea.com'
      };

      const html = this.templates['welcome']
        ? this.templates['welcome'](templateData)
        : this.generateWelcomeEmailHTML(templateData);

      return await this.sendEmail({
        to: user.email,
        subject: `Welcome to ${siteName}!`,
        html
      });
    } catch (error) {
      console.error('Welcome email error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPasswordReset(user, resetToken) {
    try {
      const config = this.settings?.settings || {};
      const siteName = config.siteName || 'NoCodea';
      
      const resetUrl = `${config.siteUrl || 'https://nocodea.com'}/reset-password?token=${resetToken}`;
      
      const templateData = {
        siteName,
        customerName: user.name,
        resetUrl,
        supportEmail: config.contactEmail || 'support@nocodea.com',
        siteUrl: config.siteUrl || 'https://nocodea.com'
      };

      const html = this.templates['password-reset']
        ? this.templates['password-reset'](templateData)
        : this.generatePasswordResetHTML(templateData);

      return await this.sendEmail({
        to: user.email,
        subject: `Password Reset Request - ${siteName}`,
        html
      });
    } catch (error) {
      console.error('Password reset email error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendEmailVerification(user, verificationToken) {
    try {
      const config = this.settings?.settings || {};
      const siteName = config.siteName || 'NoCodea';
      
      const verificationUrl = `${config.siteUrl || 'https://nocodea.com'}/verify-email?token=${verificationToken}`;
      
      const templateData = {
        siteName,
        customerName: user.name,
        verificationUrl,
        supportEmail: config.contactEmail || 'support@nocodea.com',
        siteUrl: config.siteUrl || 'https://nocodea.com'
      };

      const html = this.templates['email-verification']
        ? this.templates['email-verification'](templateData)
        : this.generateEmailVerificationHTML(templateData);

      return await this.sendEmail({
        to: user.email,
        subject: `Verify Your Email - ${siteName}`,
        html
      });
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendNewsletter(newsletter, subscribers) {
    try {
      const config = this.settings?.settings || {};
      const siteName = config.siteName || 'NoCodea';
      
      const templateData = {
        siteName,
        newsletterTitle: newsletter.title,
        newsletterContent: newsletter.content,
        unsubscribeUrl: `${config.siteUrl || 'https://nocodea.com'}/unsubscribe`,
        supportEmail: config.contactEmail || 'support@nocodea.com',
        siteUrl: config.siteUrl || 'https://nocodea.com'
      };

      const html = this.templates['newsletter']
        ? this.templates['newsletter'](templateData)
        : this.generateNewsletterHTML(templateData);

      const results = [];
      
      for (const subscriber of subscribers) {
        const result = await this.sendEmail({
          to: subscriber.email,
          subject: newsletter.subject,
          html
        });
        results.push({ email: subscriber.email, ...result });
      }

      return results;
    } catch (error) {
      console.error('Newsletter email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Default HTML template generators
  generateOrderConfirmationHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3367D6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .item { border-bottom: 1px solid #eee; padding: 10px 0; }
          .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
            <p>Thank you for your order!</p>
          </div>
          <div class="content">
            <p>Dear ${data.customerName},</p>
            <p>Thank you for your order. Here are your order details:</p>
            
            <div class="order-details">
              <h3>Order #${data.orderNumber}</h3>
              <p><strong>Order Date:</strong> ${data.orderDate}</p>
              <p><strong>Status:</strong> ${data.orderStatus}</p>
              
              <h4>Order Items:</h4>
              ${data.orderItems.map(item => `
                <div class="item">
                  <strong>${item.name}</strong><br>
                  Quantity: ${item.quantity} | Price: $${item.price} | Total: $${item.total}
                </div>
              `).join('')}
              
              <div class="total">
                <p>Subtotal: $${data.subtotal}</p>
                <p>Tax: $${data.tax}</p>
                <p>Shipping: $${data.shipping}</p>
                <p>Total: $${data.total}</p>
              </div>
            </div>
            
            <p>We'll send you updates on your order status.</p>
            <p>If you have any questions, please contact us at ${data.supportEmail}</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ${data.siteName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateOrderStatusUpdateHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Status Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3367D6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .status { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Status Update</h1>
          </div>
          <div class="content">
            <p>Dear ${data.customerName},</p>
            <p>Your order status has been updated:</p>
            
            <div class="status">
              <h3>Order #${data.orderNumber}</h3>
              <p><strong>New Status:</strong> ${data.orderStatus}</p>
              <p><strong>Order Date:</strong> ${data.orderDate}</p>
              ${data.trackingNumber !== 'Not available yet' ? `<p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>` : ''}
            </div>
            
            <p>If you have any questions, please contact us at ${data.supportEmail}</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ${data.siteName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateWelcomeEmailHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to ${data.siteName}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3367D6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #3367D6; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ${data.siteName}!</h1>
          </div>
          <div class="content">
            <p>Dear ${data.customerName},</p>
            <p>Welcome to ${data.siteName}! We're excited to have you on board.</p>
            <p>Your account has been successfully created with the email: ${data.customerEmail}</p>
            <p>You can now:</p>
            <ul>
              <li>Build beautiful websites with our drag-and-drop editor</li>
              <li>Choose from hundreds of templates</li>
              <li>Publish your website instantly</li>
              <li>Manage your projects from your dashboard</li>
            </ul>
            <p style="text-align: center;">
              <a href="${data.loginUrl}" class="button">Get Started</a>
            </p>
            <p>If you have any questions, please contact us at ${data.supportEmail}</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ${data.siteName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generatePasswordResetHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset Request</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3367D6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #3367D6; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Dear ${data.customerName},</p>
            <p>We received a request to reset your password for your ${data.siteName} account.</p>
            <p>Click the button below to reset your password:</p>
            <p style="text-align: center;">
              <a href="${data.resetUrl}" class="button">Reset Password</a>
            </p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you have any questions, please contact us at ${data.supportEmail}</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ${data.siteName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateEmailVerificationHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3367D6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #3367D6; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <p>Dear ${data.customerName},</p>
            <p>Thank you for signing up for ${data.siteName}!</p>
            <p>Please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
              <a href="${data.verificationUrl}" class="button">Verify Email</a>
            </p>
            <p>If you didn't create an account, please ignore this email.</p>
            <p>If you have any questions, please contact us at ${data.supportEmail}</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 ${data.siteName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateNewsletterHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${data.newsletterTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3367D6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; }
          .unsubscribe { font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${data.newsletterTitle}</h1>
          </div>
          <div class="content">
            ${data.newsletterContent}
          </div>
          <div class="footer">
            <p>&copy; 2024 ${data.siteName}. All rights reserved.</p>
            <p class="unsubscribe">
              <a href="${data.unsubscribeUrl}">Unsubscribe</a> from this newsletter
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService(); 