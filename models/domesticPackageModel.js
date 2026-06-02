const mongoose = require('mongoose');

const domesticPackageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String },
    country: { type: String },
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
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PackageCategory' }],
    metaTitle: { type: String },
    metaDescription: { type: String },
    enquireEnabled: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('DomesticPackage', domesticPackageSchema);
