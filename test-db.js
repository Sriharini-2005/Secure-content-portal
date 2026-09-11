require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testConnection() {
  const uri = process.env.MONGODB_URI;

  console.log('\n--- MongoDB Connection Test ---');
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  // Hide password when printing the URI
  const maskedUri = uri.replace(/\/\/(.*):(.*)@/, '//***:***@');
  console.log(`Connecting to: ${maskedUri}`);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    console.log('✅ SUCCESS: Connected to MongoDB successfully!');
    console.log(`Database Name: ${mongoose.connection.name}`);
    console.log(`Host: ${mongoose.connection.host}\n`);
  } catch (error) {
    console.error('❌ ERROR: Could not connect to MongoDB.');
    console.error('Error Details:', error.message);
    
    if (error.message.includes('Invalid scheme')) {
      console.log('\n💡 Tip: Make sure your MONGODB_URI starts with "mongodb://" or "mongodb+srv://" in .env.local');
    } else if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.log('\n💡 Tip: Double check your MongoDB username and password in .env.local.');
    } else if (error.message.includes('querySrv ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
      console.log('\n💡 Tip: Check your internet connection or verify if your IP address is whitelisted in MongoDB Atlas Network Access (0.0.0.0/0).');
    }
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testConnection();