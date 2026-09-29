const { sendEmail } = require('../utils/email');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const runTest = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log('Connecting to database to pull SMTP settings...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    global.dbConnected = true;
    console.log('Connected.');

    const emailReplacements = {
      patientName: 'Test Patient (Antigravity Automation Check)',
      serviceName: 'ICU Setup at Home - Complete Home ICU Setup',
      date: new Date().toLocaleDateString(),
      time: 'Immediate (Test)',
      mobile: '+91 99999 99999',
      email: 'test-patient@nestcares.in',
      address: 'Chandra Shekar Colony, Nizamabad, Telangana - 503002',
      notes: 'This is an automated system validation test check for email delivery.'
    };

    console.log('Sending test patient confirmation email...');
    const result1 = await sendEmail({
      to: 'nestcares.in@gmail.com', // Send to self/sender to verify receipt
      subject: 'Nest Cares Automation Test - Patient Confirmation',
      templateName: 'patientConfirmation',
      replacements: emailReplacements
    });

    console.log('Sending test admin notification email...');
    const result2 = await sendEmail({
      to: 'nestcares.in@gmail.com',
      subject: 'Nest Cares Automation Test - Admin Notification',
      templateName: 'adminNotification',
      replacements: emailReplacements
    });

    if (result1 && result2) {
      console.log('🎉 Automation Check PASSED: Both test emails sent successfully!');
    } else {
      console.warn('⚠️ SMTP send completed, but returned false (check console logs).');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Automation Check FAILED:', error.message);
    process.exit(1);
  }
};

runTest();
