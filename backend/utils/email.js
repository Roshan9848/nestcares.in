const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const Settings = require('../models/Settings');
const dbHelper = require('./dbHelper');

const logEmailLocal = (to, subject, body) => {
  const logDir = path.join(__dirname, '../data');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  const logPath = path.join(logDir, 'emails.log');
  const logEntry = `[${new Date().toISOString()}]\nTO: ${to}\nSUBJECT: ${subject}\nBODY:\n${body}\n-----------------------------------------\n\n`;
  
  fs.appendFileSync(logPath, logEntry, 'utf8');
  console.log(`✉️ Email Mock Sent (Logged to backend/data/emails.log):\nTo: ${to}\nSubject: ${subject}`);
};

const sendEmail = async ({ to, subject, templateName, replacements }) => {
  try {
    // Fetch latest email settings from database
    const emailConfigDoc = await dbHelper.findOne(Settings, { key: 'email' });
    const emailConfig = emailConfigDoc ? emailConfigDoc.value : null;

    if (!emailConfig) {
      console.warn('⚠️ No email configuration found in DB. Simulating email...');
      logEmailLocal(to, subject, `[Simulated] ${templateName}\nReplacements: ${JSON.stringify(replacements)}`);
      return true;
    }

    const { smtpHost, smtpPort, smtpUser, smtpPass, businessEmail, senderName, templates } = emailConfig;

    // Pick and interpolate template
    let templateText = templates ? templates[templateName] : '';
    if (!templateText) {
      templateText = `Service update. Details: ${JSON.stringify(replacements)}`;
    }

    // Replace double curly braces tags (e.g. {{patientName}})
    let body = templateText;
    for (const key in replacements) {
      const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      body = body.replace(placeholder, replacements[key]);
    }

    // Check if SMTP is configured. If not, log to file and console.
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log('ℹ️ SMTP host or credentials not set. Logging email locally...');
      logEmailLocal(to, subject, body);
      return true;
    }

    // Create transporter dynamically
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort) || 5858,
      secure: parseInt(smtpPort) === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Send mail
    const mailOptions = {
      from: `"${senderName || 'CareHome'}" <${businessEmail || smtpUser}>`,
      to,
      subject,
      text: body,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to} (Subject: "${subject}")`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email via SMTP, falling back to local logs. Error:', error.message);
    // Fallback to local logs on connection failure so backend doesn't crash
    try {
      let bodyText = `[Fallback Log - Error sending SMTP] Replacements: ${JSON.stringify(replacements)}`;
      logEmailLocal(to, subject, bodyText);
    } catch (e) {
      console.error('Failed logging fallback email:', e.message);
    }
    return false;
  }
};

module.exports = { sendEmail };
