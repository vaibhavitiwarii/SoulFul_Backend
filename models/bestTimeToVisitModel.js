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

module.exports = process.env.DATABASE_TYPE === 'firestore'
  ? require('../utils/firestoreModel')('BestTimeToVisit', 'bestTimeToVisits')
  : mongoose.model('BestTimeToVisit', bestTimeToVisitSchema);
