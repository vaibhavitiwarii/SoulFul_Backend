const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('../src/db');
const { ensureSeedIndiaTours } = require('../controller/indiaToursSeed');
const IndiaTourPackage = require('../models/indiaTourPackageModel');
const DomesticPackage = require('../models/domesticPackageModel');

const slugify = value =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const getJsonSeedSlugs = () => {
  const jsonPath = path.resolve(__dirname, '..', '..', '..', 'indiatours.json');
  if (!fs.existsSync(jsonPath)) {
    return [];
  }

  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const cleanJson = raw
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter(line => !line.trim().startsWith('//'))
    .join('\n');

  const parsed = JSON.parse(cleanJson);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map(item => slugify(item?.slug || item?.title))
    .filter(Boolean);
};

const run = async () => {
  try {
    await connectDB();
    await ensureSeedIndiaTours();

    const indiaCount = await IndiaTourPackage.countDocuments();
    const seededSlugs = getJsonSeedSlugs();
    const domesticSeedCount = await DomesticPackage.countDocuments({
      slug: { $in: seededSlugs }
    });

    console.log(`IndiaTourPackage count: ${indiaCount}`);
    console.log(`DomesticPackage seeded slugs count: ${domesticSeedCount}/${seededSlugs.length}`);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
