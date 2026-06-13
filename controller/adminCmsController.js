const CmsContent = require('../models/cmsContentModel');
const { logActivity } = require('../services/activityService');
const cloudinary = require('../src/config/cloudinary');

const uploadToCloudinary = async file => {
  if (!file) return undefined;
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'cms' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(file.buffer);
  });
  return result.secure_url;
};

exports.get = async (req, res) => {
  const doc = await CmsContent.findOne();
  res.json(doc || {});
};

exports.save = async (req, res) => {
  const aboutBannerImage = req.files?.aboutBannerImage?.[0]
    ? await uploadToCloudinary(req.files.aboutBannerImage[0])
    : undefined;
  const aboutImage = req.files?.aboutImage?.[0]
    ? await uploadToCloudinary(req.files.aboutImage[0])
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
