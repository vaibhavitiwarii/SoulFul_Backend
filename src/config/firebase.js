const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(
    require(path.join(__dirname, '../../serviceAccountKey.json'))
  ),
});

const db = admin.firestore();

// Set Firestore settings
db.settings({
  ignoreUndefinedProperties: true,
});

module.exports = { admin, db };
