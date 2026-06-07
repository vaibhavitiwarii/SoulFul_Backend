const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    message: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = process.env.DATABASE_TYPE === 'firestore'
  ? require('../utils/firestoreModel')('Activity', 'activities')
  : mongoose.model('Activity', activitySchema);
