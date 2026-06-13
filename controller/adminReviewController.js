const Review = require('../models/reviewModel');
const { logActivity } = require('../services/activityService');
const cloudinary = require('../src/config/cloudinary');

const uploadToCloudinary = async file => {
  if (!file) return undefined;
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'reviews' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(file.buffer);
  });
  return result.secure_url;
};

const parseBoolean = value => {
  if (value === undefined) return undefined;
  return String(value) === 'true';
};

exports.list = async (req, res) => {
  const items = await Review.find().sort({ createdAt: -1 });
  res.json(items);
};

exports.create = async (req, res) => {
  if (!req.body?.name) {
    return res.status(400).json({ message: 'Guest name is required' });
  }

  const guestPhoto = req.file ? await uploadToCloudinary(req.file) : undefined;
  const payload = {
    ...req.body,
    guestPhoto,
    rating: Number(req.body.rating || 5),
    isActive: parseBoolean(req.body.isActive)
  };
  delete payload.existingGuestPhoto;

  const doc = await Review.create(payload);
  await logActivity(`Added review: ${doc.name}`);
  res.status(201).json(doc);
};

exports.update = async (req, res) => {
  if (!req.body?.name) {
    return res.status(400).json({ message: 'Guest name is required' });
  }

  const guestPhoto = req.file ? await uploadToCloudinary(req.file) : req.body.existingGuestPhoto;
  const payload = {
    ...req.body,
    guestPhoto,
    rating: Number(req.body.rating || 5),
    isActive: parseBoolean(req.body.isActive)
  };
  delete payload.existingGuestPhoto;

  const doc = await Review.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!doc) {
    return res.status(404).json({ message: 'Review not found' });
  }
  await logActivity(`Updated review: ${doc.name}`);
  return res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await Review.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Review not found' });
  }
  await logActivity(`Deleted review: ${doc.name}`);
  return res.json({ message: 'Deleted' });
};

exports.toggle = async (req, res) => {
  const doc = await Review.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Review not found' });
  }
  doc.isActive = !doc.isActive;
  await doc.save();
  return res.json(doc);
};
