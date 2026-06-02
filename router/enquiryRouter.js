const express = require('express');
const router = express.Router();
const { sendEnquiryEmail } = require('../controller/enquiryController');

router.post('/', sendEnquiryEmail);

module.exports = router;