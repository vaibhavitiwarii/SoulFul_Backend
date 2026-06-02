const { getRecentActivity } = require('../services/activityService');

exports.list = async (req, res) => {
  const items = await getRecentActivity(12);
  res.json(items);
};
