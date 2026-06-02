const express = require('express');
const multer = require('multer');
const upload = require('../middleware/upload');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const {
  list,
  create,
  update,
  remove,
  toggle
} = require('../controller/adminDestinationController');

const router = express.Router();

// Accept both 'images' (plural) and 'image' (singular) field names for backward compatibility
const uploadImages = upload.fields([
  { name: 'images', maxCount: 6 },
  { name: 'image', maxCount: 1 }
]);

// Multer error handler
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}`, field: err.field });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

router.get('/', authMiddleware, requireAdmin, list);
router.post('/', authMiddleware, requireAdmin, uploadImages, handleMulterError, create);
router.put('/:id', authMiddleware, requireAdmin, uploadImages, handleMulterError, update);
router.delete('/:id', authMiddleware, requireAdmin, remove);
router.patch('/:id/toggle', authMiddleware, requireAdmin, toggle);

module.exports = router;
