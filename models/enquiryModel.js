const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String },
    message: { type: String },
    date: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = process.env.DATABASE_TYPE === 'firestore'
  ? require('../utils/firestoreModel')('Enquiry', 'enquiries')
  : mongoose.model('Enquiry', enquirySchema);
