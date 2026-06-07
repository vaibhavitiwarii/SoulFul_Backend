const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String },
    shortDescription: { type: String },
    content: { type: String },
    date: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = process.env.DATABASE_TYPE === 'firestore'
  ? require('../utils/firestoreModel')('News', 'news')
  : mongoose.model('News', newsSchema);
