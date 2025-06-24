const TemplateParser = require('./services/templateParser');
const fs = require('fs').promises;
const path = require('path');

async function testSimpleComponents() {
  console.log('=== Testing Simple Components ===\n');
  const parser = new TemplateParser();

  const testData = {
    category: {
        name: 'Featured Category',
        description: 'This is the description for the featured category.'
    },
    categories: {
      count: 2,
      categories: [
        { name: 'Simple Cat 1', url: '/simple-1', images: ['/img/simple1.jpg'] },
        { name: 'Simple Cat 2', url: '/simple-2', images: ['/img/simple2.jpg'] },
      ]
    },
    checkout: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com'
    }
  };

  try {
    // Test 1: Single Category (category.tpl)
    parser.clearCache();
    parser.setComponentData('category', [testData.category]);
    console.log('1. Testing Single Category Component (category.tpl)...');
    const categoryResult = await parser.processTemplate('category.tpl');
    await fs.writeFile(path.resolve(__dirname, 'test-category-output.html'), categoryResult);
    console.log('✓ Single Category component processed. Output saved to test-category-output.html\n');

    // Test 2: Simple Categories (categories_simple.tpl)
    parser.clearCache();
    parser.setComponentData('categories', [testData.categories]);
    console.log('2. Testing Simple Categories Component (categories_simple.tpl)...');
    const simpleCategoriesResult = await parser.processTemplate('categories_simple.tpl');
    await fs.writeFile(path.resolve(__dirname, 'test-simple-categories-output.html'), simpleCategoriesResult);
    console.log('✓ Simple Categories component processed. Output saved to test-simple-categories-output.html\n');
    
    // Test 3: Checkout (checkout.tpl)
    parser.clearCache();
    parser.setComponentData('checkout', [testData.checkout]);
    console.log('3. Testing Checkout Component (checkout.tpl)...');
    const checkoutResult = await parser.processTemplate('checkout.tpl');
    await fs.writeFile(path.resolve(__dirname, 'test-checkout-output.html'), checkoutResult);
    console.log('✓ Checkout component processed. Output saved to test-checkout-output.html\n');

    console.log('\n=== All Simple Component Tests Completed! ===');
  } catch (error) {
    console.error('Error testing simple components:', error);
  }
}

testSimpleComponents(); 