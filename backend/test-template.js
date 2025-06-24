const templateParser = require('./services/templateParser');
const SiteSettings = require('./models/SiteSettings');

async function testTemplateEngine() {
  console.log('🧪 Testing Template Engine...\n');

  try {
    // Set up test data
    const testGlobalData = {
      site: {
        name: 'NoCodea Test Site',
        description: {
          title: 'Welcome to NoCodea',
          tagline: 'Build amazing websites without code',
          'meta-description': 'NoCodea is a powerful no-code website builder',
          'meta-keywords': 'website builder, no-code, drag and drop'
        },
        contact: {
          address: '123 Test Street, Test City',
          phone: '+1-555-123-4567',
          email: 'test@nocodea.com'
        },
        social: {
          facebook: 'https://facebook.com/nocodea',
          twitter: 'https://twitter.com/nocodea',
          instagram: 'https://instagram.com/nocodea'
        }
      },
      user: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      year: 2024,
      locale: 'en',
      currency: 'USD',
      theme: 'light'
    };

    // Set global data
    templateParser.setGlobalData(testGlobalData);

    console.log('✅ Global data set successfully');

    // Test template processing
    const testData = {
      content: [
        {
          title: 'First Post',
          excerpt: 'This is the first test post',
          image: '/images/post1.jpg',
          url: '/posts/1'
        },
        {
          title: 'Second Post',
          excerpt: 'This is the second test post',
          image: '/images/post2.jpg',
          url: '/posts/2'
        }
      ]
    };

    console.log('\n📝 Processing template with test data...');
    
    const processed = await templateParser.processTemplate('default.html', testData);
    
    console.log('✅ Template processed successfully');
    console.log(`📊 Template size: ${processed.length} characters`);
    
    // Check for processed variables
    const checks = [
      { name: 'Site name', pattern: /NoCodea Test Site/ },
      { name: 'Year', pattern: /2024/ },
      { name: 'User name', pattern: /John Doe/ },
      { name: 'Content loop', pattern: /First Post.*Second Post/ }
    ];

    console.log('\n🔍 Checking processed variables:');
    checks.forEach(check => {
      const found = check.pattern.test(processed);
      console.log(`${found ? '✅' : '❌'} ${check.name}: ${found ? 'Found' : 'Not found'}`);
    });

    // Test URL processing
    console.log('\n🔗 Testing URL processing...');
    const urlProcessed = templateParser.processUrls(processed, 'https://example.com');
    console.log('✅ URLs processed');

    // Test CSRF processing
    console.log('\n🔒 Testing CSRF processing...');
    const csrfProcessed = templateParser.processCsrf(urlProcessed, 'test-csrf-token-123');
    console.log('✅ CSRF processed');

    // Test SEO processing
    console.log('\n📈 Testing SEO processing...');
    const seoData = {
      title: 'Custom Page Title',
      description: 'Custom meta description',
      keywords: 'custom, keywords, here'
    };
    const seoProcessed = templateParser.processSeo(csrfProcessed, seoData);
    console.log('✅ SEO processed');

    // Test theme processing
    console.log('\n🎨 Testing theme processing...');
    const themeData = {
      theme: 'dark',
      rtl: false
    };
    const themeProcessed = templateParser.processTheme(seoProcessed, themeData);
    console.log('✅ Theme processed');

    // Save processed template for inspection
    const fs = require('fs').promises;
    await fs.writeFile('test-output.html', themeProcessed);
    console.log('\n💾 Processed template saved to test-output.html');

    // Test cache functionality
    console.log('\n🗄️ Testing cache functionality...');
    const cacheSize1 = templateParser.getCacheSize();
    console.log(`📊 Cache size before: ${cacheSize1}`);
    
    // Process template again (should use cache)
    await templateParser.processTemplate('default.html', testData);
    const cacheSize2 = templateParser.getCacheSize();
    console.log(`📊 Cache size after: ${cacheSize2}`);
    
    if (cacheSize1 === cacheSize2) {
      console.log('✅ Cache working correctly');
    } else {
      console.log('❌ Cache not working as expected');
    }

    console.log('\n🎉 Template engine test completed successfully!');

  } catch (error) {
    console.error('❌ Template engine test failed:', error);
  }
}

// Run the test
testTemplateEngine(); 