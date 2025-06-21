const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing NoCodea Website Builder Backend Setup...\n');

// Test environment variables
console.log('Environment Variables:');
console.log('- PORT:', process.env.PORT || 'Not set');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('- FRONTEND_URL:', process.env.FRONTEND_URL || 'Not set');

// Test MongoDB connection
async function testMongoDB() {
  try {
    console.log('\nTesting MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nocodea-builder');
    console.log('✅ MongoDB connection successful!');
    await mongoose.connection.close();
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    console.log('Note: Make sure MongoDB is running locally or update MONGODB_URI in .env');
  }
}

// Test required modules
console.log('\nTesting required modules...');
try {
  require('express');
  require('bcryptjs');
  require('jsonwebtoken');
  require('cors');
  require('helmet');
  require('express-validator');
  require('multer');
  console.log('✅ All required modules are installed!');
} catch (error) {
  console.log('❌ Missing module:', error.message);
  console.log('Run: npm install');
}

// Run tests
testMongoDB().then(() => {
  console.log('\n🎉 Setup test completed!');
  console.log('\nTo start the server:');
  console.log('1. Make sure MongoDB is running');
  console.log('2. Run: npm run dev');
  console.log('3. Server will start on http://localhost:5000');
}); 