const express = require('express');
const upload = require('../middleware/upload');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const {
  list,
  create,
  update,
  remove,
  toggle
} = require('../controller/adminDomesticController');

const router = express.Router();

router.get('/', authMiddleware, requireAdmin, list);
router.post('/', authMiddleware, requireAdmin, upload.array('images', 6), create);
router.put('/:id', authMiddleware, requireAdmin, upload.array('images', 6), update);
router.delete('/:id', authMiddleware, requireAdmin, remove);
router.patch('/:id/toggle', authMiddleware, requireAdmin, toggle);

module.exports = router;
