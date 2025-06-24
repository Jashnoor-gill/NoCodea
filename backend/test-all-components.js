const TemplateParser = require('./services/templateParser');

// Create a new instance of the template parser
const parser = new TemplateParser();

// Test data for all component types
const testData = {
  // Content categories data
  content_categories: {
    0: {
      count: 3,
      categories: [
        {
          taxonomy_item_id: 1,
          name: 'Electronics',
          url: '/category/electronics',
          active: true
        }
      ]
    }
  },

  // Product subscriptions data
  product_subscriptions: {
    0: {
      count: 2,
      limit: 5,
      product_subscription: [
        {
          subscription_id: 1,
          name: 'Monthly Premium',
          description: 'Premium monthly subscription',
          price: '$29.99/month',
          duration: '30 days'
        },
        {
          subscription_id: 2,
          name: 'Annual Pro',
          description: 'Annual professional subscription',
          price: '$299.99/year',
          duration: '365 days'
        }
      ]
    }
  },

  // Product variants data
  product_variants: {
    0: {
      count: 2,
      product_variant: [
        {
          product_variant_id: 1,
          variant_id: 1,
          name: 'Size',
          type: 'radio',
          required: true,
          values: [
            {
              product_variant_value_id: 1,
              name: 'Small',
              price: '+$5.00',
              image: '/images/small.jpg',
              checked: false
            },
            {
              product_variant_value_id: 2,
              name: 'Large',
              price: '+$15.00',
              image: '/images/large.jpg',
              checked: true
            }
          ]
        }
      ]
    }
  },

  // Product vendors data
  product_vendors: {
    0: {
      count: 2,
      limit: 5,
      vendor: [
        {
          vendor_id: 1,
          name: 'TechCorp Inc.',
          content: 'Leading technology vendor',
          image: '/images/techcorp.jpg',
          active: true
        },
        {
          vendor_id: 2,
          name: 'Digital Solutions',
          content: 'Digital products vendor',
          image: '/images/digital.jpg',
          active: false
        }
      ]
    }
  },

  // User addresses data
  user_address: {
    0: {
      count: 2,
      limit: 5,
      user_address: [
        {
          user_address_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          address: '123 Main St',
          city: 'New York',
          postcode: '10001',
          phone: '+1-555-0123'
        },
        {
          user_address_id: 2,
          first_name: 'Jane',
          last_name: 'Smith',
          address: '456 Oak Ave',
          city: 'Los Angeles',
          postcode: '90210',
          phone: '+1-555-0456'
        }
      ]
    }
  },

  // User wishlist data
  user_wishlist: {
    0: {
      count: 2,
      limit: 5,
      user_wishlist: [
        {
          product_id: 1,
          name: 'iPhone 15 Pro',
          url: '/product/iphone-15-pro',
          image: '/images/iphone-15-pro.jpg',
          content: 'Latest iPhone with advanced features',
          category: 'Smartphones',
          manufacturer: 'Apple',
          images: [
            {
              id: 1,
              image: '/images/iphone-15-pro-1.jpg'
            },
            {
              id: 2,
              image: '/images/iphone-15-pro-2.jpg'
            }
          ]
        },
        {
          product_id: 2,
          name: 'MacBook Air M2',
          url: '/product/macbook-air-m2',
          image: '/images/macbook-air-m2.jpg',
          content: 'Lightweight laptop with M2 chip',
          category: 'Laptops',
          manufacturer: 'Apple',
          images: [
            {
              id: 3,
              image: '/images/macbook-air-m2-1.jpg'
            }
          ]
        }
      ]
    }
  }
};

// Set component data for the parser
parser.setComponentData('content_categories', testData.content_categories);
parser.setComponentData('product_subscriptions', testData.product_subscriptions);
parser.setComponentData('product_variants', testData.product_variants);
parser.setComponentData('product_vendors', testData.product_vendors);
parser.setComponentData('user_address', testData.user_address);
parser.setComponentData('user_wishlist', testData.user_wishlist);

// Test all templates
async function testAllComponents() {
  console.log('=== Testing All Component Types ===\n');

  try {
    // Test 1: Content Categories
    console.log('1. Testing Content Categories...');
    const categoriesResult = await parser.processTemplate('content-categories.tpl', testData);
    console.log('✓ Categories processed successfully\n');

    // Test 2: Product Subscriptions
    console.log('2. Testing Product Subscriptions...');
    const subscriptionsResult = await parser.processTemplate('subscriptions.tpl', testData);
    console.log('✓ Subscriptions processed successfully\n');

    // Test 3: Product Variants
    console.log('3. Testing Product Variants...');
    const variantsResult = await parser.processTemplate('variants.tpl', testData);
    console.log('✓ Variants processed successfully\n');

    // Test 4: Product Vendors
    console.log('4. Testing Product Vendors...');
    const vendorsResult = await parser.processTemplate('vendors.tpl', testData);
    console.log('✓ Vendors processed successfully\n');

    // Test 5: User Addresses
    console.log('5. Testing User Addresses...');
    const addressesResult = await parser.processTemplate('address.tpl', testData);
    console.log('✓ Addresses processed successfully\n');

    // Test 6: User Wishlist
    console.log('6. Testing User Wishlist...');
    const wishlistResult = await parser.processTemplate('wishlist.tpl', testData);
    console.log('✓ Wishlist processed successfully\n');

    // Show cache statistics
    const cacheStats = parser.getCacheSize();
    console.log('Cache Statistics:');
    console.log('- Templates cached:', cacheStats.templates);
    console.log('- Component indexes:', cacheStats.components);
    console.log('- Component data:', cacheStats.componentData);

    // Test component data retrieval
    console.log('\nComponent Data Test:');
    const subscriptionsData = parser.componentData.get('product_subscriptions');
    console.log('Product subscriptions data:', subscriptionsData ? 'Available' : 'Not found');
    
    const variantsData = parser.componentData.get('product_variants');
    console.log('Product variants data:', variantsData ? 'Available' : 'Not found');
    
    const vendorsData = parser.componentData.get('product_vendors');
    console.log('Product vendors data:', vendorsData ? 'Available' : 'Not found');
    
    const addressesData = parser.componentData.get('user_address');
    console.log('User addresses data:', addressesData ? 'Available' : 'Not found');
    
    const wishlistData = parser.componentData.get('user_wishlist');
    console.log('User wishlist data:', wishlistData ? 'Available' : 'Not found');

    console.log('\n=== All Tests Completed Successfully! ===');

  } catch (error) {
    console.error('Error testing components:', error);
  }
}

// Run the tests
testAllComponents(); 