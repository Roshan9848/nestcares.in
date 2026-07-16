const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Settings = require('../models/Settings');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const updateSmtp = async () => {
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

    const emailSettings = {
      key: 'email',
      value: {
        smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
        smtpPort: parseInt(process.env.SMTP_PORT) || 587,
        smtpUser: process.env.SMTP_USER || 'nestcares.in@gmail.com',
        smtpPass: process.env.SMTP_PASS || 'ewbmmqreoaahyfqm',
        businessEmail: process.env.BUSINESS_EMAIL || 'nestcares.in@gmail.com',
        senderName: process.env.SENDER_NAME || 'Nest Cares Support',
        templates: {
          patientConfirmation: 'Dear {{patientName}},\n\nThank you for choosing Nest Cares. We have received your booking request for {{serviceName}} on {{date}} at {{time}}.\n\nOur medical coordinator will call you shortly at {{mobile}} to confirm your appointment.\n\nAddress Details:\n{{address}}\n\nWarm regards,\nNest Cares Coordination Team',
          adminNotification: 'Hello Admin,\n\nA new booking request has been submitted:\n\nPatient Name: {{patientName}}\nPhone: {{mobile}}\nEmail: {{email}}\nService: {{serviceName}}\nDate: {{date}}\nTime: {{time}}\nAddress: {{address}}\nNotes: {{notes}}'
        }
      }
    };

    console.log('Updating email configuration document in Settings collection...');
    await Settings.findOneAndUpdate(
      { key: 'email' },
      emailSettings,
      { upsert: true, new: true }
    );
    console.log('✅ SMTP email settings successfully updated in MongoDB Atlas!');
    
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
};

updateSmtp();
