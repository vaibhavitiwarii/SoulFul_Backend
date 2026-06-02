const express = require('express');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const { getStats } = require('../controller/adminStatsController');

const router = express.Router();

router.get('/', authMiddleware, requireAdmin, getStats);

module.exports = router;
