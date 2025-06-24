const emailService = require('./services/emailService');

async function testEmailService() {
  console.log('Testing Email Service...');
  
  try {
    // Test basic email sending
    const result = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test Email from NoCodea',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Test Email</h2>
          <p>This is a test email to verify the email service is working correctly.</p>
          <p>Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `
    });
    
    console.log('Email service test result:', result);
    
    // Test email service status
    const config = emailService.settings?.settings || {};
    console.log('Email service configuration:', {
      initialized: !!emailService.transporter,
      smtpConfigured: !!(config.smtpHost && config.smtpUser && config.smtpPass),
      templatesLoaded: Object.keys(emailService.templates).length,
      availableTemplates: Object.keys(emailService.templates)
    });
    
  } catch (error) {
    console.error('Email service test error:', error);
  }
}

// Run the test
testEmailService(); 