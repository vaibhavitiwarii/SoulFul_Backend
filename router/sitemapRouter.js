const express = require('express');
const router = express.Router();

// Placeholder for dynamic content - import your models as needed
// const TourPackage = require('../models/tourPackageModel');
// const Blog = require('../models/blogModel');
// const Destination = require('../models/destinationModel');

// Generate dynamic sitemap
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'https://soulfulindiatours.com';
    
    // TODO: Fetch dynamic content from your models
    // const packages = await TourPackage.find({ status: 'active' });
    // const blogs = await Blog.find({ status: 'active' });
    // const destinations = await Destination.find({ status: 'active' });
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // Static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'weekly' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/packages', priority: '0.9', changefreq: 'weekly' },
      { url: '/destinations', priority: '0.9', changefreq: 'weekly' },
      { url: '/blogs', priority: '0.7', changefreq: 'daily' },
      { url: '/contact', priority: '0.6', changefreq: 'monthly' },
      { url: '/news', priority: '0.7', changefreq: 'weekly' }
    ];
    
    staticPages.forEach(page => {
      sitemap += `
      <url>
        <loc>${baseUrl}${page.url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
      </url>`;
    });
    
    // TODO: Add dynamic packages, blogs, destinations
    // packages.forEach(pkg => {
    //   sitemap += `
    //   <url>
    //     <loc>${baseUrl}/packages/${pkg.slug}</loc>
    //     <lastmod>${pkg.updatedAt || pkg.createdAt}</lastmod>
    //     <changefreq>monthly</changefreq>
    //     <priority>0.8</priority>
    //   </url>`;
    // });
    
    sitemap += `
    </urlset>`;
    
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
});

// Generate robots.txt
router.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || 'https://soulfulindiatours.com';
  
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /api
Disallow: /private

Sitemap: ${baseUrl}/sitemap.xml

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /`;

  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

module.exports = router;
