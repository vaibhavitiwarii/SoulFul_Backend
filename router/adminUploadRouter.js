const express = require('express');
const upload = require('../middleware/upload');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Generic image upload endpoint for rich text editors
router.post(
  '/image',
  authMiddleware,
  requireAdmin,
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    const url = `/uploads/${req.file.filename}`;
    return res.json({ url });
  }
);

module.exports = router;
