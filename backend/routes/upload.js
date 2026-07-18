const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary if environment variables are provided
let isCloudinaryConfigured = false;
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  isCloudinaryConfigured = true;
  console.log('✅ Cloudinary Image Storage system configured.');
} else {
  console.log('ℹ️ Cloudinary credentials not detected. Falling back to local static disk storage.');
}

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private/Admin (protected to avoid storage spam)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file.' });
    }

    const localFilePath = req.file.path;

    // 1. Fetch dynamic Cloudinary settings from database
    let cloudConfig = null;
    try {
      const Settings = require('../models/Settings');
      const cloudDoc = await dbHelper.findOne(Settings, { key: 'cloudinary' });
      if (cloudDoc && cloudDoc.value?.cloudName && cloudDoc.value?.apiKey && cloudDoc.value?.apiSecret) {
        cloudConfig = cloudDoc.value;
      }
    } catch (dbErr) {
      console.warn('Could not read dynamic Cloudinary settings, using env:', dbErr.message);
    }

    // 2. Resolve credentials (DB values take precedence, fallback to env)
    const cloudName = cloudConfig?.cloudName || process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = cloudConfig?.apiKey || process.env.CLOUDINARY_API_KEY;
    const apiSecret = cloudConfig?.apiSecret || process.env.CLOUDINARY_API_SECRET;

    const useCloudinary = !!(cloudName && apiKey && apiSecret);

    if (useCloudinary) {
      // Re-configure Cloudinary dynamically on-demand
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
      });

      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(localFilePath, {
        folder: 'home-healthcare',
        use_filename: true,
        unique_filename: true
      });

      // Remove file from local temp storage
      fs.unlinkSync(localFilePath);

      // Return Cloudinary URL and publicId
      return res.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        message: 'Image uploaded successfully to Cloudinary.'
      });
    } else {
      // Local URL (assumes server is hosting the /uploads directory statically)
      const relativeUrl = `/uploads/${req.file.filename}`;
      return res.json({
        success: true,
        url: relativeUrl,
        publicId: req.file.filename,
        message: 'Image uploaded successfully to local storage.'
      });
    }
  } catch (error) {
    console.error('File upload controller error:', error);
    res.status(500).json({ success: false, message: error.message || 'Image upload failed.' });
  }
});

// @desc    Delete an image
// @route   DELETE /api/upload/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  const fileId = req.params.id;

  try {
    // 1. Fetch dynamic Cloudinary settings from database
    let cloudConfig = null;
    try {
      const Settings = require('../models/Settings');
      const cloudDoc = await dbHelper.findOne(Settings, { key: 'cloudinary' });
      if (cloudDoc && cloudDoc.value?.cloudName && cloudDoc.value?.apiKey && cloudDoc.value?.apiSecret) {
        cloudConfig = cloudDoc.value;
      }
    } catch (dbErr) {
      console.warn('Could not read dynamic Cloudinary settings, using env:', dbErr.message);
    }

    // 2. Resolve credentials (DB values take precedence, fallback to env)
    const cloudName = cloudConfig?.cloudName || process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = cloudConfig?.apiKey || process.env.CLOUDINARY_API_KEY;
    const apiSecret = cloudConfig?.apiSecret || process.env.CLOUDINARY_API_SECRET;

    const useCloudinary = !!(cloudName && apiKey && apiSecret);

    if (useCloudinary) {
      // Re-configure Cloudinary dynamically on-demand
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
      });

      // Delete from Cloudinary
      const result = await cloudinary.uploader.destroy(fileId);
      if (result.result === 'ok' || result.result === 'not_found') {
        return res.json({ success: true, message: 'Image deleted from Cloudinary' });
      }
      throw new Error(`Cloudinary delete response: ${result.result}`);
    } else {
      // Delete from local disk
      const localFilePath = path.join(__dirname, '../uploads', fileId);
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        return res.json({ success: true, message: 'Image deleted from local storage' });
      }
      return res.json({ success: true, message: 'Image file not found locally, cleared record' });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete image.' });
  }
});

module.exports = router;
