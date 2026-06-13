const Blog = require('../models/blogModel');
const { logActivity } = require('../services/activityService');
const slugify = require('../utils/slugify');
const cloudinary = require('../src/config/cloudinary');

// 🔥 Upload single image to Cloudinary (works with memoryStorage)
const uploadToCloudinary = async file => {
  if (!file) return undefined;

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'blogs' },
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
  const items = await Blog.find().sort({ createdAt: -1 });
  res.json(items);
};

exports.create = async (req, res) => {
  try {
    // ✅ req.file because router uses upload.single('coverImage')
    const coverImage = req.file ? await uploadToCloudinary(req.file) : undefined;
    const slugSource = req.body.slug || req.body.title;
    console.log("FILE:", req.file);
    const payload = {
      ...req.body,
      coverImage,
      debug: { coverImageVar: coverImage, reqFileExists: !!req.file },
      isActive: parseBoolean(req.body.isActive)
    };

    if (slugSource) {
      payload.slug = slugify(slugSource);
    }

    const doc = await Blog.create(payload);
    await logActivity(`Added blog: ${doc.title}`);
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const coverImage = req.file ? await uploadToCloudinary(req.file) : undefined;
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
