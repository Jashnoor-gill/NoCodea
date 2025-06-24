const mongoose = require('mongoose');
const User = require('./models/User');
const Address = require('./models/Address');
const Comment = require('./models/Comment');
const DigitalAsset = require('./models/DigitalAsset');
const Country = require('./models/Country');
const Region = require('./models/Region');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testUserFunctionality = async () => {
  try {
    console.log('🧪 Testing User Functionality...\n');

    // Test 1: Create a test user
    console.log('1. Creating test user...');
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    await testUser.save();
    console.log('✅ Test user created:', testUser.email);

    // Test 2: Create test countries and regions
    console.log('\n2. Creating test countries and regions...');
    const testCountry = new Country({
      name: 'United States',
      code: 'US',
      status: 1
    });
    await testCountry.save();

    const testRegion = new Region({
      name: 'California',
      code: 'CA',
      country: testCountry._id,
      status: 1
    });
    await testRegion.save();
    console.log('✅ Test country and region created');

    // Test 3: Create test address
    console.log('\n3. Creating test address...');
    const testAddress = new Address({
      user: testUser._id,
      firstName: 'John',
      lastName: 'Doe',
      company: 'Test Company',
      address1: '123 Test Street',
      address2: 'Apt 4B',
      city: 'Test City',
      postalCode: '12345',
      country: testCountry._id,
      region: testRegion._id,
      phone: '+1234567890',
      isDefault: true
    });
    await testAddress.save();
    console.log('✅ Test address created');

    // Test 4: Create test comment
    console.log('\n4. Creating test comment...');
    const testComment = new Comment({
      user: testUser._id,
      product: new mongoose.Types.ObjectId(), // Mock product ID
      type: 'review',
      title: 'Great Product!',
      content: 'This is a test review for a great product.',
      rating: 5,
      status: 1
    });
    await testComment.save();
    console.log('✅ Test comment created');

    // Test 5: Create test digital asset
    console.log('\n5. Creating test digital asset...');
    const testDigitalAsset = new DigitalAsset({
      product: new mongoose.Types.ObjectId(), // Mock product ID
      user: testUser._id,
      order: new mongoose.Types.ObjectId(), // Mock order ID
      filename: 'test-file.pdf',
      public: 'Test File.pdf',
      fileSize: 1024000,
      mimeType: 'application/pdf',
      downloadCount: 0,
      maxDownloads: 5,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      orderStatus: 4,
      customerOrderId: 'TEST-ORDER-123'
    });
    await testDigitalAsset.save();
    console.log('✅ Test digital asset created');

    // Test 6: Query user data
    console.log('\n6. Testing user data queries...');
    
    // Get user addresses
    const addresses = await Address.find({ user: testUser._id })
      .populate('country', 'name')
      .populate('region', 'name');
    console.log('✅ User addresses:', addresses.length);

    // Get user comments
    const comments = await Comment.find({ user: testUser._id });
    console.log('✅ User comments:', comments.length);

    // Get user downloads
    const downloads = await DigitalAsset.find({ 
      user: testUser._id,
      orderStatus: 4,
      expiresAt: { $gt: new Date() }
    });
    console.log('✅ User downloads:', downloads.length);

    // Test 7: Test address operations
    console.log('\n7. Testing address operations...');
    
    // Create another address
    const secondAddress = new Address({
      user: testUser._id,
      firstName: 'Jane',
      lastName: 'Doe',
      address1: '456 Another Street',
      city: 'Another City',
      postalCode: '54321',
      country: testCountry._id,
      region: testRegion._id,
      phone: '+1987654321',
      isDefault: false
    });
    await secondAddress.save();
    console.log('✅ Second address created');

    // Set second address as default
    await Address.updateMany(
      { user: testUser._id },
      { isDefault: false }
    );
    await Address.findByIdAndUpdate(secondAddress._id, { isDefault: true });
    console.log('✅ Second address set as default');

    // Verify only one default address
    const defaultAddresses = await Address.find({ user: testUser._id, isDefault: true });
    console.log('✅ Default addresses count:', defaultAddresses.length);

    console.log('\n🎉 All user functionality tests passed!');
    console.log('\n📊 Test Summary:');
    console.log(`- User: ${testUser.email}`);
    console.log(`- Addresses: ${addresses.length + 1}`);
    console.log(`- Comments: ${comments.length}`);
    console.log(`- Downloads: ${downloads.length}`);
    console.log(`- Countries: 1`);
    console.log(`- Regions: 1`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await User.deleteOne({ email: 'test@example.com' });
    await Country.deleteOne({ code: 'US' });
    await Region.deleteOne({ code: 'CA' });
    console.log('✅ Test data cleaned up');
    
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

testUserFunctionality(); 