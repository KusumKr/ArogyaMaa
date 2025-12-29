// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    // Clean the connection string (remove quotes, trim whitespace)
    let mongoUri = process.env.MONGODB_URI.trim().replace(/^["']|["']$/g, '');
    
    // If the string includes "MONGODB_URI=", extract just the value part
    if (mongoUri.includes('MONGODB_URI=')) {
      mongoUri = mongoUri.split('MONGODB_URI=')[1]?.trim() || mongoUri;
    }
    
    // Validate connection string format
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      console.error('❌ Connection string format error:');
      console.error(`   Expected: mongodb://... or mongodb+srv://...`);
      console.error(`   Got: ${mongoUri.substring(0, 80)}...`);
      console.error('\n💡 Check your .env file:');
      console.error('   - Line should be: MONGODB_URI=mongodb+srv://...');
      console.error('   - No quotes around the value');
      console.error('   - No spaces around the = sign');
      throw new Error(`Invalid connection string format`);
    }

    // Remove deprecated options (not needed in Mongoose 6+)
    const conn = await mongoose.connect(mongoUri);

    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌍 Host: ${conn.connection.host}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    
    // Provide helpful error messages for common issues
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('\n💡 Authentication failed. Please check:');
      console.error('   1. MongoDB username and password in MONGODB_URI are correct');
      console.error('   2. Password is properly URL-encoded:');
      console.error('      - @ should be %40');
      console.error('      - # should be %23');
      console.error('      - ! should be %21');
      console.error('      - / should be %2F');
      console.error('   3. Database user has "readWrite" permissions');
      console.error('   4. IP address is whitelisted in MongoDB Atlas');
      console.error('      - Go to Network Access → Add IP Address → 0.0.0.0/0 (for all)');
      console.error('\n   Example format:');
      console.error('   mongodb+srv://username:password%40@cluster.mongodb.net/arogyamaa');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n💡 Network error. Please check:');
      console.error('   1. Internet connection is active');
      console.error('   2. MongoDB Atlas cluster is running');
      console.error('   3. Connection string is correct');
    }
    
    // Don't exit - allow app to run with in-memory fallback
    console.warn('⚠️  App will continue with in-memory storage');
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

module.exports = connectDB;