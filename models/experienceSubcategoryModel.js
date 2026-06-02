// models/experienceSubcategoryModel.js

const mongoose = require('mongoose');

const experienceSubcategorySchema = new mongoose.Schema({
  experienceId: { // Reference to the parent Experience category
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: true,
  },
  title: { // Name of the subcategory/package (e.g., "Auli Tour Package")
    type: String,
    required: true,
  },
  slug: { // URL-friendly identifier (e.g., "auli-tour-package")
    type: String,
    required: true,
    unique: true,
  },
  description: { // Short description about this specific package
    type: String,
  },
  imageUrl: { // Image representing this package
    type: String,
  },
  duration: { // Duration of the tour (e.g., "5 Nights / 6 Days")
    type: String,
  },
  priceStart: { // Starting price for the package (e.g., ₹26000)
    type: Number,
  },
  isActive: { // Flag to enable/disable this package
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('ExperienceSubcategory', experienceSubcategorySchema);
