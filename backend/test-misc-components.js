const TemplateParser = require('./services/templateParser');

// Create a new instance of the template parser
const parser = new TemplateParser();

// Test data for the new components
const testData = {
  // Admin data
  admin: {
    0: {
      name: 'John Doe',
      dashboard_url: '/admin/dashboard',
      avatar: '/images/avatars/john-doe.png'
    }
  },

  // Breadcrumb data
  breadcrumb: {
    0: {
      count: 2,
      breadcrumb: [
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/products' }
      ]
    }
  },

  // Cart data
  cart: {
    0: {
      total_items: 2,
      total: 125.99,
      total_formatted: '$125.99',
      products: [
        {
          product_id: 1,
          key: 'abc',
          name: 'Laptop Pro',
          image: '/images/laptop-pro.jpg',
          quantity: 1,
          price: 99.99,
          price_formatted: '$99.99',
          total: 99.99,
          total_formatted: '$99.99',
          option_value: [
            { name: 'Color', value: 'Silver' },
            { name: 'Storage', value: '512GB' }
          ]
        }
      ],
      totals: [
        { title: 'Sub-Total', amount: '$99.99' },
        { title: 'Shipping', amount: '$26.00' },
        { title: 'Grand Total', amount: '$125.99' }
      ],
      coupons: [
        { name: 'SUMMER10', info: '10% off for summer sales' }
      ]
    }
  }
};

// Set component data for the parser
parser.setComponentData('admin', testData.admin[0]);
parser.setComponentData('breadcrumb', testData.breadcrumb[0]);
parser.setComponentData('cart', testData.cart[0]);

// Test all new component templates
async function testMiscComponents() {
  console.log('=== Testing Miscellaneous Components ===\n');

  try {
    // Test 1: Admin Component
    console.log('1. Testing Admin Component...');
    const adminResult = await parser.processTemplate('admin.tpl', {});
    console.log('✓ Admin component processed successfully. Output:\n', adminResult, '\n');

    // Test 2: Breadcrumb Component
    console.log('2. Testing Breadcrumb Component...');
    const breadcrumbResult = await parser.processTemplate('breadcrumb.tpl', {});
    console.log('✓ Breadcrumb component processed successfully. Output:\n', breadcrumbResult, '\n');

    // Test 3: Cart Component
    console.log('3. Testing Cart Component...');
    const cartResult = await parser.processTemplate('cart.tpl', {});
    console.log('✓ Cart component processed successfully. Output:\n', cartResult, '\n');

    // Show cache statistics
    const cacheStats = parser.getCacheSize();
    console.log('Cache Statistics:');
    console.log('- Templates cached:', cacheStats.templates);
    console.log('- Component indexes:', cacheStats.components);
    console.log('- Component data:', cacheStats.componentData);

    console.log('\n=== All Miscellaneous Tests Completed Successfully! ===');

  } catch (error) {
    console.error('Error testing miscellaneous components:', error);
  }
}

// Run the tests
testMiscComponents(); 