const mongoose = require('mongoose');

const bestTimeToVisitSchema = new mongoose.Schema({
  season: {
    type: String,
    enum: ['Summer', 'Monsoon', 'Winter'],
    required: true
  },
  months: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VisitMonth'
  }],
  description: String,
  temperatureRange: String,
  activities: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BestTimeToVisit', bestTimeToVisitSchema);
