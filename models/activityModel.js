const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    message: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
