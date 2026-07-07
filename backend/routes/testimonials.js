const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const dbHelper = require('../utils/dbHelper');
const { protect } = require('../middleware/auth');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
router.get('/', async (req, res) => {
  try {
    const testimonials = await dbHelper.find(Testimonial, {}, { order: 1 });
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  const { name, text, image, designation, order } = req.body;

  try {
    if (!name || !text) {
      return res.status(400).json({ success: false, message: 'Name and text are required fields' });
    }

    // Auto-order to end if not specified
    let targetOrder = Number(order);
    if (order === undefined) {
      const testimonials = await dbHelper.find(Testimonial, {});
      targetOrder = testimonials.reduce((max, t) => (t.order > max ? t.order : max), -1) + 1;
    }

    const testimonial = await dbHelper.create(Testimonial, {
      name,
      text,
      image: image || '',
      designation: designation || 'Patient Family',
      order: targetOrder
    });

    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  const { name, text, image, designation, order } = req.body;

  try {
    let testimonial = await dbHelper.findById(Testimonial, req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    const fields = {};
    if (name) fields.name = name;
    if (text) fields.text = text;
    if (image !== undefined) fields.image = image;
    if (designation) fields.designation = designation;
    if (order !== undefined) fields.order = Number(order);

    const updated = await dbHelper.findByIdAndUpdate(Testimonial, req.params.id, fields);
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const testimonial = await dbHelper.findById(Testimonial, req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    await dbHelper.findByIdAndDelete(Testimonial, req.params.id);
    res.json({ success: true, message: 'Testimonial removed successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
