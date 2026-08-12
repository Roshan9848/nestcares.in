const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const dbHelper = require('../utils/dbHelper');
const { protect } = require('../middleware/auth');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
router.get('/', async (req, res) => {
  try {
    let query = {};
    // If not admin request, show only active doctors by default unless requested with all=true
    if (req.query.activeOnly === 'true') {
      query.isActive = true;
    }

    const doctors = await dbHelper.find(Doctor, query);
    
    // Sort by displayOrder ascending
    doctors.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    res.json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    console.error('Fetch doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve doctors list'
    });
  }
});

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const doctor = await dbHelper.findById(Doctor, req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve doctor details'
    });
  }
});

// @desc    Create new doctor
// @route   POST /api/doctors
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  try {
    const { 
      name, specialty, qualifications, experience, 
      regNumber, image, phone, email, bio, 
      availability, displayOrder, isActive 
    } = req.body;

    if (!name || !specialty) {
      return res.status(400).json({
        success: false,
        message: 'Doctor name and specialty are required'
      });
    }

    const newDoctor = await dbHelper.create(Doctor, {
      name: name.trim(),
      specialty: specialty.trim(),
      qualifications: qualifications ? qualifications.trim() : 'MBBS',
      experience: experience ? experience.trim() : '5+ Years',
      regNumber: regNumber ? regNumber.trim() : '',
      image: image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      phone: phone ? phone.trim() : '',
      email: email ? email.trim() : '',
      bio: bio ? bio.trim() : '',
      availability: availability ? availability.trim() : 'Available for Home Visits',
      displayOrder: Number(displayOrder) || 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Doctor profile registered successfully',
      data: newDoctor
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create doctor profile'
    });
  }
});

// @desc    Update doctor profile and images
// @route   PUT /api/doctors/:id
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  try {
    const doctor = await dbHelper.findById(Doctor, req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const updateData = { ...req.body };
    delete updateData._id;

    const updatedDoctor = await dbHelper.findByIdAndUpdate(Doctor, req.params.id, updateData);

    res.json({
      success: true,
      message: 'Doctor profile and image updated successfully',
      data: updatedDoctor
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor profile'
    });
  }
});

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const doctor = await dbHelper.findById(Doctor, req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    await dbHelper.findByIdAndDelete(Doctor, req.params.id);

    res.json({
      success: true,
      message: 'Doctor profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete doctor profile'
    });
  }
});

module.exports = router;
