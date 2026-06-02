const fs = require('fs');
const path = require('path');
const IndiaTourPackage = require('../models/indiaTourPackageModel');
const DomesticPackage = require('../models/domesticPackageModel');
const slugify = require('../utils/slugify');

const jsonPath = path.resolve(__dirname, '..', '..', '..', 'indiatours.json');

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

const stringifyAsLines = value => normalizeList(value).join('\n');

const stringifyItinerary = itinerary => {
  if (!Array.isArray(itinerary)) return '';
  return itinerary
    .map(item => {
      const day = item?.day ? `Day ${item.day}: ` : '';
      const title = item?.title ? String(item.title).trim() : '';
      const details = item?.details ? String(item.details).trim() : '';
      if (title && details) return `${day}${title} - ${details}`;
      return `${day}${title || details}`.trim();
    })
    .filter(Boolean)
    .join('\n');
};

const toIndiaTourDoc = item => {
  const slug = slugify(item.slug || item.title);
  const itinerary = Array.isArray(item.itinerary)
    ? item.itinerary
        .map(entry => ({
          day: Number(entry.day) || undefined,
          title: entry.title ? String(entry.title).trim() : '',
          details: entry.details ? String(entry.details).trim() : ''
        }))
        .filter(entry => entry.day || entry.title || entry.details)
    : [];

  return {
    title: item.title,
    slug,
    category: item.category || 'domestic',
    location: item.location || '',
    duration: item.duration || '',
    price: item.price || '',
    currency: item.currency || 'INR',
    shortDescription: item.shortDescription || '',
    longDescription: item.longDescription || '',
    itinerary,
    highlights: normalizeList(item.highlights),
    inclusions: normalizeList(item.inclusions),
    exclusions: normalizeList(item.exclusions),
    seo: {
      title: item?.seo?.title || '',
      description: item?.seo?.description || ''
    },
    images: Array.isArray(item.images) ? item.images : [],
    isActive: item.isActive !== false,
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
  };
};

const toDomesticDoc = item => ({
  title: item.title || '',
  slug: slugify(item.slug || item.title),
  country: 'India',
  shortDescription: item.shortDescription || '',
  description: item.longDescription || item.shortDescription || '',
  duration: item.duration || '',
  price: item.price || '',
  location: item.location || '',
  highlights: stringifyAsLines(item.highlights),
  itinerary: stringifyItinerary(item.itinerary),
  inclusions: stringifyAsLines(item.inclusions),
  exclusions: stringifyAsLines(item.exclusions),
  images: Array.isArray(item.images) ? item.images : [],
  metaTitle: item?.seo?.title || '',
  metaDescription: item?.seo?.description || '',
  enquireEnabled: true,
  isActive: item.isActive !== false,
  createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
});

const ensureSeedIndiaTours = async () => {
  try {
    if (!fs.existsSync(jsonPath)) {
      return;
    }

    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const cleanJson = raw
      .replace(/^\uFEFF/, '')
      .split(/\r?\n/)
      .filter(line => !line.trim().startsWith('//'))
      .join('\n');
    const parsed = JSON.parse(cleanJson);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return;
    }

    const indiaOps = parsed
      .filter(item => item && (item.slug || item.title))
      .map(item => {
        const doc = toIndiaTourDoc(item);
        return {
          updateOne: {
            filter: { slug: doc.slug },
            update: { $set: doc },
            upsert: true
          }
        };
      });

    if (indiaOps.length > 0) {
      await IndiaTourPackage.bulkWrite(indiaOps, { ordered: false });
    }

    const domesticOps = parsed
      .filter(item => item && (item.slug || item.title))
      .map(item => {
        const doc = toDomesticDoc(item);
        return {
          updateOne: {
            filter: { slug: doc.slug },
            // Keep domestic package data in sync with indiatours.json on every seed run.
            update: { $set: doc },
            upsert: true
          }
        };
      });

    if (domesticOps.length > 0) {
      await DomesticPackage.bulkWrite(domesticOps, { ordered: false });
    }
  } catch (error) {
    console.error('Failed to seed India tours from indiatours.json:', error.message);
  }
};

module.exports = { ensureSeedIndiaTours };