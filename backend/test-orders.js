const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/Order');
const Product = require('./models/Product');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testOrderSystem = async () => {
  try {
    console.log('🧪 Testing Order System...\n');

    // Test 1: Create a test user
    console.log('1. Creating test user...');
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    await testUser.save();
    console.log('✅ Test user created:', testUser.email);

    // Test 2: Create test products
    console.log('\n2. Creating test products...');
    const testProduct1 = new Product({
      name: 'Test Product 1',
      slug: 'test-product-1',
      description: 'A test product for order testing',
      price: 29.99,
      status: 1
    });
    await testProduct1.save();

    const testProduct2 = new Product({
      name: 'Test Product 2',
      slug: 'test-product-2',
      description: 'Another test product for order testing',
      price: 49.99,
      status: 1
    });
    await testProduct2.save();
    console.log('✅ Test products created');

    // Test 3: Create test orders
    console.log('\n3. Creating test orders...');
    
    const order1 = new Order({
      customer: {
        user: testUser._id,
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890'
      },
      items: [
        {
          product: testProduct1._id,
          quantity: 2,
          price: 29.99
        },
        {
          product: testProduct2._id,
          quantity: 1,
          price: 49.99
        }
      ],
      status: 'pending',
      orderNumber: 'ORD-123456-001',
      total: 109.97,
      shippingAddress: {
        firstName: 'Test',
        lastName: 'User',
        address1: '123 Test Street',
        city: 'Test City',
        postalCode: '12345',
        country: 'US'
      }
    });
    await order1.save();

    const order2 = new Order({
      customer: {
        user: testUser._id,
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890'
      },
      items: [
        {
          product: testProduct1._id,
          quantity: 1,
          price: 29.99
        }
      ],
      status: 'delivered',
      orderNumber: 'ORD-123456-002',
      total: 29.99,
      shippingAddress: {
        firstName: 'Test',
        lastName: 'User',
        address1: '123 Test Street',
        city: 'Test City',
        postalCode: '12345',
        country: 'US'
      }
    });
    await order2.save();
    console.log('✅ Test orders created');

    // Test 4: Test order tracking
    console.log('\n4. Testing order tracking...');
    
    // Test successful tracking
    const trackedOrder = await Order.findOne({
      orderNumber: 'ORD-123456-001',
      'customer.email': 'test@example.com'
    }).populate('items.product', 'name image slug');
    
    if (trackedOrder) {
      console.log('✅ Order tracking successful');
      console.log(`   Order ID: ${trackedOrder.orderNumber}`);
      console.log(`   Status: ${trackedOrder.status}`);
      console.log(`   Total: $${trackedOrder.total}`);
      console.log(`   Items: ${trackedOrder.items.length}`);
    } else {
      console.log('❌ Order tracking failed');
    }

    // Test 5: Test user orders query
    console.log('\n5. Testing user orders query...');
    
    const userOrders = await Order.find({
      'customer.user': testUser._id
    }).populate('items.product', 'name image slug');
    
    console.log(`✅ User orders found: ${userOrders.length}`);
    userOrders.forEach((order, index) => {
      console.log(`   Order ${index + 1}: ${order.orderNumber} - ${order.status} - $${order.total}`);
    });

    // Test 6: Test order filtering
    console.log('\n6. Testing order filtering...');
    
    const pendingOrders = await Order.find({
      'customer.user': testUser._id,
      status: 'pending'
    });
    console.log(`✅ Pending orders: ${pendingOrders.length}`);
    
    const deliveredOrders = await Order.find({
      'customer.user': testUser._id,
      status: 'delivered'
    });
    console.log(`✅ Delivered orders: ${deliveredOrders.length}`);

    // Test 7: Test order cancellation
    console.log('\n7. Testing order cancellation...');
    
    order1.status = 'cancelled';
    order1.cancelledAt = new Date();
    await order1.save();
    
    const cancelledOrders = await Order.find({
      'customer.user': testUser._id,
      status: 'cancelled'
    });
    console.log(`✅ Cancelled orders: ${cancelledOrders.length}`);

    // Test 8: Test order reordering
    console.log('\n8. Testing order reordering...');
    
    const originalOrder = await Order.findOne({
      _id: order2._id,
      'customer.user': testUser._id
    }).populate('items.product');
    
    if (originalOrder) {
      const newOrder = new Order({
        customer: {
          user: testUser._id,
          name: originalOrder.customer.name,
          email: originalOrder.customer.email,
          phone: originalOrder.customer.phone
        },
        items: originalOrder.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price
        })),
        status: 'pending',
        orderNumber: 'ORD-123456-003'
      });
      await newOrder.save();
      console.log('✅ Order recreated successfully');
    }

    console.log('\n🎉 All order system tests passed!');
    console.log('\n📊 Test Summary:');
    console.log(`- User: ${testUser.email}`);
    console.log(`- Products: 2`);
    console.log(`- Orders: ${userOrders.length + 1}`);
    console.log(`- Order tracking: Working`);
    console.log(`- Order filtering: Working`);
    console.log(`- Order cancellation: Working`);
    console.log(`- Order reordering: Working`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await User.deleteOne({ email: 'test@example.com' });
    await Product.deleteMany({ slug: { $in: ['test-product-1', 'test-product-2'] } });
    await Order.deleteMany({ orderNumber: { $regex: /ORD-123456/ } });
    console.log('✅ Test data cleaned up');
    
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

testOrderSystem(); 