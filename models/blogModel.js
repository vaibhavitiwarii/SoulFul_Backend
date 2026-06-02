const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String },
    description: { type: String },
    content: { type: String },
    author: { type: String },
    date: { type: String },
    location: { type: String },
    coverImage: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
