const PopularPackage = require('../models/popularPackageModel');
const { logActivity } = require('../services/activityService');
const cloudinary = require('../src/config/cloudinary');

// 🔥 Upload single image to Cloudinary (works with memoryStorage)
const uploadToCloudinary = async file => {
  if (!file) return undefined;

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'popular-packages' },
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
  const items = await PopularPackage.find()
    .populate('package')
    .sort({ sortOrder: 1, createdAt: -1 });
  res.json(items);
};

exports.create = async (req, res) => {
  try {
    const image = req.file ? await uploadToCloudinary(req.file) : undefined;

    const payload = {
      package: req.body.package,
      shortInfo: req.body.shortInfo || '',
      sortOrder: Number(req.body.sortOrder || 0),
      isActive: parseBoolean(req.body.isActive),
      image
    };

    // Enforce a maximum of 8 popular package entries
    const total = await PopularPackage.countDocuments();
    if (total >= 8) {
      return res.status(400).json({ message: 'Maximum of 8 popular packages allowed' });
    }

    const doc = await PopularPackage.create(payload);
    await logActivity('Added popular package');
    const populated = await PopularPackage.findById(doc._id).populate('package');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const image = req.file ? await uploadToCloudinary(req.file) : undefined;

    const payload = {
      package: req.body.package,
      shortInfo: req.body.shortInfo || '',
      sortOrder: Number(req.body.sortOrder || 0),
      isActive: parseBoolean(req.body.isActive),
      image: image || req.body.existingImage
    };

    const doc = await PopularPackage.findByIdAndUpdate(req.params.id, payload, { new: true }).populate('package');
    if (!doc) {
      return res.status(404).json({ message: 'Popular package not found' });
    }
    await logActivity('Updated popular package');
    return res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  const doc = await PopularPackage.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Popular package not found' });
  }
  await logActivity('Deleted popular package');
  return res.json({ message: 'Deleted' });
};

exports.toggle = async (req, res) => {
  const doc = await PopularPackage.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Popular package not found' });
  }
  doc.isActive = !doc.isActive;
  await doc.save();
  const populated = await PopularPackage.findById(doc._id).populate('package');
  return res.json(populated);
};
