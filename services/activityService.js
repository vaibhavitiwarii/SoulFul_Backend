const Activity = require('../models/activityModel');

const logActivity = async message => {
  try {
    await Activity.create({ message });
  } catch (error) {
    // Avoid failing request because of activity logging
  }
};

const getRecentActivity = async (limit = 10) => {
  const items = await Activity.find().sort({ createdAt: -1 }).limit(limit);
  return items;
};

module.exports = { logActivity, getRecentActivity };
