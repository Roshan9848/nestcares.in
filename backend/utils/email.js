const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const Settings = require('../models/Settings');
const dbHelper = require('./dbHelper');

const logEmailLocal = (to, subject, body) => {
  const logDir = path.join(__dirname, '../data');
  if (!process.env.VERCEL && !fs.existsSync(logDir)) {
    try {
      fs.mkdirSync(logDir, { recursive: true });
    } catch (e) {}
  }
  
  if (!process.env.VERCEL) {
    const logPath = path.join(logDir, 'emails.log');
    const logEntry = `[${new Date().toISOString()}]\nTO: ${to}\nSUBJECT: ${subject}\nBODY:\n${body}\n-----------------------------------------\n\n`;
    try {
      fs.appendFileSync(logPath, logEntry, 'utf8');
    } catch (e) {}
  }
  console.log(`✉️ Email Mock Sent (Logged to console):\nTo: ${to}\nSubject: ${subject}`);
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
    let smtpPort = (rawPort && parseInt(rawPort) !== 2525) ? parseInt(rawPort) : (parseInt(process.env.SMTP_PORT) || 465);
    if (smtpHost && smtpHost.includes('gmail.com')) {
      smtpPort = 465;
    }
    
    const rawUser = (emailConfig?.smtpUser && emailConfig.smtpUser.trim() !== '') ? emailConfig.smtpUser : (process.env.SMTP_USER || '');
    const smtpUser = rawUser.trim();
    
    const rawPass = (emailConfig?.smtpPass && emailConfig.smtpPass.trim() !== '') ? emailConfig.smtpPass : (process.env.SMTP_PASS || '');
    const smtpPass = rawPass.trim().replace(/\s+/g, '');
    
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
      const waText = encodeURIComponent(`Hi Nest Cares, I have a query regarding my booking ${replacements.bookingId || ''} (${replacements.serviceName || ''}).`);
      const waLink = `https://wa.me/919248849388?text=${waText}`;

      htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - Nest Cares</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 24px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05); }
    .header { background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%); padding: 36px 24px; text-align: center; color: #ffffff; }
    .logo { height: 44px; width: auto; display: block; margin: 0 auto 12px; }
    .badge { display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #ffffff; margin-bottom: 8px; }
    .title { font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.02em; color: #ffffff; }
    .content { padding: 32px 24px; line-height: 1.6; }
    .lead { font-size: 16px; font-weight: 700; margin-bottom: 12px; color: #0f172a; }
    .booking-id-box { background: #f0fdfa; border: 1.5px solid #ccfbf1; border-radius: 12px; padding: 14px 18px; margin: 20px 0; display: flex; justify-content: space-between; align-items: center; }
    .booking-id-label { font-size: 11px; font-weight: 700; color: #0f766e; text-transform: uppercase; }
    .booking-id-val { font-size: 18px; font-weight: 900; color: #0f766e; font-family: monospace; }
    .table-container { margin: 20px 0; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
    .details-table { width: 100%; border-collapse: collapse; text-align: left; }
    .details-table th, .details-table td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    .details-table th { background-color: #f8fafc; color: #475569; width: 35%; font-weight: 700; }
    .details-table td { color: #1e293b; font-weight: 600; }
    .details-table tr:last-child th, .details-table tr:last-child td { border-bottom: none; }
    .buttons-container { text-align: center; margin: 28px 0 12px; display: flex; gap: 10px; justify-content: center; }
    .btn-primary { display: inline-block; padding: 12px 24px; background-color: #0f766e; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 13px; }
    .btn-whatsapp { display: inline-block; padding: 12px 24px; background-color: #10b981; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 13px; }
    .info-card { background: #f8fafc; border-left: 4px solid #0f766e; padding: 12px 16px; border-radius: 8px; font-size: 12px; color: #475569; margin: 20px 0; }
    .footer { background-color: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .footer a { color: #0f766e; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${logoUrl}" alt="${companyName} Logo" class="logo" />
      <div class="badge">Appointment Received</div>
      <h1 class="title">Booking Confirmation</h1>
    </div>
    <div class="content">
      <p class="lead">Dear ${replacements.patientName || 'Valued Patient'},</p>
      <p>Thank you for choosing <strong>Nest Cares Home Healthcare Services</strong>. We have received your booking request. Our on-duty clinical coordinator in Nizamabad will call you within <strong>15 minutes</strong> to confirm staff dispatch and logistics.</p>
      
      <div class="booking-id-box">
        <div>
          <div class="booking-id-label">Booking Reference ID</div>
          <div class="booking-id-val">${replacements.bookingId || 'NEST-PENDING'}</div>
        </div>
        <div style="text-align: right;">
          <span style="background: #e6fffa; color: #047857; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; border: 1px solid #a7f3d0;">RECEIVED</span>
        </div>
      </div>

      <div class="table-container">
        <table class="details-table">
          <tr>
            <th>Patient Name</th>
            <td>${replacements.patientName}</td>
          </tr>
          <tr>
            <th>Healthcare Service</th>
            <td>${replacements.serviceName}</td>
          </tr>
          <tr>
            <th>Preferred Date</th>
            <td>${replacements.date}</td>
          </tr>
          <tr>
            <th>Time Slot</th>
            <td>${replacements.time}</td>
          </tr>
          <tr>
            <th>Contact Number</th>
            <td>${replacements.mobile}</td>
          </tr>
          <tr>
            <th>Bedside Address</th>
            <td>${replacements.address}</td>
          </tr>
          <tr>
            <th>Clinical Notes</th>
            <td>${replacements.notes || 'None'}</td>
          </tr>
        </table>
      </div>

      <div class="info-card">
        🛡️ <strong>Zero Advance Payment:</strong> No payment is required prior to home setup. Payment is collected only after clinical service delivery is completed.
      </div>

      <div class="buttons-container">
        <a href="${waLink}" target="_blank" class="btn-whatsapp">💬 Chat on WhatsApp</a>
        <a href="https://nestcares.in/services" target="_blank" class="btn-primary">Browse Services</a>
      </div>
    </div>
    <div class="footer">
      <p>24/7 Standby Coordination Helpline: <strong>+91 92488 49388</strong></p>
      <p>&copy; 2026 ${companyName} Home Healthcare Services • Chandra Shekar Colony, Nizamabad, Telangana.</p>
    </div>
  </div>
</body>
</html>
      `;
    } else if (templateName === 'patientStatusUpdate') {
      const isApproved = (replacements.status || '').toLowerCase().includes('approve');
      const statusBg = isApproved ? '#047857' : '#0284c7';
      const statusTitle = isApproved ? 'Booking Confirmed & Approved' : `Booking Status: ${replacements.status}`;

      htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${statusTitle} - Nest Cares</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 24px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05); }
    .header { background: ${statusBg}; padding: 36px 24px; text-align: center; color: #ffffff; }
    .logo { height: 44px; width: auto; display: block; margin: 0 auto 12px; }
    .title { font-size: 22px; font-weight: 800; margin: 0; color: #ffffff; }
    .content { padding: 32px 24px; line-height: 1.6; }
    .lead { font-size: 16px; font-weight: 700; margin-bottom: 12px; color: #0f172a; }
    .table-container { margin: 20px 0; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
    .details-table { width: 100%; border-collapse: collapse; text-align: left; }
    .details-table th, .details-table td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    .details-table th { background-color: #f8fafc; color: #475569; width: 35%; font-weight: 700; }
    .details-table td { color: #1e293b; font-weight: 600; }
    .footer { background-color: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${logoUrl}" alt="${companyName} Logo" class="logo" />
      <h1 class="title">${statusTitle}</h1>
    </div>
    <div class="content">
      <p class="lead">Dear ${replacements.patientName || 'Valued Patient'},</p>
      <p>Your booking request <strong>${replacements.bookingId}</strong> has been updated to: <strong style="color: ${statusBg};">${replacements.status}</strong>.</p>
      
      <div class="table-container">
        <table class="details-table">
          <tr>
            <th>Booking Reference</th>
            <td><strong>${replacements.bookingId}</strong></td>
          </tr>
          <tr>
            <th>Service</th>
            <td>${replacements.serviceName}</td>
          </tr>
          <tr>
            <th>Date & Time</th>
            <td>${replacements.date} (${replacements.time})</td>
          </tr>
          <tr>
            <th>Location</th>
            <td>${replacements.address}</td>
          </tr>
          <tr>
            <th>Current Status</th>
            <td><strong style="color: ${statusBg};">${replacements.status}</strong></td>
          </tr>
        </table>
      </div>

      <p style="font-size: 13px; color: #64748b;">Our medical staff will arrive at your home location at the designated time. For any adjustments, call our helpline at <strong>+91 92488 49388</strong>.</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 ${companyName} Home Healthcare Services • Nizamabad, Telangana.</p>
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
    .container { max-width: 600px; margin: 24px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05); }
    .header { background-color: #0f172a; padding: 36px 24px; text-align: center; color: #ffffff; }
    .logo { height: 44px; width: auto; display: block; margin: 0 auto 12px; }
    .badge { display: inline-block; background: rgba(255, 255, 255, 0.15); padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #38bdf8; margin-bottom: 8px; }
    .title { font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.02em; color: #ffffff; }
    .content { padding: 32px 24px; line-height: 1.6; }
    .lead { font-size: 16px; font-weight: 700; margin-bottom: 12px; color: #0f172a; }
    .table-container { margin: 20px 0; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
    .details-table { width: 100%; border-collapse: collapse; text-align: left; }
    .details-table th, .details-table td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    .details-table th { background-color: #f8fafc; color: #475569; width: 35%; font-weight: 700; }
    .details-table td { color: #1e293b; font-weight: 600; }
    .details-table tr:last-child th, .details-table tr:last-child td { border-bottom: none; }
    .btn-container { text-align: center; margin: 28px 0 10px; }
    .btn { display: inline-block; padding: 12px 28px; background-color: #0f172a; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 13px; }
    .footer { background-color: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${logoUrl}" alt="${companyName} Logo" class="logo" />
      <div class="badge">Immediate Triage Action</div>
      <h1 class="title">New Booking: ${replacements.bookingId || 'New'}</h1>
    </div>
    <div class="content">
      <p class="lead">Hello Admin,</p>
      <p>A new home healthcare booking request has been submitted through the portal. Please review and assign clinical personnel:</p>
      
      <div class="table-container">
        <table class="details-table">
          <tr>
            <th>Booking Reference</th>
            <td><strong style="color: #0f766e;">${replacements.bookingId || 'New'}</strong></td>
          </tr>
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
            <td><a href="tel:${replacements.mobile}" style="color: #0f766e; text-decoration: none; font-weight: 700;">${replacements.mobile}</a></td>
          </tr>
          <tr>
            <th>Email Address</th>
            <td>${replacements.email || 'None'}</td>
          </tr>
          <tr>
            <th>Bedside Address</th>
            <td>${replacements.address}</td>
          </tr>
          <tr>
            <th>Clinical Notes</th>
            <td>${replacements.notes || 'None'}</td>
          </tr>
        </table>
      </div>

      <div class="btn-container">
        <a href="https://nestcares.in/login" target="_blank" class="btn">Open Admin Dashboard</a>
      </div>
    </div>
    <div class="footer">
      <p>&copy; 2026 ${companyName} Home Healthcare Services • Admin Notification Center.</p>
    </div>
  </div>
</body>
</html>
      `;
    } else if (templateName === 'doctorOtp') {
      htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Doctor Password Verification OTP</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0; }
    .container { max-width: 550px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); }
    .header { background-color: #0f766e; padding: 30px 20px; text-align: center; color: #ffffff; }
    .logo { height: 42px; width: auto; display: block; margin: 0 auto 10px; }
    .title { font-size: 20px; font-weight: 700; margin: 0; color: #ffffff; }
    .content { padding: 30px 24px; line-height: 1.6; text-align: center; }
    .otp-box { margin: 24px auto; background: #f0fdfa; border: 2px dashed #0f766e; border-radius: 12px; padding: 18px 24px; display: inline-block; }
    .otp-code { font-family: 'Courier New', monospace; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0f766e; margin: 0; }
    .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${logoUrl}" alt="${companyName} Logo" class="logo" />
      <h1 class="title">Doctor Portal Security Verification</h1>
    </div>
    <div class="content">
      <p style="font-size: 15px; font-weight: 600; color: #1e293b; margin-bottom: 8px;">Doctor Password Change Request</p>
      <p style="font-size: 13px; color: #475569;">A request was made to update the password for doctor profile: <strong>${replacements.doctorName}</strong> (ID: ${replacements.doctorId}).</p>
      
      <div class="otp-box">
        <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #0f766e; margin: 0 0 6px;">One-Time Security Code (OTP)</p>
        <p class="otp-code">${replacements.otpCode}</p>
      </div>

      <p style="font-size: 12px; color: #64748b;">This verification code was generated at ${replacements.time}. If you did not initiate this request, please review the doctor accounts in your admin dashboard immediately.</p>
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
