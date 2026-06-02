const DomesticPackage = require('../models/domesticPackageModel');
const PackageCategory = require('../models/packageCategoryModel');
const PopularPackage = require('../models/popularPackageModel');
const Blog = require('../models/blogModel');
const News = require('../models/newsModel');
const GalleryItem = require('../models/galleryItemModel');
const Review = require('../models/reviewModel');
const CmsContent = require('../models/cmsContentModel');
const Destination = require('../models/destinationModel');
const CustomPackage = require('../models/customPackageModel');
const slugify = require('../utils/slugify');

const buildSlugVariants = inputSlug => {
  const slug = String(inputSlug || '').toLowerCase();
  const variants = new Set([slug]);

  if (slug.endsWith('-packages')) {
    variants.add(slug.replace(/-packages$/, '-package'));
  }
  if (slug.endsWith('-package')) {
    variants.add(slug.replace(/-package$/, '-packages'));
  }

  if (slug.endsWith('s')) {
    variants.add(slug.slice(0, -1));
  } else if (slug) {
    variants.add(`${slug}s`);
  }

  return Array.from(variants);
};

exports.getDomesticPackages = async (req, res) => {
  const items = await DomesticPackage.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(items);
};

exports.getDomesticPackageBySlug = async (req, res) => {
  const slug = String(req.params.slug || '').toLowerCase();
  const slugVariants = buildSlugVariants(slug);

  let item = await DomesticPackage.findOne({
    slug: { $in: slugVariants },
    isActive: true
  });
  if (!item) {
    const fallback = await DomesticPackage.find({ isActive: true }).select('title slug');
    const match = fallback.find(entry => slugVariants.includes(slugify(entry.slug || entry.title)));
    if (match) {
      item = await DomesticPackage.findById(match._id);
    }
  }
  if (!item) {
    return res.status(404).json({ message: 'Package not found' });
  }
  return res.json(item);
};

exports.getPackageCategories = async (req, res) => {
  const items = await PackageCategory.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(items);
};

exports.getPackagesByCategory = async (req, res) => {
  const slug = String(req.params.slug || '').toLowerCase();
  const category = await PackageCategory.findOne({ slug, isActive: true });
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  const items = await DomesticPackage.find({
    isActive: true,
    categoryIds: category._id
  }).sort({ createdAt: -1 });
  return res.json({ category, packages: items });
};

exports.getPopularPackages = async (req, res) => {
  const items = await PopularPackage.find({ isActive: true })
    .populate('package')
    .sort({ sortOrder: 1, createdAt: -1 });
  const filtered = items.filter(item => item.package && item.package.isActive);
  // Return at most 8 popular packages
  res.json(filtered.slice(0, 8));
};


exports.getBlogs = async (req, res) => {
  const items = await Blog.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(items);
};

exports.getBlogBySlug = async (req, res) => {
  const slug = String(req.params.slug || '').toLowerCase();
  let item = await Blog.findOne({ slug, isActive: true });
  if (!item) {
    const fallback = await Blog.find({ isActive: true }).select('title slug');
    const match = fallback.find(entry => slugify(entry.slug || entry.title) === slug);
    if (match) {
      item = await Blog.findById(match._id);
    }
  }
  if (!item) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  return res.json(item);
};

exports.getNews = async (req, res) => {
  const items = await News.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(items);
};

exports.getGallery = async (req, res) => {
  const items = await GalleryItem.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(items);
};

exports.getReviews = async (req, res) => {
  const items = await Review.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(items);
};

exports.getCms = async (req, res) => {
  const doc = await CmsContent.findOne();
  res.json(doc || {});
};

const customCategories = [
  { key: 'honeymoon', label: 'Honeymoon Packages' },
  { key: 'yoga', label: 'Yoga Retreats' },
  { key: 'eco', label: 'Eco Tourism' },
  { key: 'spiritual', label: 'Spiritual Tours' }
];

exports.getCustomPackageCategories = async (req, res) => {
  const packages = await CustomPackage.find({ isActive: true }).sort({ createdAt: -1 });
  const categories = customCategories.map(category => {
    const match = packages.find(
      item => item.category === category.key && (item.imageUrl || item.images?.[0])
    );
    return {
      ...category,
      imageUrl: match ? (match.imageUrl || match.images?.[0] || '') : ''
    };
  });
  res.json(categories);
};

exports.getCustomPackages = async (req, res) => {
  const category = String(req.query.category || '').toLowerCase();
  const query = { isActive: true };
  if (category) {
    query.category = category;
  }
  const items = await CustomPackage.find(query).sort({ createdAt: -1 });
  res.json(items);
};

exports.getCustomPackageBySlug = async (req, res) => {
  const slug = String(req.params.slug || '').toLowerCase();
  const category = String(req.query.category || '').toLowerCase();

  const baseQuery = { isActive: true };
  if (category) {
    baseQuery.category = category;
  }

  let item = await CustomPackage.findOne({
    ...baseQuery,
    slug
  });

  if (!item) {
    const fallback = await CustomPackage.find(baseQuery).select('title slug');
    const match = fallback.find(entry => slugify(entry.slug || entry.title) === slug);
    if (match) {
      item = await CustomPackage.findById(match._id);
    }
  }

  if (!item) {
    return res.status(404).json({ message: 'Custom package not found' });
  }

  return res.json(item);
};

exports.getDestinations = async (req, res) => {
  const items = await Destination.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(items);
};

exports.getDestinationBySlug = async (req, res) => {
  const slug = String(req.params.slug || '').toLowerCase();
  let item = await Destination.findOne({ slug, isActive: true });
  if (!item) {
    const fallback = await Destination.find({ isActive: true }).select('name slug');
    const match = fallback.find(entry => slugify(entry.slug || entry.name) === slug);
    if (match) {
      item = await Destination.findById(match._id);
    }
  }
  if (!item) {
    return res.status(404).json({ message: 'Destination not found' });
  }
  return res.json(item);
};
