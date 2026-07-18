const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const dbHelper = require('../utils/dbHelper');
const { protect } = require('../middleware/auth');

// @desc    Get all public settings (homepage, contact, web)
// @route   GET /api/settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const list = await dbHelper.find(Settings, {});
    const mapped = {};
    
    list.forEach(item => {
      // Exclude SMTP password in the public bulk settings pull
      if (item.key === 'email') {
        const emailVal = { ...item.value };
        if (emailVal.smtpPass) emailVal.smtpPass = '********'; // Hide password
        mapped[item.key] = emailVal;
      } else if (item.key === 'cloudinary') {
        // Obfuscate apiSecret
        const cloudVal = { ...item.value };
        if (cloudVal.apiSecret) cloudVal.apiSecret = '********';
        mapped[item.key] = cloudVal;
      } else {
        mapped[item.key] = item.value;
      }
    });

    res.json({ success: true, data: mapped });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get settings by key
// @route   GET /api/settings/:key
// @access  Public (sensitive keys require admin protect checked in code)
router.get('/:key', async (req, res) => {
  const { key } = req.params;

  try {
    const item = await dbHelper.findOne(Settings, { key });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Settings category not found' });
    }

    // SMTP and Cloudinary settings key must be protected
    if (key === 'email' || key === 'cloudinary') {
      return res.status(401).json({ success: false, message: 'Unauthorized access to configuration. Use admin auth.' });
    }

    res.json({ success: true, data: item.value });
  } catch (error) {
    console.error(`Error fetching settings for ${key}:`, error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get email configurations (with password) for Admin Dashboard
// @route   GET /api/settings/admin/email-config
// @access  Private/Admin
router.get('/admin/email-config', protect, async (req, res) => {
  try {
    const item = await dbHelper.findOne(Settings, { key: 'email' });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Email settings not found' });
    }
    res.json({ success: true, data: item.value });
  } catch (error) {
    console.error('Error fetching admin email configs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get Cloudinary configurations (with secret keys) for Admin Dashboard
// @route   GET /api/settings/admin/cloudinary-config
// @access  Private/Admin
router.get('/admin/cloudinary-config', protect, async (req, res) => {
  try {
    const item = await dbHelper.findOne(Settings, { key: 'cloudinary' });
    if (!item) {
      return res.json({ success: true, data: { cloudName: '', apiKey: '', apiSecret: '' } });
    }
    res.json({ success: true, data: item.value });
  } catch (error) {
    console.error('Error fetching admin cloudinary configs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update settings key (homepage, contact, web, email)
// @route   PUT /api/settings/:key
// @access  Private/Admin
router.put('/:key', protect, async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  try {
    if (!value) {
      return res.status(400).json({ success: false, message: 'Updated value object is required' });
    }

    const updated = await dbHelper.findOneAndUpdate(
      Settings,
      { key },
      { value },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: `Settings for "${key}" updated successfully`, data: updated.value });
  } catch (error) {
    console.error(`Error updating settings for ${key}:`, error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
