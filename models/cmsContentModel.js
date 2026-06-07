const mongoose = require('mongoose');

const cmsContentSchema = new mongoose.Schema(
  {
    heroTitle: { type: String },
    heroSubtitle: { type: String },
    heroImages: [{ type: String }],
    whyChooseUs: { type: String },
    locationText: { type: String },
    footerText: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String },
    contactAddress: { type: String },
    aboutShortDescription: { type: String },
    aboutDetailedDescription: { type: String },
    aboutDescription: { type: String },
    aboutBannerImage: { type: String },
    aboutImage: { type: String },
    aboutStats: [
      {
        label: { type: String },
        value: { type: String }
      }
    ],
    sectionHeadings: {
      domestic: { type: String },
      blogs: { type: String },
      reviews: { type: String }
    }
  },
  { timestamps: true }
);

module.exports = process.env.DATABASE_TYPE === 'firestore'
  ? require('../utils/firestoreModel')('CmsContent', 'cmsContents')
  : mongoose.model('CmsContent', cmsContentSchema);
