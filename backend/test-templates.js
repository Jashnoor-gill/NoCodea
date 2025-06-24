const templateParser = require('./services/templateParser');

async function testAllTemplates() {
  console.log('🧪 Testing All Templates...\n');

  try {
    // Test data for all templates
    const testData = {
      // Global data
      global: {
        site: {
          name: 'NoCodea Store',
          logo: '/images/logo.png',
          description: {
            title: 'Welcome to NoCodea Store',
            tagline: 'Build amazing websites without code',
            'meta-description': 'NoCodea is a powerful no-code website builder',
            'meta-keywords': 'website builder, no-code, drag and drop'
          }
        },
        user: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      },

      // Category template data
      category: {
        'category-name': 'Electronics',
        'category-description': 'Latest electronic gadgets and devices',
        'products-count': 12,
        'total-products': 50,
        products: [
          {
            'product-id': 1,
            'product-name': 'Smartphone X',
            'product-excerpt': 'Latest smartphone with advanced features',
            'product-price': '$599.99',
            'product-old-price': '$699.99',
            'product-slug': 'smartphone-x',
            'product-image': '/images/products/smartphone.jpg'
          },
          {
            'product-id': 2,
            'product-name': 'Laptop Pro',
            'product-excerpt': 'Professional laptop for work and gaming',
            'product-price': '$1299.99',
            'product-slug': 'laptop-pro',
            'product-image': '/images/products/laptop.jpg'
          }
        ],
        manufacturers: [
          { 'manufacturer-id': 1, 'manufacturer-name': 'TechCorp' },
          { 'manufacturer-id': 2, 'manufacturer-name': 'GadgetPro' }
        ],
        pagination: {
          'prev-page': true,
          'prev-url': '/categories/electronics?page=1',
          pages: [
            { 'page-number': 1, 'page-url': '/categories/electronics?page=1', current: true },
            { 'page-number': 2, 'page-url': '/categories/electronics?page=2' }
          ],
          'next-page': true,
          'next-url': '/categories/electronics?page=3'
        }
      },

      // Checkout template data
      checkout: {
        post: {
          'billing_first_name': 'John',
          'billing_last_name': 'Doe',
          'billing_email': 'john@example.com',
          'billing_phone': '+1-555-123-4567',
          'billing_address': '123 Main St',
          'billing_city': 'New York',
          'billing_postal_code': '10001',
          'billing_country_id': '1',
          'billing_region_id': '1',
          'register': '1',
          'newsletter': '1',
          'terms': '1'
        },
        checkout: {
          'payment_method': 'credit_card',
          'shipping_method': 'standard'
        },
        countries: [
          { country_id: '1', name: 'United States' },
          { country_id: '2', name: 'Canada' },
          { country_id: '3', name: 'United Kingdom' }
        ],
        regions: [
          { region_id: '1', name: 'New York' },
          { region_id: '2', name: 'California' },
          { region_id: '3', name: 'Texas' }
        ],
        'payment-methods': [
          { 'payment-method-id': 'credit_card', 'payment-method-name': 'Credit Card' },
          { 'payment-method-id': 'paypal', 'payment-method-name': 'PayPal' }
        ],
        'shipping-methods': [
          { 'shipping-method-id': 'standard', 'shipping-method-name': 'Standard Shipping', 'shipping-method-price': '$5.99' },
          { 'shipping-method-id': 'express', 'shipping-method-name': 'Express Shipping', 'shipping-method-price': '$15.99' }
        ],
        'cart-items': [
          {
            'cart-item-name': 'Smartphone X',
            'cart-item-quantity': 1,
            'cart-item-price': '$599.99'
          },
          {
            'cart-item-name': 'Laptop Pro',
            'cart-item-quantity': 1,
            'cart-item-price': '$1299.99'
          }
        ],
        totals: [
          { 'total-title': 'Subtotal', 'total-value': '$1899.98' },
          { 'total-title': 'Shipping', 'total-value': '$5.99' },
          { 'total-title': 'Tax', 'total-value': '$189.99' }
        ],
        'grand-total': '$2095.96'
      },

      // Confirm template data
      confirm: {
        order: {
          'order_id': 'ORD-2024-001',
          'order_number': 'ORD-2024-001',
          'date_added': '2024-01-15 10:30:00',
          'status': 'Processing',
          'payment_method': 'Credit Card',
          'total': '$2095.96',
          'billing_first_name': 'John',
          'billing_last_name': 'Doe',
          'billing_address': '123 Main St',
          'billing_city': 'New York',
          'billing_region': 'NY',
          'billing_postal_code': '10001',
          'billing_country': 'United States',
          'billing_email': 'john@example.com'
        },
        'order-items': [
          {
            'order-item-name': 'Smartphone X',
            'order-item-quantity': 1,
            'order-item-price': '$599.99',
            'order-item-image': '/images/products/smartphone.jpg'
          },
          {
            'order-item-name': 'Laptop Pro',
            'order-item-quantity': 1,
            'order-item-price': '$1299.99',
            'order-item-image': '/images/products/laptop.jpg'
          }
        ],
        'order-totals': [
          { 'order-total-title': 'Subtotal', 'order-total-value': '$1899.98' },
          { 'order-total-title': 'Shipping', 'order-total-value': '$5.99' },
          { 'order-total-title': 'Tax', 'order-total-value': '$189.99' }
        ]
      },

      // Order template data
      order: {
        order: {
          'order_id': 'ORD-2024-001',
          'order_number': 'ORD-2024-001',
          'date_added': '2024-01-15 10:30:00',
          'status': 'Processing',
          'status-color': 'warning',
          'total': '$2095.96',
          'billing_first_name': 'John',
          'billing_last_name': 'Doe',
          'billing_address': '123 Main St',
          'billing_city': 'New York',
          'billing_region': 'NY',
          'billing_postal_code': '10001',
          'billing_country': 'United States',
          'billing_email': 'john@example.com',
          'shipping_address': '456 Oak Ave',
          'shipping_city': 'Los Angeles',
          'shipping_region': 'CA',
          'shipping_postal_code': '90210',
          'shipping_country': 'United States',
          'can-cancel': true,
          'can-return': true
        },
        'order-items': [
          {
            'order-item-name': 'Smartphone X',
            'order-item-model': 'SMX-2024',
            'order-item-quantity': 1,
            'order-item-price': '$599.99',
            'order-item-total': '$599.99',
            'order-item-image': '/images/products/smartphone.jpg'
          },
          {
            'order-item-name': 'Laptop Pro',
            'order-item-model': 'LAP-2024',
            'order-item-quantity': 1,
            'order-item-price': '$1299.99',
            'order-item-total': '$1299.99',
            'order-item-image': '/images/products/laptop.jpg'
          }
        ],
        'order-totals': [
          { 'order-total-title': 'Subtotal', 'order-total-value': '$1899.98' },
          { 'order-total-title': 'Shipping', 'order-total-value': '$5.99' },
          { 'order-total-title': 'Tax', 'order-total-value': '$189.99' }
        ],
        'order-history': [
          {
            'order-history-status': 'Order Placed',
            'order-history-comment': 'Order has been placed successfully',
            'order-history-date_added': '2024-01-15 10:30:00'
          },
          {
            'order-history-status': 'Processing',
            'order-history-comment': 'Order is being processed',
            'order-history-date_added': '2024-01-15 11:00:00'
          }
        ]
      }
    };

    // Set global data
    templateParser.setGlobalData(testData.global);

    // Test Category Template
    console.log('📁 Testing Category Template...');
    const categoryProcessed = await templateParser.processTemplate('category.html', testData.category);
    console.log(`✅ Category template processed (${categoryProcessed.length} characters)`);

    // Test Checkout Template
    console.log('\n🛒 Testing Checkout Template...');
    const checkoutProcessed = await templateParser.processTemplate('checkout.html', testData.checkout);
    console.log(`✅ Checkout template processed (${checkoutProcessed.length} characters)`);

    // Test Confirm Template
    console.log('\n✅ Testing Confirm Template...');
    const confirmProcessed = await templateParser.processTemplate('confirm.html', testData.confirm);
    console.log(`✅ Confirm template processed (${confirmProcessed.length} characters)`);

    // Test Order Template
    console.log('\n📋 Testing Order Template...');
    const orderProcessed = await templateParser.processTemplate('order.html', testData.order);
    console.log(`✅ Order template processed (${orderProcessed.length} characters)`);

    // Save processed templates for inspection
    const fs = require('fs').promises;
    
    await fs.writeFile('test-category-output.html', categoryProcessed);
    await fs.writeFile('test-checkout-output.html', checkoutProcessed);
    await fs.writeFile('test-confirm-output.html', confirmProcessed);
    await fs.writeFile('test-order-output.html', orderProcessed);
    
    console.log('\n💾 Processed templates saved:');
    console.log('  - test-category-output.html');
    console.log('  - test-checkout-output.html');
    console.log('  - test-confirm-output.html');
    console.log('  - test-order-output.html');

    // Check for key elements in processed templates
    console.log('\n🔍 Checking processed content:');
    
    const checks = [
      { name: 'Category - Product names', template: categoryProcessed, pattern: /Smartphone X.*Laptop Pro/ },
      { name: 'Category - Pagination', template: categoryProcessed, pattern: /page=1.*page=2/ },
      { name: 'Checkout - Form fields', template: checkoutProcessed, pattern: /John.*Doe.*john@example\.com/ },
      { name: 'Checkout - Countries', template: checkoutProcessed, pattern: /United States.*Canada/ },
      { name: 'Confirm - Order number', template: confirmProcessed, pattern: /ORD-2024-001/ },
      { name: 'Order - Status', template: orderProcessed, pattern: /Processing/ },
      { name: 'Order - History', template: orderProcessed, pattern: /Order Placed.*Processing/ }
    ];

    checks.forEach(check => {
      const found = check.pattern.test(check.template);
      console.log(`${found ? '✅' : '❌'} ${check.name}: ${found ? 'Found' : 'Not found'}`);
    });

    console.log('\n🎉 All templates tested successfully!');

  } catch (error) {
    console.error('❌ Template testing failed:', error);
  }
}

// Run the test
testAllTemplates(); 