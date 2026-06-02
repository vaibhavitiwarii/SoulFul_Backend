const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
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
    image: { type: String },
    images: [{ type: String }],
    metaTitle: { type: String },
    metaDescription: { type: String },
    enquireEnabled: { type: Boolean, default: true },
    enquiriesCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Destination', destinationSchema);
