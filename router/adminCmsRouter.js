const express = require('express');
const upload = require('../middleware/upload');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const { get, save } = require('../controller/adminCmsController');

const router = express.Router();

router.get('/', authMiddleware, requireAdmin, get);
router.put(
	'/',
	authMiddleware,
	requireAdmin,
	upload.fields([
		{ name: 'aboutBannerImage', maxCount: 1 },
		{ name: 'aboutImage', maxCount: 1 }
	]),
	save
);

module.exports = router;
