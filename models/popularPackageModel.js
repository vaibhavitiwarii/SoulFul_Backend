const mongoose = require('mongoose');

const popularPackageSchema = new mongoose.Schema(
  {
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'DomesticPackage', required: true },
    shortInfo: { type: String },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PopularPackage', popularPackageSchema);
