const CustomPackage = require('../models/customPackageModel');
const { logActivity } = require('../services/activityService');
const slugify = require('../utils/slugify');
const cloudinary = require('../src/config/cloudinary');

const uploadToCloudinary = async file => {
  if (!file) return undefined;
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'custom-packages' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(file.buffer);
  });
  return result.secure_url;
};

const buildImages = async req => {
  let allFiles = [];
  if (Array.isArray(req.files)) {
    allFiles = req.files;
  } else if (req.files?.images) {
    allFiles = req.files.images;
  } else if (req.files?.image) {
    allFiles = req.files.image;
  } else if (req.file) {
    allFiles = [req.file];
  }
  
  const urls = [];
  for (const file of allFiles) {
    urls.push(await uploadToCloudinary(file));
  }
  return urls;
};

const parseBoolean = value => {
  if (value === undefined) return undefined;
  return String(value) === 'true';
};

const parseExistingImages = value => {
  if (!value) return undefined;
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
  const items = await CustomPackage.find().sort({ createdAt: -1 });
  res.json(items);
};

exports.create = async (req, res) => {
  const images = await buildImages(req);
  const slugSource = req.body.slug || req.body.title;
  const payload = {
    ...req.body,
    category: req.body.category,
    title: req.body.title,
    slug: slugSource ? slugify(slugSource) : undefined,
    shortDescription: req.body.shortDescription || '',
    description: req.body.description || '',
    duration: req.body.duration || '',
    price: req.body.price || '',
    location: req.body.location || '',
    highlights: req.body.highlights || '',
    itinerary: req.body.itinerary || '',
    inclusions: req.body.inclusions || '',
    exclusions: req.body.exclusions || '',
    images,
    imageUrl: images[0] || req.body.imageUrl || '',
    metaTitle: req.body.metaTitle || '',
    metaDescription: req.body.metaDescription || '',
    enquireEnabled: parseBoolean(req.body.enquireEnabled),
    isActive: parseBoolean(req.body.isActive)
  };
  const doc = await CustomPackage.create(payload);
  await logActivity(`Added customized package: ${doc.title}`);
  res.status(201).json(doc);
};

exports.update = async (req, res) => {
  const uploadedImages = await buildImages(req);
  const existingImages = parseExistingImages(req.body.existingImages);
  const mergedImages = existingImages ? [...existingImages, ...uploadedImages] : undefined;
  const slugSource = req.body.slug || req.body.title;
  const payload = {
    ...req.body,
    category: req.body.category,
    title: req.body.title,
    slug: slugSource ? slugify(slugSource) : undefined,
    shortDescription: req.body.shortDescription || '',
    description: req.body.description || '',
    duration: req.body.duration || '',
    price: req.body.price || '',
    location: req.body.location || '',
    highlights: req.body.highlights || '',
    itinerary: req.body.itinerary || '',
    inclusions: req.body.inclusions || '',
    exclusions: req.body.exclusions || '',
    images: mergedImages,
    imageUrl: (mergedImages && mergedImages[0]) || req.body.existingImage || req.body.imageUrl || '',
    metaTitle: req.body.metaTitle || '',
    metaDescription: req.body.metaDescription || '',
    enquireEnabled: parseBoolean(req.body.enquireEnabled),
    isActive: parseBoolean(req.body.isActive)
  };

  const doc = await CustomPackage.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!doc) {
    return res.status(404).json({ message: 'Customized package not found' });
  }
  await logActivity(`Updated customized package: ${doc.title}`);
  return res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await CustomPackage.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Customized package not found' });
  }
  await logActivity(`Deleted customized package: ${doc.title}`);
  return res.json({ message: 'Deleted' });
};

exports.toggle = async (req, res) => {
  const doc = await CustomPackage.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Customized package not found' });
  }
  doc.isActive = !doc.isActive;
  await doc.save();
  return res.json(doc);
};
