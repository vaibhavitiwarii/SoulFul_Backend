// models/experienceModel.js

const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: { // Display name of the experience category (e.g., "Winter Tours")
    type: String,
    required: true,
    unique: true,
  },
  description: { // Short description about the experience category
    type: String,
  },
  imageUrl: { // URL of the banner or thumbnail image for this category
    type: String,
  },
  slug: { // URL-friendly identifier (e.g., "winter-tours")
    type: String,
    required: true,
    unique: true,
  },
  isActive: { // Flag to enable/disable this category from frontend
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Experience', experienceSchema);
