const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const dbHelper = require('../utils/dbHelper');
const { protect } = require('../middleware/auth');

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user (with DB fallback compatibility)
    const user = await dbHelper.findOne(User, { email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare passwords
    let isMatch = false;
    if (global.dbConnected) {
      // If mongoose model is active, it has matchPassword
      const userModelInstance = await User.findOne({ email });
      isMatch = await userModelInstance.matchPassword(password);
    } else {
      // In local JSON db, password is already hashed
      isMatch = bcrypt.compareSync(password, user.password);
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'homehealthcare_secret_key_2026',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Send Doctor Password Reset OTP to Admin
// @route   POST /api/auth/doctor-otp
// @access  Public
router.post('/doctor-otp', async (req, res) => {
  const { doctorId, doctorName, otpCode } = req.body;
  try {
    const Settings = require('../models/Settings');
    const emailConfigDoc = await dbHelper.findOne(Settings, { key: 'email' });
    const adminEmail = emailConfigDoc?.value?.businessEmail || 'nestcares.in@gmail.com';
    
    const { sendEmail } = require('../utils/email');
    await sendEmail({
      to: adminEmail,
      subject: `⚠️ Nest Cares - Password Change OTP for ${doctorName}`,
      templateName: 'adminNotification',
      replacements: {
        patientName: doctorName,
        mobile: doctorId,
        email: 'Nest Cares Clinician Security System',
        serviceName: 'Clinician Password Verification',
        date: new Date().toLocaleDateString('en-IN'),
        time: new Date().toLocaleTimeString('en-IN'),
        address: 'Secure Access Authentication Port',
        notes: `A request to update login credentials for doctor ${doctorName} (ID: ${doctorId}) was initialized. The verification OTP code is:\n\n👉  ${otpCode}  👈\n\nShare this code with the doctor only if they requested this change.`
      }
    });
    
    res.json({ success: true, message: 'Verification OTP sent to administrator.' });
  } catch (error) {
    console.error('Error sending doctor OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP.' });
  }
});

// @desc    Verify current token & get user details
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;
