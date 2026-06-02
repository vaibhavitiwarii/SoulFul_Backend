// models/tourPackageModel.js

const mongoose = require('mongoose');

const tourPackageSchema = new mongoose.Schema({
  categoryId: { // Reference to TourCategory
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourCategory',
    required: true,
  },
  categorySlug: { // e.g., "sikkim" (for quick lookup)
    type: String,
    required: true,
  },
  title: { // e.g., "Darjeeling Pelling Gangtok Tour"
    type: String,
    required: true,
  },
  slug: { // e.g., "darjeeling-pelling-gangtok-tour"
    type: String,
    required: true,
    unique: true,
  },
  duration: { // e.g., "6 Nights / 7 Days"
    type: String,
  },
  destinations: [{ // e.g., ["Darjeeling", "Pelling", "Gangtok"]
    type: String,
  }],
  priceStart: {
    type: Number,
  },
  currency: {
    type: String,
    default: "INR",
  },
  overview: { // Summary of the tour
    type: String,
  },
  highlights: [{ // Key attractions
    type: String,
  }],
  itinerary: [{ // Day-wise breakdown
    day: Number,
    title: String,
    description: String
  }],
  inclusions: [{ // e.g., "Accommodation", "Transfers", etc.
    type: String,
  }],
  exclusions: [{ // e.g., "Airfare", "Personal expenses"
    type: String,
  }],
  faq: [{ // Optional FAQs
    question: String,
    answer: String
  }],
  imageUrl: { // Main image for the package
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TourPackage', tourPackageSchema);
