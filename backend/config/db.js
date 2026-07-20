const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://nestcaresin_db_user:cr3ntemeJtYpDCGg@cluster0.b8dulz4.mongodb.net/nestcares?retryWrites=true&w=majority&appName=Cluster0';
    const conn = await mongoose.connect(mongoUri, {
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
