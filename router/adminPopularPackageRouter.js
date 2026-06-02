const express = require('express');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const {
  list,
  create,
  update,
  remove,
  toggle
} = require('../controller/adminPopularPackageController');

const router = express.Router();

router.get('/', authMiddleware, requireAdmin, list);
router.post('/', authMiddleware, requireAdmin, create);
router.put('/:id', authMiddleware, requireAdmin, update);
router.delete('/:id', authMiddleware, requireAdmin, remove);
router.patch('/:id/toggle', authMiddleware, requireAdmin, toggle);

module.exports = router;
