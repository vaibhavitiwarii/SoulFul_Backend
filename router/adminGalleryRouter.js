const express = require('express');
const uploadMedia = require('../middleware/uploadMedia');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const {
  list,
  create,
  update,
  remove,
  toggle
} = require('../controller/adminGalleryController');

const router = express.Router();

router.get('/', authMiddleware, requireAdmin, list);
router.post('/', authMiddleware, requireAdmin, uploadMedia.array('media', 12), create);
router.put('/:id', authMiddleware, requireAdmin, uploadMedia.single('media'), update);
router.delete('/:id', authMiddleware, requireAdmin, remove);
router.patch('/:id/toggle', authMiddleware, requireAdmin, toggle);

module.exports = router;
