const express = require('express');
const upload = require('../middleware/upload');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const cloudinary = require('../src/config/cloudinary');

const uploadToCloudinary = async file => {
  if (!file) return undefined;
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'uploads' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(file.buffer);
  });
  return result.secure_url;
};

const router = express.Router();

// Generic image upload endpoint for rich text editors
router.post(
  '/image',
  authMiddleware,
  requireAdmin,
  upload.single('image'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    const url = await uploadToCloudinary(req.file);
    return res.json({ url });
  }
);

module.exports = router;
