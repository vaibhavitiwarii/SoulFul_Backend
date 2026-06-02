// models/tourOfIndiaCategoryModel.js

const mongoose = require('mongoose');

const tourOfIndiaCategorySchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Chardham Yatra"
  slug: { type: String, required: true, unique: true }, // e.g., "chardham-yatra"
  description: String,
  imageUrl: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('TourOfIndiaCategory', tourOfIndiaCategorySchema);
