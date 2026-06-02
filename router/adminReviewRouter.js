const express = require('express');
const upload = require('../middleware/upload');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const {
  list,
  create,
  update,
  remove,
  toggle
} = require('../controller/adminReviewController');

const router = express.Router();

router.get('/', authMiddleware, requireAdmin, list);
router.post('/', authMiddleware, requireAdmin, upload.single('guestPhoto'), create);
router.put('/:id', authMiddleware, requireAdmin, upload.single('guestPhoto'), update);
router.delete('/:id', authMiddleware, requireAdmin, remove);
router.patch('/:id/toggle', authMiddleware, requireAdmin, toggle);

module.exports = router;
