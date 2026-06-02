const Enquiry = require('../models/enquiryModel');
const Destination = require('../models/destinationModel');

const fallbackDestinations = [
  { name: 'Jaipur', enquiriesCount: 87 },
  { name: 'Agra', enquiriesCount: 72 },
  { name: 'Kerala', enquiriesCount: 58 },
  { name: 'Goa', enquiriesCount: 45 },
  { name: 'Varanasi', enquiriesCount: 38 }
];

exports.getStats = async (req, res) => {
  const [totalEnquiries, destinations] = await Promise.all([
    Enquiry.countDocuments(),
    Destination.find({ isActive: true }).sort({ enquiriesCount: -1, createdAt: -1 }).limit(8)
  ]);

  const totalVisitors = Number(process.env.TOTAL_VISITORS || 0);
  const popularDestinations = destinations.length > 0 ? destinations : fallbackDestinations;

  res.json({
    totalEnquiries,
    totalVisitors,
    popularDestinations
  });
};
