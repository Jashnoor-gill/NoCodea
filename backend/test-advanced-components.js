const TemplateParser = require('./services/templateParser');
const fs = require('fs').promises;
const path = require('path');

async function testAdvancedComponents() {
  console.log('=== Testing Advanced Components ===\n');
  const parser = new TemplateParser();

  const testData = {
    comments: {
        count: 2,
        limit: 5,
        comment: [
            { comment_id: 101, level: 1, content: 'This is the first comment.', author: 'Jane Doe', avatar: '/img/avatar1.png', 'reply-url': '/reply/101' },
            { comment_id: 102, level: 2, content: 'This is a reply.', author: 'John Smith', avatar: '/img/avatar2.png', 'reply-url': '/reply/102' }
        ]
    },
    currency: {
        active: { name: 'US Dollar', symbol_left: '$', symbol_right: ''},
        current: 'USD',
        currency: [
            { currency_id: 1, code: 'USD', name: 'US Dollar' },
            { currency_id: 2, code: 'EUR', name: 'Euro' }
        ]
    },
    digital_assets: {
        count: 1,
        limit: 5,
        digital_asset: [
            { digital_asset_id: 201, name: 'My Awesome E-book', thumbnail: '/img/ebook.png', download_url: '/download/201' }
        ]
    }
  };

  try {
    // Test 1: Comments (comments.tpl)
    parser.clearCache();
    parser.setComponentData('comments', [testData.comments]);
    console.log('1. Testing Comments Component (comments.tpl)...');
    const commentsResult = await parser.processTemplate('comments.tpl');
    await fs.writeFile(path.resolve(__dirname, 'test-comments-output.html'), commentsResult);
    console.log('✓ Comments component processed. Output saved to test-comments-output.html\n');

    // Test 2: Currency (currency.tpl)
    parser.clearCache();
    parser.setComponentData('currency', [testData.currency]);
    console.log('2. Testing Currency Component (currency.tpl)...');
    const currencyResult = await parser.processTemplate('currency.tpl');
    await fs.writeFile(path.resolve(__dirname, 'test-currency-output.html'), currencyResult);
    console.log('✓ Currency component processed. Output saved to test-currency-output.html\n');
    
    // Test 3: Digital Assets (digital_assets.tpl)
    parser.clearCache();
    parser.setComponentData('digital_assets', [testData.digital_assets]);
    console.log('3. Testing Digital Assets Component (digital_assets.tpl)...');
    const digitalAssetsResult = await parser.processTemplate('digital_assets.tpl');
    await fs.writeFile(path.resolve(__dirname, 'test-digital-assets-output.html'), digitalAssetsResult);
    console.log('✓ Digital Assets component processed. Output saved to test-digital-assets-output.html\n');

    console.log('\n=== All Advanced Component Tests Completed! ===');
  } catch (error) {
    console.error('Error testing advanced components:', error);
  }
}

testAdvancedComponents(); 