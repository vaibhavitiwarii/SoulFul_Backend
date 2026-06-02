const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: String, // e.g., Kerala, Rajasthan, Sri Lanka
  country: String, // e.g., India, Thailand, Indonesia
  region: String, // e.g., South India, Southeast Asia
  highlights: [String],
  temperatureRange: String,
  recommendedActivities: [String],
  tourPackages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BestTimeTourPackage'
  }],
  bestMonths: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VisitMonth'
  }]
});

module.exports = mongoose.model('BestTimeDestination', destinationSchema);
