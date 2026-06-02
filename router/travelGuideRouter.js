const express = require('express');
const router = express.Router();
const {
  getAllGuides,
  getGuideBySlug,
  createGuide
} = require('../controller/travelGuideController');

// Get all travel guides
router.get('/', getAllGuides);

// Get a specific guide by slug
router.get('/:regionSlug', getGuideBySlug);

// Create a new travel guide
router.post('/', createGuide);

module.exports = router;
