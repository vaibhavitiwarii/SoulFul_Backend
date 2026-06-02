const TravelGuide = require('../models/travelGuideModel');

// Get all guides
exports.getAllGuides = async (req, res) => {
  try {
    const guides = await TravelGuide.find({ isActive: true });
    res.status(200).json(guides);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch guides' });
  }
};

// Get guide by slug
exports.getGuideBySlug = async (req, res) => {
  try {
    const guide = await TravelGuide.findOne({
      slug: req.params.regionSlug,
      isActive: true
    });
    if (!guide) return res.status(404).json({ error: 'Guide not found' });
    res.status(200).json(guide);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch guide' });
  }
};

// Create a new guide
exports.createGuide = async (req, res) => {
  try {
    const guide = new TravelGuide(req.body);
    await guide.save();
    res.status(201).json(guide);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create guide', details: err.message });
  }
};
