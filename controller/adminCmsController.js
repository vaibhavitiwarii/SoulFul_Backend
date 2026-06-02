const CmsContent = require('../models/cmsContentModel');
const { logActivity } = require('../services/activityService');

exports.get = async (req, res) => {
  const doc = await CmsContent.findOne();
  res.json(doc || {});
};

exports.save = async (req, res) => {
  const aboutBannerImage = req.files?.aboutBannerImage?.[0]
    ? `/uploads/${req.files.aboutBannerImage[0].filename}`
    : undefined;
  const aboutImage = req.files?.aboutImage?.[0]
    ? `/uploads/${req.files.aboutImage[0].filename}`
    : undefined;
  const existing = await CmsContent.findOne();
  let aboutStats = req.body.aboutStats;
  if (typeof aboutStats === 'string') {
    try {
      aboutStats = JSON.parse(aboutStats);
    } catch (error) {
      aboutStats = [];
    }
  }

  const payload = {
    ...req.body,
    aboutStats,
    aboutBannerImage: aboutBannerImage || req.body.existingAboutBannerImage,
    aboutImage: aboutImage || req.body.existingAboutImage
  };

  let doc;
  if (existing) {
    doc = await CmsContent.findByIdAndUpdate(existing._id, payload, { new: true });
  } else {
    doc = await CmsContent.create(payload);
  }

  await logActivity('Updated CMS content');
  res.json(doc);
};
