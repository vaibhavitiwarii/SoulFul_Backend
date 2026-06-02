const express = require('express');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const { list, markRead, remove } = require('../controller/adminEnquiryController');

const router = express.Router();

router.get('/', authMiddleware, requireAdmin, list);
router.patch('/:id/read', authMiddleware, requireAdmin, markRead);
router.delete('/:id', authMiddleware, requireAdmin, remove);

module.exports = router;
