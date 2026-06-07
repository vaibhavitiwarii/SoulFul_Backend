const mongoose = require('mongoose');

const visitMonthSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    required: true
  },
  destinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BestTimeDestination'
  }],
  description: String,
  festivals: [String],
  climateNotes: String
});

module.exports = process.env.DATABASE_TYPE === 'firestore'
  ? require('../utils/firestoreModel')('VisitMonth', 'visitMonths')
  : mongoose.model('VisitMonth', visitMonthSchema);
