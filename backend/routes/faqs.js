const express = require('express');
const router = express.Router();
const Faq = require('../models/Faq');
const dbHelper = require('../utils/dbHelper');
const { protect } = require('../middleware/auth');

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const faqs = await dbHelper.find(Faq, {}, { order: 1 });
    res.json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Create an FAQ
// @route   POST /api/faqs
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  const { question, answer, order } = req.body;

  try {
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required fields' });
    }

    // Auto-order to end if not specified
    let targetOrder = Number(order);
    if (order === undefined) {
      const faqs = await dbHelper.find(Faq, {});
      targetOrder = faqs.reduce((max, f) => (f.order > max ? f.order : max), -1) + 1;
    }

    const faq = await dbHelper.create(Faq, {
      question,
      answer,
      order: targetOrder
    });

    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update an FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  const { question, answer, order } = req.body;

  try {
    let faq = await dbHelper.findById(Faq, req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    const fields = {};
    if (question) fields.question = question;
    if (answer) fields.answer = answer;
    if (order !== undefined) fields.order = Number(order);

    const updated = await dbHelper.findByIdAndUpdate(Faq, req.params.id, fields);
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Delete an FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const faq = await dbHelper.findById(Faq, req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    await dbHelper.findByIdAndDelete(Faq, req.params.id);
    res.json({ success: true, message: 'FAQ removed successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
