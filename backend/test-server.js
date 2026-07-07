const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

console.log('🧪 Starting CareHome Backend Validation Checks...');

// 1. Check database models compile successfully
try {
  const User = require('./models/User');
  const Service = require('./models/Service');
  const Booking = require('./models/Booking');
  const Settings = require('./models/Settings');
  const Testimonial = require('./models/Testimonial');
  const Faq = require('./models/Faq');
  console.log('✅ All Mongoose schemas and models compile successfully.');
} catch (error) {
  console.error('❌ Failed to compile models:', error.message);
  process.exit(1);
}

// 2. Validate transparent database helper layer
try {
  // Set global flag to simulate MongoDB offline mode
  global.dbConnected = false;
  
  const dbHelper = require('./utils/dbHelper');
  console.log('✅ Database helper module loaded.');

  // Check JSON files exist under backend/data/
  const dataDir = path.join(__dirname, 'data');
  const userFile = path.join(dataDir, 'users.json');
  const serviceFile = path.join(dataDir, 'services.json');
  const settingsFile = path.join(dataDir, 'settings.json');

  if (!fs.existsSync(userFile)) {
    throw new Error('users.json was not seeded');
  }
  if (!fs.existsSync(serviceFile)) {
    throw new Error('services.json was not seeded');
  }
  if (!fs.existsSync(settingsFile)) {
    throw new Error('settings.json was not seeded');
  }
  console.log('✅ Local JSON databases auto-created and seeded successfully.');

  // Read data
  const User = require('./models/User');
  dbHelper.findOne(User, { email: 'admin@carehome.com' }).then(user => {
    if (!user) {
      throw new Error('Could not find seeded admin user via dbHelper');
    }
    
    // Check password check compatibility
    const passwordMatches = bcrypt.compareSync('admin123', user.password);
    if (!passwordMatches) {
      throw new Error('Admin seed password check failed');
    }
    console.log(`✅ Seed Admin Authentication verified (Email: ${user.email}, Role: ${user.role}).`);
  });

  const Service = require('./models/Service');
  dbHelper.find(Service, { isVisible: true }).then(servicesList => {
    if (servicesList.length === 0) {
      throw new Error('Could not read services via dbHelper');
    }
    console.log(`✅ Seed Services fetched (Count: ${servicesList.length}).`);
    console.log('🎉 CareHome Backend Validation checks PASSED successfully!');
  });

} catch (error) {
  console.error('❌ Database helper or JSON fallback check failed:', error.message);
  process.exit(1);
}
