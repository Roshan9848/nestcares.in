const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/home-healthcare', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    global.dbConnected = true;
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Server will run using JSON File Database Fallback (under backend/data/) for development stability!');
    isConnected = false;
    global.dbConnected = false;
  }
};

module.exports = { connectDB, isConnected: () => isConnected };
