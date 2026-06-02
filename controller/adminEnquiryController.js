const Enquiry = require('../models/enquiryModel');

exports.list = async (req, res) => {
  const items = await Enquiry.find().sort({ createdAt: -1 });
  res.json(items);
};

exports.markRead = async (req, res) => {
  const { isRead } = req.body;
  const doc = await Enquiry.findByIdAndUpdate(
    req.params.id,
    { isRead: Boolean(isRead) },
    { new: true }
  );

  if (!doc) {
    return res.status(404).json({ message: 'Enquiry not found' });
  }

  return res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await Enquiry.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Enquiry not found' });
  }
  return res.json({ message: 'Deleted' });
};
