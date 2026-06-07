const mongoose = require('mongoose');

const packageCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String },
    description: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = process.env.DATABASE_TYPE === 'firestore'
  ? require('../utils/firestoreModel')('PackageCategory', 'packageCategories')
  : mongoose.model('PackageCategory', packageCategorySchema);
