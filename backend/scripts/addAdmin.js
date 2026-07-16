const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const addAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log('Connecting to database...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected successfully.');

    const adminUsers = [
      {
        name: 'Super Admin Rohith',
        email: 'rohith@nestcares.in',
        password: 'Roya@1522'
      },
      {
        name: 'Nest Cares Admin',
        email: 'nestcares.in@gmail.com',
        password: 'Roya@1522'
      }
    ];

    for (const adminData of adminUsers) {
      // Find if user already exists
      let user = await User.findOne({ email: adminData.email });
      
      if (user) {
        console.log(`User ${adminData.email} already exists. Updating password...`);
        user.password = adminData.password;
        await user.save();
        console.log(`✅ Updated password for ${adminData.email}`);
      } else {
        console.log(`User ${adminData.email} does not exist. Creating...`);
        user = new User({
          name: adminData.name,
          email: adminData.email,
          password: adminData.password,
          role: 'admin'
        });
        await user.save();
        console.log(`✅ Created admin user ${adminData.email}`);
      }
    }

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Adding admin failed:', error);
    process.exit(1);
  }
};

addAdmin();
