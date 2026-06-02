const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controller/contactController');

router.post('/', sendContactEmail);

module.exports = router;
