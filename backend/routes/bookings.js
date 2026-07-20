const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const dbHelper = require('../utils/dbHelper');
const { protect } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

// @desc    Create a new booking appointment
// @route   POST /api/bookings
// @access  Public
router.post('/', async (req, res) => {
  const { name, mobile, email, address, serviceName, subServiceName, preferredDate, preferredTime, notes } = req.body;

  try {
    if (!name || !mobile || !address || !serviceName || !subServiceName || !preferredDate || !preferredTime) {
      return res.status(400).json({ success: false, message: 'Please enter all required fields' });
    }

    // Generate sequential booking ID starting with NEST-100
    const allBookings = await dbHelper.find(Booking, {});
    let nextId = 100;
    
    if (allBookings && allBookings.length > 0) {
      const bookingNumbers = allBookings
        .map(b => {
          if (b.bookingId && b.bookingId.startsWith('NEST-')) {
            const num = parseInt(b.bookingId.replace('NEST-', ''), 10);
            return isNaN(num) ? null : num;
          }
          return null;
        })
        .filter(n => n !== null);
      if (bookingNumbers.length > 0) {
        nextId = Math.max(...bookingNumbers) + 1;
      }
    }
    const bookingId = `NEST-${nextId}`;

    const booking = await dbHelper.create(Booking, {
      name,
      mobile,
      email: email || '',
      address,
      serviceName,
      subServiceName,
      preferredDate,
      preferredTime,
      bookingId,
      notes: notes || '',
      status: 'pending'
    });

    // Send emails (blocking or settled to guarantee execution before response)
    const emailReplacements = {
      patientName: name,
      serviceName: `${serviceName} - ${subServiceName}`,
      date: preferredDate,
      time: preferredTime,
      mobile,
      email: email || 'None',
      address,
      notes: notes || 'None'
    };

    const emailPromises = [];

    // 1. Send confirmation to Patient (if provided)
    if (email && email.trim() !== '') {
      emailPromises.push(
        sendEmail({
          to: email,
          subject: `Booking Confirmed - ${serviceName} (${subServiceName})`,
          templateName: 'patientConfirmation',
          replacements: emailReplacements
        })
      );
    }

    // 2. Send notification to Admin
    emailPromises.push(
      sendEmail({
        to: 'nestcares.in@gmail.com',
        subject: `New Booking Request: ${serviceName} (${subServiceName}) - ${name}`,
        templateName: 'adminNotification',
        replacements: emailReplacements
      })
    );

    await Promise.allSettled(emailPromises);

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully! Confirmation email sent.',
      data: booking
    });
  } catch (error) {
    console.error('Error submitting booking:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get all bookings with search, filter, and sorting
// @route   GET /api/bookings
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  try {
    const { search, service, status, dateStart, dateEnd } = req.query;
    
    // Fetch all bookings (compatibility wrapper for sorting and filtering)
    const allBookings = await dbHelper.find(Booking, {}, { createdAt: -1 });
    
    let filteredBookings = allBookings;

    // Filter by search query (name, mobile, email, address, or serviceName)
    if (search) {
      const q = search.toLowerCase();
      filteredBookings = filteredBookings.filter(b => 
        (b.name && b.name.toLowerCase().includes(q)) ||
        (b.mobile && b.mobile.includes(q)) ||
        (b.email && b.email.toLowerCase().includes(q)) ||
        (b.address && b.address.toLowerCase().includes(q)) ||
        (b.serviceName && b.serviceName.toLowerCase().includes(q)) ||
        (b.subServiceName && b.subServiceName.toLowerCase().includes(q))
      );
    }

    // Filter by service
    if (service && service !== 'all') {
      filteredBookings = filteredBookings.filter(b => b.serviceName === service);
    }

    // Filter by status
    if (status && status !== 'all') {
      filteredBookings = filteredBookings.filter(b => b.status === status);
    }

    // Filter by date range (preferredDate or createdAt)
    if (dateStart) {
      filteredBookings = filteredBookings.filter(b => new Date(b.preferredDate) >= new Date(dateStart));
    }
    if (dateEnd) {
      filteredBookings = filteredBookings.filter(b => new Date(b.preferredDate) <= new Date(dateEnd));
    }

    res.json({
      success: true,
      count: filteredBookings.length,
      data: filteredBookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get quick dashboard stats
// @route   GET /api/bookings/stats
// @access  Private/Admin
router.get('/stats', protect, async (req, res) => {
  try {
    const bookings = await dbHelper.find(Booking, {});
    const servicesCount = await dbHelper.countDocuments(Service, {});

    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const approved = bookings.filter(b => b.status === 'approved').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const rejected = bookings.filter(b => b.status === 'rejected').length;

    // Sort bookings to get recent 5
    const recentBookings = [...bookings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        completed,
        rejected,
        totalServices: servicesCount,
        recentBookings
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update a booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, async (req, res) => {
  const { status } = req.body;

  if (!['pending', 'approved', 'rejected', 'completed'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  try {
    const booking = await dbHelper.findById(Booking, req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const updatedBooking = await dbHelper.findByIdAndUpdate(Booking, req.params.id, { status });
    res.json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
