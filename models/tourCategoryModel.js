// models/tourCategoryModel.js

const mongoose = require('mongoose');

const tourCategorySchema = new mongoose.Schema({
  title: { // e.g., "Sikkim", "Kerala"
    type: String,
    required: true,
    unique: true,
  },
  slug: { // e.g., "sikkim"
    type: String,
    required: true,
    unique: true,
  },
  description: { // Overview of the region or theme
    type: String,
  },
  imageUrl: { // Banner or thumbnail image
    type: String,
  },
  bestTimeToVisit: { // e.g., "March to May, October to December"
    type: String,
  },
  howToReach: { // Summary of travel options (air, rail, road)
    type: String,
  },
  travelTips: [{ // Optional travel tips
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TourCategory', tourCategorySchema);
