const GalleryItem = require('../models/galleryItemModel');
const { logActivity } = require('../services/activityService');

const parseBoolean = value => {
  if (value === undefined) return undefined;
  return String(value) === 'true';
};

const getMediaType = file => {
  if (!file) return undefined;
  return file.mimetype.startsWith('video/') ? 'video' : 'image';
};

const buildItemsFromFiles = (files, basePayload) =>
  (files || []).map(file => ({
    ...basePayload,
    mediaUrl: `/uploads/${file.filename}`,
    mediaType: getMediaType(file)
  }));

exports.list = async (req, res) => {
  const items = await GalleryItem.find().sort({ createdAt: -1 });
  res.json(items);
};

exports.create = async (req, res) => {
  const files = req.files || [];
  if (files.length === 0) {
    return res.status(400).json({ message: 'Media file is required' });
  }
  const basePayload = {
    title: req.body.title || '',
    place: req.body.place || '',
    shortDescription: req.body.shortDescription || '',
    description: req.body.description || '',
    isActive: parseBoolean(req.body.isActive)
  };
  const items = buildItemsFromFiles(files, basePayload);
  const docs = await GalleryItem.insertMany(items);
  await logActivity(`Added ${docs.length} gallery item(s)`);
  res.status(201).json(docs);
};

exports.update = async (req, res) => {
  const mediaUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const mediaType = req.file ? getMediaType(req.file) : undefined;
  const payload = {
    title: req.body.title || '',
    place: req.body.place || '',
    shortDescription: req.body.shortDescription || '',
    description: req.body.description || '',
    mediaUrl: mediaUrl || req.body.existingMediaUrl,
    mediaType: mediaType || req.body.existingMediaType,
    isActive: parseBoolean(req.body.isActive)
  };

  const doc = await GalleryItem.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!doc) {
    return res.status(404).json({ message: 'Gallery item not found' });
  }
  await logActivity(`Updated gallery item: ${doc.title || doc.mediaType}`);
  return res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await GalleryItem.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Gallery item not found' });
  }
  await logActivity(`Deleted gallery item: ${doc.title || doc.mediaType}`);
  return res.json({ message: 'Deleted' });
};

exports.toggle = async (req, res) => {
  const doc = await GalleryItem.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Gallery item not found' });
  }
  doc.isActive = !doc.isActive;
  await doc.save();
  return res.json(doc);
};
