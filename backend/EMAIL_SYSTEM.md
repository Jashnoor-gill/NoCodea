# Email System Documentation

## Overview

The NoCodea email system provides comprehensive email functionality for user notifications, order confirmations, and marketing communications. It's built using Nodemailer with Handlebars templating and integrates seamlessly with the existing backend architecture.

## Features

### 🎯 Core Email Types
- **Welcome Emails** - Sent to new users upon registration
- **Password Reset** - Secure password reset functionality
- **Order Confirmations** - Detailed order receipts with item breakdown
- **Order Status Updates** - Notifications when order status changes
- **Newsletters** - Bulk email campaigns to subscribers
- **Custom Emails** - Flexible email sending for any purpose

### 🎨 Email Templates
- **Handlebars Integration** - Dynamic template rendering
- **Responsive Design** - Mobile-friendly email layouts
- **Brand Consistency** - Consistent styling across all emails
- **Customizable** - Easy to modify templates and styling

### ⚙️ Configuration
- **SMTP Support** - Configurable SMTP settings
- **Site Settings Integration** - Dynamic content from site configuration
- **Fallback Templates** - Built-in HTML templates if Handlebars files missing
- **Error Handling** - Graceful failure handling

## File Structure

```
backend/
├── services/
│   └── emailService.js          # Main email service
├── routes/
│   └── emails.js                # Email API endpoints
├── templates/
│   └── emails/
│       ├── order-confirmation.hbs
│       ├── welcome.hbs
│       └── password-reset.hbs
└── test-email.js                # Email service test script
```

## API Endpoints

### Email Management
- `POST /api/emails/test` - Test email service
- `POST /api/emails/welcome/:userId` - Send welcome email
- `POST /api/emails/password-reset` - Send password reset email
- `POST /api/emails/order-confirmation/:orderId` - Send order confirmation
- `POST /api/emails/order-status-update/:orderId` - Send status update
- `POST /api/emails/newsletter` - Send newsletter
- `GET /api/emails/status` - Get email service status

### Authentication Integration
- `POST /api/auth/register` - Automatically sends welcome email
- `POST /api/auth/forgot-password` - Sends password reset email

### Checkout Integration
- `POST /api/checkout` - Automatically sends order confirmation

## Configuration

### Environment Variables
```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false

# Site Configuration
SITE_URL=https://yourdomain.com
CONTACT_EMAIL=contact@yourdomain.com
```

### Site Settings
The email system uses the enhanced SiteSettings model for dynamic content:

```javascript
{
  siteName: 'NoCodea',
  contactEmail: 'contact@nocodea.com',
  siteUrl: 'https://nocodea.com',
  themeColor: '#3367D6',
  logo: '/images/logo.png',
  favicon: '/images/favicon.png'
}
```

## Usage Examples

### Sending a Welcome Email
```javascript
const emailService = require('./services/emailService');
const user = await User.findById(userId);
await emailService.sendWelcomeEmail(user);
```

### Sending Order Confirmation
```javascript
const order = await Order.findById(orderId).populate('user');
await emailService.sendOrderConfirmation(order, order.user);
```

### Sending Custom Email
```javascript
await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Custom Subject',
  html: '<h1>Custom HTML Content</h1>'
});
```

### Testing Email Service
```bash
node test-email.js
```

## Email Templates

### Order Confirmation Template
- Professional layout with order details
- Item breakdown with prices
- Shipping and billing addresses
- Payment method information
- Order tracking details

### Welcome Email Template
- Branded welcome message
- Feature highlights
- Quick start guide
- Support contact information
- Call-to-action buttons

### Password Reset Template
- Secure reset link
- Expiration information
- Clear instructions
- Security warnings

## Error Handling

The email system includes comprehensive error handling:

1. **SMTP Failures** - Logged but don't break user flows
2. **Template Errors** - Falls back to built-in HTML templates
3. **Configuration Issues** - Graceful degradation
4. **Network Problems** - Retry logic and timeout handling

## Security Features

- **Token-based Password Reset** - Secure, time-limited tokens
- **Email Validation** - Proper email format validation
- **Rate Limiting** - Prevents email abuse
- **Admin-only Access** - Sensitive email operations require admin privileges

## Integration Points

### User Registration
- Automatic welcome email on successful registration
- Email verification support (optional)

### Password Management
- Secure password reset flow
- Email-based token verification

### E-commerce
- Order confirmation emails
- Status update notifications
- Shipping tracking information

### Marketing
- Newsletter campaigns
- Promotional emails
- Customer engagement

## Best Practices

1. **Always handle email failures gracefully** - Don't break user flows
2. **Use templates for consistency** - Maintain brand standards
3. **Test email functionality** - Verify SMTP configuration
4. **Monitor email delivery** - Track success/failure rates
5. **Respect user preferences** - Honor unsubscribe requests

## Troubleshooting

### Common Issues

1. **SMTP Connection Failed**
   - Check SMTP credentials
   - Verify network connectivity
   - Test with email service provider

2. **Templates Not Loading**
   - Verify template file paths
   - Check Handlebars syntax
   - Ensure proper file permissions

3. **Emails Not Sending**
   - Check email service status
   - Verify recipient email format
   - Review server logs for errors

### Debug Commands
```bash
# Test email service
node test-email.js

# Check email service status
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/emails/status
```

## Future Enhancements

- **Email Queue System** - Background processing for large volumes
- **Email Analytics** - Track open rates and click-through rates
- **A/B Testing** - Test different email templates
- **Advanced Templates** - More sophisticated email designs
- **Multi-language Support** - Internationalized email content 