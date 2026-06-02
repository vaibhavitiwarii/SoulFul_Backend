const CustomPackage = require('../models/customPackageModel');

const seedData = [
  {
    category: 'honeymoon',
    title: 'Romantic Backwater Escape',
    description: 'Private houseboats, sunset cruises, and curated candlelight dinners.',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80'
  },
  {
    category: 'yoga',
    title: 'Himalayan Yoga Retreat',
    description: 'Morning yoga flows, forest meditation, and mindful hikes.',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80'
  },
  {
    category: 'eco',
    title: 'Eco Trails & Homestays',
    description: 'Low-impact stays, local cuisine, and nature-first itineraries.',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80'
  },
  {
    category: 'spiritual',
    title: 'Sacred River Journey',
    description: 'Temple visits, evening aarti, and heritage walks.',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80'
  }
];

const ensureSeedCustomPackages = async () => {
  const existing = await CustomPackage.countDocuments();
  if (existing > 0) {
    return;
  }
  await CustomPackage.insertMany(seedData);
};

module.exports = { ensureSeedCustomPackages };
