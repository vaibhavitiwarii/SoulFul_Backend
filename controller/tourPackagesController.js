const IndiaTourPackage = require('../models/indiaTourPackageModel');
const slugify = require('../utils/slugify');

const normalizeList = value => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean);
  }
  return String(value)
    .split(/\r?\n|,/)
    .map(item => item.trim())
    .filter(Boolean);
};

const normalizeItinerary = value => {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => ({
      day: Number(item.day) || undefined,
      title: item.title ? String(item.title).trim() : '',
      details: item.details ? String(item.details).trim() : ''
    }))
    .filter(item => item.day || item.title || item.details);
};

const buildPayload = body => {
  const slug = body.slug ? slugify(body.slug) : slugify(body.title);

  return {
    title: body.title,
    slug,
    category: body.category,
    location: body.location,
    duration: body.duration,
    price: body.price,
    currency: body.currency,
    shortDescription: body.shortDescription,
    longDescription: body.longDescription,
    itinerary: normalizeItinerary(body.itinerary),
    highlights: normalizeList(body.highlights),
    inclusions: normalizeList(body.inclusions),
    exclusions: normalizeList(body.exclusions),
    seo: {
      title: body?.seo?.title || body.metaTitle || '',
      description: body?.seo?.description || body.metaDescription || ''
    },
    images: Array.isArray(body.images)
      ? body.images
      : normalizeList(body.images),
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
    createdAt: body.createdAt
  };
};

exports.createTour = async (req, res) => {
  try {
    const payload = buildPayload(req.body || {});
    const tour = await IndiaTourPackage.create(payload);
    return res.status(201).json(tour);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A tour with this slug already exists' });
    }
    return res.status(400).json({ message: 'Failed to create tour package', details: error.message });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    const includeInactive = String(req.query.includeInactive || '').toLowerCase() === 'true';
    const query = includeInactive ? {} : { isActive: true };
    const tours = await IndiaTourPackage.find(query).sort({ createdAt: -1 });
    return res.json(tours);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch tours', details: error.message });
  }
};

exports.getTourBySlug = async (req, res) => {
  try {
    const slug = slugify(req.params.slug);
    const includeInactive = String(req.query.includeInactive || '').toLowerCase() === 'true';
    const query = includeInactive ? { slug } : { slug, isActive: true };
    const tour = await IndiaTourPackage.findOne(query);
    if (!tour) {
      return res.status(404).json({ message: 'Tour package not found' });
    }
    return res.json(tour);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch tour package', details: error.message });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const payload = buildPayload(req.body || {});
    const tour = await IndiaTourPackage.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    if (!tour) {
      return res.status(404).json({ message: 'Tour package not found' });
    }
    return res.json(tour);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A tour with this slug already exists' });
    }
    return res.status(400).json({ message: 'Failed to update tour package', details: error.message });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await IndiaTourPackage.findByIdAndDelete(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour package not found' });
    }
    return res.json({ message: 'Tour package deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete tour package', details: error.message });
  }
};