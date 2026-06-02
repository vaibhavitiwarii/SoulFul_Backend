const Blog = require('../models/blogModel');
const { logActivity } = require('../services/activityService');
const slugify = require('../utils/slugify');

const parseBoolean = value => {
  if (value === undefined) return undefined;
  return String(value) === 'true';
};

exports.list = async (req, res) => {
  const items = await Blog.find().sort({ createdAt: -1 });
  res.json(items);
};

exports.create = async (req, res) => {
  const coverImage = req.file ? `/uploads/${req.file.filename}` : undefined;
  const slugSource = req.body.slug || req.body.title;
  const payload = {
    ...req.body,
    coverImage,
    isActive: parseBoolean(req.body.isActive)
  };
  if (slugSource) {
    payload.slug = slugify(slugSource);
  }
  const doc = await Blog.create(payload);
  await logActivity(`Added blog: ${doc.title}`);
  res.status(201).json(doc);
};

exports.update = async (req, res) => {
  const coverImage = req.file ? `/uploads/${req.file.filename}` : undefined;
  const slugSource = req.body.slug || req.body.title;
  const payload = {
    ...req.body,
    coverImage: coverImage || req.body.existingCoverImage,
    isActive: parseBoolean(req.body.isActive)
  };
  if (slugSource) {
    payload.slug = slugify(slugSource);
  }

  const doc = await Blog.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!doc) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  await logActivity(`Updated blog: ${doc.title}`);
  return res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await Blog.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  await logActivity(`Deleted blog: ${doc.title}`);
  return res.json({ message: 'Deleted' });
};

exports.toggle = async (req, res) => {
  const doc = await Blog.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  doc.isActive = !doc.isActive;
  await doc.save();
  return res.json(doc);
};
