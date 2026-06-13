const PackageCategory = require('../models/packageCategoryModel');
const { logActivity } = require('../services/activityService');
const slugify = require('../utils/slugify');
const cloudinary = require('../src/config/cloudinary');

// 🔥 Upload single image to Cloudinary (works with memoryStorage)
const uploadToCloudinary = async file => {
  if (!file) return undefined;

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'categories' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(file.buffer); // send buffer instead of file.path
  });

  return result.secure_url;
};

const parseBoolean = value => {
  if (value === undefined) return undefined;
  return String(value) === 'true';
};

exports.list = async (req, res) => {
  const items = await PackageCategory.find().sort({ createdAt: -1 });
  res.json(items);
};

exports.create = async (req, res) => {
  try {
    const image = req.file ? await uploadToCloudinary(req.file) : undefined;
    const slugSource = req.body.slug || req.body.title;

    const payload = {
      ...req.body,
      image,
      isActive: parseBoolean(req.body.isActive)
    };

    if (slugSource) {
      payload.slug = slugify(slugSource);
    }

    const doc = await PackageCategory.create(payload);
    await logActivity(`Added package category: ${doc.title}`);
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const image = req.file ? await uploadToCloudinary(req.file) : undefined;
    const slugSource = req.body.slug || req.body.title;

    const payload = {
      ...req.body,
      image: image || req.body.existingImage,
      isActive: parseBoolean(req.body.isActive)
    };

    if (slugSource) {
      payload.slug = slugify(slugSource);
    }

    const doc = await PackageCategory.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!doc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await logActivity(`Updated package category: ${doc.title}`);
    return res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  const doc = await PackageCategory.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Category not found' });
  }
  await logActivity(`Deleted package category: ${doc.title}`);
  return res.json({ message: 'Deleted' });
};

exports.toggle = async (req, res) => {
  const doc = await PackageCategory.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Category not found' });
  }
  doc.isActive = !doc.isActive;
  await doc.save();
  return res.json(doc);
};
