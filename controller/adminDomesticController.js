const DomesticPackage = require('../models/domesticPackageModel');
const { logActivity } = require('../services/activityService');
const slugify = require('../utils/slugify');

const buildImages = req => (req.files || []).map(file => `/uploads/${file.filename}`);

const parseBoolean = value => {
  if (value === undefined) return undefined;
  return String(value) === 'true';
};

const parseIdList = value => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch (error) {
    return String(value)
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }
};

exports.list = async (req, res) => {
  const items = await DomesticPackage.find().sort({ createdAt: -1 });
  res.json(items);
};

exports.create = async (req, res) => {
  const images = buildImages(req);
  const slugSource = req.body.slug || req.body.title;
  const payload = {
    ...req.body,
    images,
    categoryIds: parseIdList(req.body.categoryIds) || [],
    enquireEnabled: parseBoolean(req.body.enquireEnabled),
    isActive: parseBoolean(req.body.isActive)
  };
  if (slugSource) {
    payload.slug = slugify(slugSource);
  }
  const doc = await DomesticPackage.create(payload);
  await logActivity(`Added domestic package: ${doc.title}`);
  res.status(201).json(doc);
};

exports.update = async (req, res) => {
  const images = buildImages(req);
  const existingImages = req.body.existingImages
    ? JSON.parse(req.body.existingImages)
    : undefined;
  const slugSource = req.body.slug || req.body.title;

  const payload = {
    ...req.body,
    images: existingImages ? [...existingImages, ...images] : undefined,
    categoryIds: parseIdList(req.body.categoryIds),
    enquireEnabled: parseBoolean(req.body.enquireEnabled),
    isActive: parseBoolean(req.body.isActive)
  };
  if (slugSource) {
    payload.slug = slugify(slugSource);
  }

  const doc = await DomesticPackage.findByIdAndUpdate(req.params.id, payload, {
    new: true
  });

  if (!doc) {
    return res.status(404).json({ message: 'Package not found' });
  }

  await logActivity(`Updated domestic package: ${doc.title}`);
  return res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await DomesticPackage.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Package not found' });
  }
  await logActivity(`Deleted domestic package: ${doc.title}`);
  return res.json({ message: 'Deleted' });
};

exports.toggle = async (req, res) => {
  const doc = await DomesticPackage.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Package not found' });
  }
  doc.isActive = !doc.isActive;
  await doc.save();
  return res.json(doc);
};
