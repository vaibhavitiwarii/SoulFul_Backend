# Firebase Integration Guide

The backend now uses the existing routers, controllers, and model files for both MongoDB and Firestore.

There is no separate `/api/tour-packages-firebase` route anymore. Set `DATABASE_TYPE=firestore`, and the existing models export a Firestore-backed adapter instead of a Mongoose model.

## Runtime Setup

Use these environment variables on Render:

```env
DATABASE_TYPE=firestore
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
JWT_SECRET=your_secret
```

For local development, the Firebase config reads either:

```txt
serviceAccountKey.json
soulful-backend-firebase-adminsdk-fbsvc-6960dc5eae.json
```

## Existing Endpoints

Use the normal backend URLs:

```http
GET /api/tours
POST /api/tours
GET /api/public/destinations
POST /api/admin/destinations
GET /api/admin/blogs
POST /api/admin/blogs
```

The database changes underneath the existing controllers.

## How It Works

Each file in `models/` still defines the original Mongoose schema. At export time it checks:

```javascript
process.env.DATABASE_TYPE === 'firestore'
```

If true, it exports:

```javascript
require('../utils/firestoreModel')('ModelName', 'collectionName')
```

If false, it exports the original Mongoose model.

The compatibility adapter supports the controller methods used in this project:

```txt
create
insertMany
bulkWrite
find
findOne
findById
findByIdAndUpdate
findByIdAndDelete
countDocuments
sort
limit
select
populate
document.save()
```

## Important Notes

Firestore is schema-less, so the Mongoose schemas are not enforced in Firebase mode. Validation should happen in controllers if a field is required.

The old duplicate example files were removed:

```txt
src/models/tourPackageFirebaseModel.js
src/controller/tourPackageFirebaseController.js
src/router/tourPackageFirebaseRouter.js
```

Use the existing routes instead.
