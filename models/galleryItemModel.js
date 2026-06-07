const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String },
    place: { type: String },
    shortDescription: { type: String },
    description: { type: String },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video'], required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = process.env.DATABASE_TYPE === 'firestore'
  ? require('../utils/firestoreModel')('GalleryItem', 'galleryItems')
  : mongoose.model('GalleryItem', galleryItemSchema);
