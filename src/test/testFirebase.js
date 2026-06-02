/**
 * Firebase Test Script
 * Run with: node src/test/testFirebase.js
 * This will insert sample data into Firestore
 */

require('dotenv').config();
const { db } = require('../config/firebase');
const {
  createDocument,
  getAllDocuments,
  queryDocuments,
} = require('../utils/firebaseUtils');

const testFirebase = async () => {
  try {
    console.log('🧪 Starting Firebase Test...\n');

    // Test 1: Create sample tour packages
    console.log('📝 Test 1: Creating sample tour packages...');
    const samplePackages = [
      {
        name: 'Char Dham Yatra',
        description: 'Holy pilgrimage tour to 4 sacred temples',
        price: 25000,
        categoryId: 'cat-001',
        duration: 12,
        featured: true,
      },
      {
        name: 'Himalayan Trek',
        description: 'Adventure trek in the Himalayas',
        price: 15000,
        categoryId: 'cat-002',
        duration: 7,
        featured: true,
      },
      {
        name: 'Kerala Backwaters Tour',
        description: 'Relaxing boat ride through Kerala backwaters',
        price: 18000,
        categoryId: 'cat-003',
        duration: 5,
        featured: false,
      },
    ];

    const insertedIds = [];
    for (const pkg of samplePackages) {
      const docId = await createDocument('tourPackages', pkg);
      insertedIds.push(docId);
      console.log(`✅ Created: ${pkg.name} (ID: ${docId})`);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Get all tour packages
    console.log('📖 Test 2: Fetching all tour packages...');
    const allPackages = await getAllDocuments('tourPackages');
    console.log(`✅ Found ${allPackages.length} packages:`);
    allPackages.forEach((pkg) => {
      console.log(`   - ${pkg.name} (₹${pkg.price}) - Duration: ${pkg.duration} days`);
    });

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Query featured packages
    console.log('📖 Test 3: Fetching featured packages...');
    const featuredPackages = await queryDocuments('tourPackages', [
      ['featured', '==', true],
    ]);
    console.log(`✅ Found ${featuredPackages.length} featured packages:`);
    featuredPackages.forEach((pkg) => {
      console.log(`   - ${pkg.name} (₹${pkg.price})`);
    });

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 4: Query packages by price
    console.log('📖 Test 4: Fetching packages under ₹20,000...');
    const affordablePackages = await queryDocuments('tourPackages', [
      ['price', '<', 20000],
    ]);
    console.log(`✅ Found ${affordablePackages.length} affordable packages:`);
    affordablePackages.forEach((pkg) => {
      console.log(`   - ${pkg.name} (₹${pkg.price})`);
    });

    console.log('\n' + '='.repeat(50) + '\n');

    console.log('🎉 All tests passed! Firebase is working correctly.\n');
    console.log('📌 Sample IDs created (use for further testing):');
    insertedIds.forEach((id, index) => {
      console.log(`   ${index + 1}. ${id}`);
    });

    console.log('\n✨ You can now:');
    console.log('   - Update: PUT /api/tour-packages-firebase/<id>');
    console.log('   - Delete: DELETE /api/tour-packages-firebase/<id>');
    console.log('   - Get: GET /api/tour-packages-firebase/<id>');

    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
};

// Run test
testFirebase();
