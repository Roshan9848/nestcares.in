const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: false,
    lowercase: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
  },
  subServiceName: {
    type: String,
    required: true,
  },
  preferredDate: {
    type: String,
    required: true,
  },
  preferredTime: {
    type: String,
    required: true,
  },
  bookingId: {
    type: String,
    unique: true,
    trim: true,
  },
  notes: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', BookingSchema);
