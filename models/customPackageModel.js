const mongoose = require('mongoose');

const customPackageSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['honeymoon', 'yoga', 'eco', 'spiritual'],
      required: true
    },
    title: { type: String, required: true },
    slug: { type: String },
    shortDescription: { type: String },
    description: { type: String },
    duration: { type: String },
    price: { type: String },
    location: { type: String },
    highlights: { type: String },
    itinerary: { type: String },
    inclusions: { type: String },
    exclusions: { type: String },
    images: [{ type: String }],
    imageUrl: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    enquireEnabled: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CustomPackage', customPackageSchema);
