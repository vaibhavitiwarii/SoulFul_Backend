const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema(
  {
    day: { type: Number },
    title: { type: String },
    details: { type: String }
  },
  { _id: false }
);

const indiaTourPackageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: {
      type: String,
      enum: ['domestic', 'international', 'customized'],
      default: 'domestic'
    },
    location: { type: String, default: '' },
    duration: { type: String, default: '' },
    price: { type: String, default: '' },
    currency: { type: String, default: 'INR' },
    shortDescription: { type: String, default: '' },
    longDescription: { type: String, default: '' },
    itinerary: { type: [itinerarySchema], default: [] },
    highlights: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' }
    },
    images: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

module.exports = mongoose.model('IndiaTourPackage', indiaTourPackageSchema);