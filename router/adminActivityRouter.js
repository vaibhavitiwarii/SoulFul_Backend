const express = require('express');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const { list } = require('../controller/adminActivityController');

const router = express.Router();

router.get('/', authMiddleware, requireAdmin, list);

module.exports = router;
