const mongoose = require('mongoose');

const bestTimeTourPackageSchema = new mongoose.Schema({
  title: String,
  duration: String,
  price: String,
  itinerary: [String],
  inclusions: [String],
  exclusions: [String],
  faq: [{
    question: String,
    answer: String
  }],
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BestTimeDestination'
  },
  imageUrl: String,
  category: String, // e.g., Honeymoon, Family, Adventure
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BestTimeTourPackage', bestTimeTourPackageSchema);
