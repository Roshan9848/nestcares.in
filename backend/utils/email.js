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

    // Resolve credentials (DB values take precedence if valid and not dummy, fallback to .env)
    const rawHost = emailConfig?.smtpHost;
    const smtpHost = (rawHost && rawHost !== 'smtp.mailtrap.io') ? rawHost : (process.env.SMTP_HOST || 'smtp.gmail.com');
    
    const rawPort = emailConfig?.smtpPort;
    const smtpPort = (rawPort && parseInt(rawPort) !== 2525) ? parseInt(rawPort) : (parseInt(process.env.SMTP_PORT) || 587);
    
    const smtpUser = (emailConfig?.smtpUser && emailConfig.smtpUser.trim() !== '') ? emailConfig.smtpUser : (process.env.SMTP_USER || 'nestcares.in@gmail.com');
    const smtpPass = (emailConfig?.smtpPass && emailConfig.smtpPass.trim() !== '') ? emailConfig.smtpPass : (process.env.SMTP_PASS || 'zunfiznbypyqxblg');
    
    const rawBusEmail = emailConfig?.businessEmail;
    const businessEmail = (rawBusEmail && rawBusEmail !== 'bookings@carehome.com') ? rawBusEmail : (process.env.BUSINESS_EMAIL || 'nestcares.in@gmail.com');
    
    const rawSender = emailConfig?.senderName;
    const senderName = (rawSender && rawSender !== 'CareHome Services Support') ? rawSender : (process.env.SENDER_NAME || 'Nest Cares Support');

    const templates = emailConfig?.templates || {};

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

    // Create transporter dynamically (auto-detect Gmail for direct SSL port 465)
    const isGmail = (smtpHost && smtpHost.includes('gmail.com')) || (smtpUser && smtpUser.includes('gmail.com'));
    const transporterConfig = isGmail ? {
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    } : {
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    };

    const transporter = nodemailer.createTransport(transporterConfig);

    // Generate premium HTML templates dynamically based on template name
    let htmlContent = '';
    let logoUrl = 'https://nestcares.in/logo.png';
    const companyName = 'Nest Cares';
    
    try {
      const webConfigDoc = await dbHelper.findOne(Settings, { key: 'web' });
      if (webConfigDoc && webConfigDoc.value?.logoUrl) {
        const logoPath = webConfigDoc.value.logoUrl;
        if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
          logoUrl = logoPath;
        } else if (logoPath === '/logo.png') {
          logoUrl = 'https://nestcares.in/logo.png';
        } else {
          const backendHost = process.env.BACKEND_URL || 'https://nestcares-in.onrender.com';
          logoUrl = `${backendHost}${logoPath.startsWith('/') ? '' : '/'}${logoPath}`;
        }
      }
    } catch (logoErr) {
      console.error('Failed to resolve dynamic logo URL for email:', logoErr.message);
    }
    
    if (templateName === 'patientConfirmation') {
      htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); }
    .header { background-color: #0f766e; padding: 35px 20px; text-align: center; color: #ffffff; }
    .logo { height: 44px; width: auto; display: block; margin: 0 auto 12px; }
    .title { font-size: 22px; font-weight: 700; margin: 0; letter-spacing: -0.02em; color: #ffffff; }
    .content { padding: 30px 24px; line-height: 1.6; }
    .lead { font-size: 15px; font-weight: 650; margin-bottom: 16px; color: #1e293b; }
    .table-container { margin: 24px 0; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
    .details-table { width: 100%; border-collapse: collapse; text-align: left; }
    .details-table th, .details-table td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .details-table th { background-color: #f8fafc; color: #475569; width: 35%; font-weight: 700; }
    .details-table td { color: #334155; font-weight: 500; }
    .details-table tr:last-child th, .details-table tr:last-child td { border-bottom: none; }
    .btn-container { text-align: center; margin: 28px 0 10px; }
    .btn { display: inline-block; padding: 12px 28px; background-color: #0f766e; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; }
    .footer { background-color: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .footer a { color: #0f766e; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${logoUrl}" alt="${companyName} Logo" class="logo" />
      <h1 class="title">Booking Request Received</h1>
    </div>
    <div class="content">
      <p class="lead">Dear ${replacements.patientName || 'Customer'},</p>
      <p>Thank you for choosing <strong>Nest Cares Home Healthcare Services</strong>. We have received your request for home care coordination. Our medical coordinator will contact you shortly to finalize your schedule details.</p>
      
      <div class="table-container">
        <table class="details-table">
          <tr>
            <th>Patient Name</th>
            <td>${replacements.patientName}</td>
          </tr>
          <tr>
            <th>Requested Service</th>
            <td>${replacements.serviceName}</td>
          </tr>
          <tr>
            <th>Preferred Date</th>
            <td>${replacements.date}</td>
          </tr>
          <tr>
            <th>Preferred Time</th>
            <td>${replacements.time}</td>
          </tr>
          <tr>
            <th>Mobile Number</th>
            <td>${replacements.mobile}</td>
          </tr>
          <tr>
            <th>Clinical Notes</th>
            <td>${replacements.notes || 'None'}</td>
          </tr>
          <tr>
            <th>Bedside Address</th>
            <td>${replacements.address}</td>
          </tr>
        </table>
      </div>

      <div class="btn-container">
        <a href="https://nestcares.in/services" target="_blank" class="btn">View Services Catalog</a>
      </div>
    </div>
    <div class="footer">
      <p>Need urgent assistance? Call our coordination desk at <strong>+91 92488 49388</strong></p>
      <p>&copy; 2026 ${companyName} Home Healthcare Services. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `;
    } else if (templateName === 'adminNotification') {
      htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking Notification</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); }
    .header { background-color: #0f172a; padding: 35px 20px; text-align: center; color: #ffffff; }
    .logo { height: 44px; width: auto; display: block; margin: 0 auto 12px; }
    .title { font-size: 22px; font-weight: 700; margin: 0; letter-spacing: -0.02em; color: #ffffff; }
    .content { padding: 30px 24px; line-height: 1.6; }
    .lead { font-size: 15px; font-weight: 650; margin-bottom: 16px; color: #1e293b; }
    .table-container { margin: 24px 0; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
    .details-table { width: 100%; border-collapse: collapse; text-align: left; }
    .details-table th, .details-table td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .details-table th { background-color: #f8fafc; color: #475569; width: 35%; font-weight: 700; }
    .details-table td { color: #334155; font-weight: 500; }
    .details-table tr:last-child th, .details-table tr:last-child td { border-bottom: none; }
    .btn-container { text-align: center; margin: 28px 0 10px; }
    .btn { display: inline-block; padding: 12px 28px; background-color: #0f172a; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; }
    .footer { background-color: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${logoUrl}" alt="${companyName} Logo" class="logo" />
      <h1 class="title">New Booking Request Received</h1>
    </div>
    <div class="content">
      <p class="lead">Hello Admin,</p>
      <p>A new booking request has been submitted through the portal. Below are the details to coordinate:</p>
      
      <div class="table-container">
        <table class="details-table">
          <tr>
            <th>Patient Name</th>
            <td>${replacements.patientName}</td>
          </tr>
          <tr>
            <th>Requested Service</th>
            <td>${replacements.serviceName}</td>
          </tr>
          <tr>
            <th>Preferred Date</th>
            <td>${replacements.date}</td>
          </tr>
          <tr>
            <th>Preferred Time</th>
            <td>${replacements.time}</td>
          </tr>
          <tr>
            <th>Mobile Number</th>
            <td>${replacements.mobile}</td>
          </tr>
          <tr>
            <th>Email Address</th>
            <td>${replacements.email || 'None'}</td>
          </tr>
          <tr>
            <th>Clinical Notes</th>
            <td>${replacements.notes || 'None'}</td>
          </tr>
          <tr>
            <th>Bedside Address</th>
            <td>${replacements.address}</td>
          </tr>
        </table>
      </div>

      <div class="btn-container">
        <a href="https://nestcares.in/login" target="_blank" class="btn">Open Admin Dashboard</a>
      </div>
    </div>
    <div class="footer">
      <p>&copy; 2026 ${companyName} Home Healthcare Services. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `;
    }

    // Resolve target recipient (if dummy target is passed, send to business email)
    const targetRecipient = (!to || to === 'admin@carehome.com' || to === 'admin@nestcares.in') ? businessEmail : to;

    // Send mail
    const mailOptions = {
      from: `"${senderName || 'Nest Cares'}" <${businessEmail || smtpUser}>`,
      to: targetRecipient,
      subject,
      text: body,
      html: htmlContent || undefined
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
