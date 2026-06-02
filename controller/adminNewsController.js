const News = require('../models/newsModel');
const { logActivity } = require('../services/activityService');

const parseBoolean = value => {
  if (value === undefined) return undefined;
  return String(value) === 'true';
};

exports.list = async (req, res) => {
  const items = await News.find().sort({ createdAt: -1 });
  res.json(items);
};

exports.create = async (req, res) => {
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const payload = {
    ...req.body,
    imageUrl,
    isActive: parseBoolean(req.body.isActive)
  };
  const doc = await News.create(payload);
  await logActivity(`Added news: ${doc.title}`);
  res.status(201).json(doc);
};

exports.update = async (req, res) => {
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const payload = {
    ...req.body,
    imageUrl: imageUrl || req.body.existingImageUrl,
    isActive: parseBoolean(req.body.isActive)
  };

  const doc = await News.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!doc) {
    return res.status(404).json({ message: 'News item not found' });
  }
  await logActivity(`Updated news: ${doc.title}`);
  return res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await News.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'News item not found' });
  }
  await logActivity(`Deleted news: ${doc.title}`);
  return res.json({ message: 'Deleted' });
};

exports.toggle = async (req, res) => {
  const doc = await News.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'News item not found' });
  }
  doc.isActive = !doc.isActive;
  await doc.save();
  return res.json(doc);
};
