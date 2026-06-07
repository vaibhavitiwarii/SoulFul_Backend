const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
// Support both local file and environment variable
let serviceAccountKey;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  // For production (Render) - read from environment variable
  try {
    serviceAccountKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } catch (error) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_JSON environment variable:', error);
    process.exit(1);
  }
} else {
  // For local development - read from file
  try {
    serviceAccountKey = require(path.join(__dirname, '../../serviceAccountKey.json'));
  } catch (error) {
    serviceAccountKey = require(path.join(__dirname, '../../soulful-backend-firebase-adminsdk-fbsvc-6960dc5eae.json'));
  }
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });
}

const db = admin.firestore();

// Set Firestore settings
db.settings({
  ignoreUndefinedProperties: true,
});

console.log('✅ Firebase initialized successfully');

module.exports = { admin, db };
