// models/travelGuideModel.js

const mongoose = require('mongoose');

const travelGuideSchema = new mongoose.Schema({
  region: { // e.g., "Rajasthan", "Uttar Pradesh", "Ladakh"
    type: String,
    required: true
  },
  slug: { // e.g., "rajasthan", "uttar-pradesh", "ladakh"
    type: String,
    required: true,
    unique: true
  },
  overview: { // Intro paragraph for the region
    type: String
  },
  bestTimeToVisit: {
    type: String // e.g., "October to March"
  },
  popularCities: [{ // e.g., Jaipur, Udaipur
    name: String,
    description: String,
    imageUrl: String
  }],
  topAttractions: [{ // e.g., Taj Mahal, Mehrangarh Fort
    name: String,
    description: String,
    location: String,
    imageUrl: String,
    linkToTourSlug: String // Optional: slug of related tour package
  }],
  experiences: [{ // e.g., Desert Safari, Houseboat Cruise
    title: String,
    description: String,
    imageUrl: String
  }],
  festivals: [{ // e.g., Pushkar Camel Fair
    name: String,
    description: String,
    month: String,
    imageUrl: String
  }],
  travelTips: [{ // e.g., "Avoid peak hours", "Dress modestly"
    tip: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TravelGuide', travelGuideSchema);
