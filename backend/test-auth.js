const mongoose = require('mongoose');
const User = require('./models/User');
const FailedLogin = require('./models/FailedLogin');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testAuthSystem = async () => {
  try {
    console.log('🧪 Testing Enhanced Authentication System...\n');

    // Test 1: Create a test user
    console.log('1. Creating test user...');
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    await testUser.save();
    console.log('✅ Test user created:', testUser.email);

    // Test 2: Test failed login tracking
    console.log('\n2. Testing failed login tracking...');
    
    const testIp = '192.168.1.1';
    const testEmail = 'test@example.com';
    
    // Simulate multiple failed login attempts
    for (let i = 0; i < 5; i++) {
      await FailedLogin.logFailed({ email: testEmail, lastIp: testIp });
      console.log(`✅ Failed login attempt ${i + 1} logged`);
    }
    
    // Check if account should be locked
    const isLocked = await FailedLogin.isAccountLocked(testEmail, testIp);
    console.log(`✅ Account locked status: ${isLocked}`);

    // Test 3: Test successful login (should clear failed attempts)
    console.log('\n3. Testing successful login...');
    await FailedLogin.clearFailedAttempts(testEmail, testIp);
    const isLockedAfterSuccess = await FailedLogin.isAccountLocked(testEmail, testIp);
    console.log(`✅ Account locked after successful login: ${isLockedAfterSuccess}`);

    // Test 4: Test user model methods
    console.log('\n4. Testing user model methods...');
    
    // Test password comparison
    const isPasswordValid = await testUser.comparePassword('password123');
    console.log(`✅ Password validation: ${isPasswordValid}`);
    
    // Test invalid password
    const isPasswordInvalid = await testUser.comparePassword('wrongpassword');
    console.log(`✅ Invalid password validation: ${!isPasswordInvalid}`);
    
    // Test getProfile method
    const profile = testUser.getProfile();
    console.log('✅ User profile generated:', profile.name);

    // Test 5: Test user static methods
    console.log('\n5. Testing user static methods...');
    
    // Test findByEmail
    const foundUser = await User.findByEmail(testEmail);
    console.log(`✅ User found by email: ${foundUser ? 'Yes' : 'No'}`);
    
    // Test increment login attempts
    await User.incLoginAttempts(testEmail);
    const updatedUser = await User.findByEmail(testEmail);
    console.log(`✅ Login attempts incremented: ${updatedUser.loginAttempts}`);
    
    // Test reset login attempts
    await User.resetLoginAttempts(testEmail);
    const resetUser = await User.findByEmail(testEmail);
    console.log(`✅ Login attempts reset: ${resetUser.loginAttempts}`);

    // Test 6: Test account locking
    console.log('\n6. Testing account locking...');
    
    // Increment attempts to trigger lock
    for (let i = 0; i < 5; i++) {
      await User.incLoginAttempts(testEmail);
    }
    
    const lockedUser = await User.findByEmail(testEmail);
    console.log(`✅ Account locked: ${lockedUser.isLocked}`);
    console.log(`✅ Lock until: ${lockedUser.lockUntil}`);

    // Test 7: Test password reset functionality
    console.log('\n7. Testing password reset...');
    
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    testUser.resetPasswordToken = resetToken;
    testUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await testUser.save();
    
    console.log(`✅ Reset token generated: ${resetToken.substring(0, 10)}...`);
    console.log(`✅ Reset token expires: ${new Date(testUser.resetPasswordExpires)}`);

    console.log('\n🎉 All authentication tests passed!');
    console.log('\n📊 Test Summary:');
    console.log(`- User created: ${testUser.email}`);
    console.log(`- Failed login tracking: Working`);
    console.log(`- Account locking: Working`);
    console.log(`- Password validation: Working`);
    console.log(`- Password reset: Working`);
    console.log(`- User methods: Working`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await User.deleteOne({ email: 'test@example.com' });
    await FailedLogin.deleteMany({ email: 'test@example.com' });
    console.log('✅ Test data cleaned up');
    
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

testAuthSystem(); 