# Firebase Integration Guide

## Setup Complete! 🎉

Your backend is now integrated with Firebase Firestore. Here's what has been set up:

### Files Created:

1. **`serviceAccountKey.json`** - Firebase credentials (⚠️ NEVER commit this file)
2. **`.env`** - Environment variables
3. **`src/config/firebase.js`** - Firebase initialization
4. **`src/utils/firebaseUtils.js`** - Utility functions for CRUD operations
5. **`src/models/tourPackageFirebaseModel.js`** - Example Firebase model
6. **`src/controller/tourPackageFirebaseController.js`** - Example Firebase controller
7. **`src/router/tourPackageFirebaseRouter.js`** - Example Firebase router

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Update server.js (or app.js)

Add Firebase config initialization at the top:

```javascript
require('dotenv').config();
require('./config/firebase'); // Initialize Firebase

// Rest of your code...
```

### 3. Use Firebase in Your Routes

Example: Add to your main router file:

```javascript
const tourPackageFirebaseRouter = require('./router/tourPackageFirebaseRouter');

// Use the router
app.use('/api/tour-packages-firebase', tourPackageFirebaseRouter);
```

---

## API Endpoints (Example)

### Create a new tour package
```http
POST /api/tour-packages-firebase
Content-Type: application/json

{
  "name": "Char Dham Yatra",
  "description": "Holy pilgrimage tour",
  "price": 25000,
  "categoryId": "cat-001",
  "duration": 12,
  "featured": true
}
```

### Get all tour packages
```http
GET /api/tour-packages-firebase
```

### Get single package
```http
GET /api/tour-packages-firebase/package-id-here
```

### Get featured packages
```http
GET /api/tour-packages-firebase/featured
```

### Get packages by category
```http
GET /api/tour-packages-firebase/category/cat-001
```

### Update a package
```http
PUT /api/tour-packages-firebase/package-id-here
Content-Type: application/json

{
  "price": 30000,
  "featured": false
}
```

### Delete a package
```http
DELETE /api/tour-packages-firebase/package-id-here
```

---

## Firebase Utilities Reference

### Import in Your Files

```javascript
const {
  createDocument,
  getDocument,
  getAllDocuments,
  queryDocuments,
  updateDocument,
  deleteDocument,
  batchWrite,
} = require('../utils/firebaseUtils');
```

### Usage Examples

#### Create Document
```javascript
const docId = await createDocument('tourPackages', {
  name: 'Himalayan Trek',
  price: 15000,
});
```

#### Get Single Document
```javascript
const package = await getDocument('tourPackages', 'package-id');
```

#### Get All Documents
```javascript
const allPackages = await getAllDocuments('tourPackages');
```

#### Query Documents
```javascript
const packages = await queryDocuments('tourPackages', [
  ['price', '>=', 10000],
  ['featured', '==', true],
]);
```

#### Update Document
```javascript
await updateDocument('tourPackages', 'package-id', {
  price: 20000,
  featured: false,
});
```

#### Delete Document
```javascript
await deleteDocument('tourPackages', 'package-id');
```

#### Batch Write
```javascript
await batchWrite('tourPackages', [
  { type: 'set', docId: 'pkg-1', data: { name: 'Package 1' } },
  { type: 'update', docId: 'pkg-2', data: { price: 25000 } },
  { type: 'delete', docId: 'pkg-3', data: {} },
]);
```

---

## Create Your Own Firebase Models

### Step 1: Create a Model File

Create `src/models/yourModelFirebaseModel.js`:

```javascript
const {
  createDocument,
  getDocument,
  getAllDocuments,
  queryDocuments,
  updateDocument,
  deleteDocument,
} = require('../utils/firebaseUtils');

const COLLECTION = 'yourCollection';

const createYourDocument = async (data) => {
  return await createDocument(COLLECTION, data);
};

const getYourDocument = async (docId) => {
  return await getDocument(COLLECTION, docId);
};

const getAllYourDocuments = async () => {
  return await getAllDocuments(COLLECTION);
};

const updateYourDocument = async (docId, updateData) => {
  return await updateDocument(COLLECTION, docId, updateData);
};

const deleteYourDocument = async (docId) => {
  return await deleteDocument(COLLECTION, docId);
};

module.exports = {
  createYourDocument,
  getYourDocument,
  getAllYourDocuments,
  updateYourDocument,
  deleteYourDocument,
};
```

### Step 2: Create a Controller

Create `src/controller/yourControllerFirebase.js` and use the model functions.

### Step 3: Create Routes

Create `src/router/yourRouterFirebase.js` and add your endpoints.

---

## Firebase Collection Structure

Your Firestore database collections:

```
soulful-backend/
├── tourPackages/
│   ├── pkg-001/
│   │   ├── name: "Char Dham Yatra"
│   │   ├── price: 25000
│   │   ├── categoryId: "cat-001"
│   │   ├── featured: true
│   │   ├── createdAt: 2024-06-02T...
│   │   └── updatedAt: 2024-06-02T...
│   └── ...
├── users/
├── bookings/
├── reviews/
└── ...
```

---

## Important Security Notes

⚠️ **DO NOT:**
- Commit `serviceAccountKey.json` to GitHub
- Share your credentials
- Expose API keys in code

✅ **DO:**
- Use `.env` for sensitive data
- Keep `serviceAccountKey.json` in `.gitignore`
- Use Firebase Security Rules for production
- Implement proper authentication/authorization

---

## Setting Firebase Security Rules

Go to **Firebase Console → Firestore → Rules** and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read all documents
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

---

## Migrating Existing MongoDB Models

If you want to migrate your existing Mongoose models to Firebase:

1. Create a new Firebase model file (using the pattern above)
2. Keep the old Mongoose model as backup
3. Create migration scripts if needed
4. Update controllers gradually
5. Test thoroughly before deploying

---

## Environment Variables

Your `.env` file contains:

```env
FIREBASE_PROJECT_ID=soulful-backend
NODE_ENV=production
PORT=3000
DATABASE_TYPE=firestore
JWT_SECRET=your_jwt_secret_key_change_this
```

**Generate a strong JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Next Steps

1. ✅ Firebase initialized
2. ✅ Utilities created
3. ✅ Example models/controllers created
4. ✅ Ready to deploy

Now:
- Integrate Firebase routes in your main app
- Test the example endpoints
- Migrate your existing data if needed
- Deploy to Render

---

## Troubleshooting

### "Cannot find module 'firebase-admin'"
```bash
npm install firebase-admin
```

### "serviceAccountKey.json not found"
- Make sure the file exists in the root directory
- Check `.env` if using alternate paths

### Firebase connection errors
- Verify Firestore is created in Firebase Console
- Check service account permissions
- Ensure credentials in `serviceAccountKey.json` are correct

### Permission denied errors
- Update Firebase Security Rules
- Verify admin SDK credentials

---

## Support

For more details, check:
- [Firebase Admin SDK Docs](https://firebase.google.com/docs/admin/setup)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security)
