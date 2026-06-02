const Experience = require('../models/experienceModel');
const ExperienceSubcategory = require('../models/experienceSubcategoryModel');

// Get all experience categories
exports.getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ isActive: true });
    res.status(200).json(experiences);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
};

// Get a specific experience category by slug
exports.getExperienceBySlug = async (req, res) => {
  try {
    const experience = await Experience.findOne({ slug: req.params.experienceSlug, isActive: true });
    if (!experience) return res.status(404).json({ error: 'Experience not found' });
    res.status(200).json(experience);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
};

// Create a new experience category
exports.createExperience = async (req, res) => {
  try {
    const experience = new Experience(req.body);
    await experience.save();
    res.status(201).json(experience);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create experience', details: err.message });
  }
};

// Update an experience category
exports.updateExperience = async (req, res) => {
  try {
    const updated = await Experience.findOneAndUpdate(
      { slug: req.params.experienceSlug },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Experience not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update experience', details: err.message });
  }
};

// Delete an experience category
exports.deleteExperience = async (req, res) => {
  try {
    const deleted = await Experience.findOneAndDelete({ slug: req.params.experienceSlug });
    if (!deleted) return res.status(404).json({ error: 'Experience not found' });
    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete experience' });
  }
};

// Get all subcategories under a specific experience
exports.getSubcategoriesByExperience = async (req, res) => {
  try {
    const experience = await Experience.findOne({ slug: req.params.experienceSlug });
    if (!experience) return res.status(404).json({ error: 'Experience not found' });

    const subcategories = await ExperienceSubcategory.find({
      experienceId: experience._id,
      isActive: true
    });

    res.status(200).json(subcategories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
};

// Get a specific subcategory by its slug
exports.getSubcategoryBySlug = async (req, res) => {
  try {
    const experience = await Experience.findOne({ slug: req.params.experienceSlug });
    if (!experience) return res.status(404).json({ error: 'Experience not found' });

    const subcategory = await ExperienceSubcategory.findOne({
      experienceId: experience._id,
      slug: req.params.subcategorySlug,
      isActive: true
    });

    if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });

    res.status(200).json(subcategory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subcategory' });
  }
};

// Create a new subcategory under an experience
exports.createSubcategory = async (req, res) => {
  try {
    const experience = await Experience.findOne({ slug: req.params.experienceSlug });
    if (!experience) return res.status(404).json({ error: 'Experience not found' });

    const subcategory = new ExperienceSubcategory({
      ...req.body,
      experienceId: experience._id
    });

    await subcategory.save();
    res.status(201).json(subcategory);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create subcategory', details: err.message });
  }
};

// Update a subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const experience = await Experience.findOne({ slug: req.params.experienceSlug });
    if (!experience) return res.status(404).json({ error: 'Experience not found' });

    const updated = await ExperienceSubcategory.findOneAndUpdate(
      {
        experienceId: experience._id,
        slug: req.params.subcategorySlug
      },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Subcategory not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update subcategory', details: err.message });
  }
};

// Delete a subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const experience = await Experience.findOne({ slug: req.params.experienceSlug });
    if (!experience) return res.status(404).json({ error: 'Experience not found' });

    const deleted = await ExperienceSubcategory.findOneAndDelete({
      experienceId: experience._id,
      slug: req.params.subcategorySlug
    });

    if (!deleted) return res.status(404).json({ error: 'Subcategory not found' });
    res.status(200).json({ message: 'Subcategory deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete subcategory' });
  }
};
