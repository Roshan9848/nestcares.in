const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  }
});

const SubServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: '',
  },
  benefits: {
    type: [String],
    default: [],
  },
  faqs: {
    type: [FAQSchema],
    default: [],
  },
  bookable: {
    type: Boolean,
    default: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  }
});

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  fullDescription: {
    type: String,
    required: true,
  },
  bannerImage: {
    type: String,
    default: '',
  },
  galleryImages: {
    type: [String],
    default: [],
  },
  benefits: {
    type: [String],
    default: [],
  },
  subServices: {
    type: [SubServiceSchema],
    default: [],
  },
  faqs: {
    type: [FAQSchema],
    default: [],
  },
  price: {
    type: Number,
    default: 0,
  },
  bookable: {
    type: Boolean,
    default: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  icon: {
    type: String,
    default: 'Heart',
  },
  preparationInstructions: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Service', ServiceSchema);
