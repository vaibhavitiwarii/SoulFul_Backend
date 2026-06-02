const { db } = require('../config/firebase');

/**
 * Create a new document in Firestore
 * @param {string} collection - Firestore collection name
 * @param {object} data - Document data
 * @param {string} docId - (Optional) Custom document ID
 * @returns {Promise<string>} - Document ID
 */
const createDocument = async (collection, data, docId = null) => {
  try {
    const docRef = docId
      ? await db.collection(collection).doc(docId).set(data)
      : await db.collection(collection).add({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

    return docId || docRef.id;
  } catch (error) {
    throw new Error(`Error creating document: ${error.message}`);
  }
};

/**
 * Get a single document by ID
 * @param {string} collection - Firestore collection name
 * @param {string} docId - Document ID
 * @returns {Promise<object>} - Document data with ID
 */
const getDocument = async (collection, docId) => {
  try {
    const doc = await db.collection(collection).doc(docId).get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw new Error(`Error getting document: ${error.message}`);
  }
};

/**
 * Get all documents from a collection
 * @param {string} collection - Firestore collection name
 * @returns {Promise<array>} - Array of documents
 */
const getAllDocuments = async (collection) => {
  try {
    const snapshot = await db.collection(collection).get();
    const docs = [];

    snapshot.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() });
    });

    return docs;
  } catch (error) {
    throw new Error(`Error getting documents: ${error.message}`);
  }
};

/**
 * Query documents with conditions
 * @param {string} collection - Firestore collection name
 * @param {array} conditions - Array of conditions [field, operator, value]
 * @returns {Promise<array>} - Matching documents
 */
const queryDocuments = async (collection, conditions = []) => {
  try {
    let query = db.collection(collection);

    conditions.forEach(([field, operator, value]) => {
      query = query.where(field, operator, value);
    });

    const snapshot = await query.get();
    const docs = [];

    snapshot.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() });
    });

    return docs;
  } catch (error) {
    throw new Error(`Error querying documents: ${error.message}`);
  }
};

/**
 * Update a document
 * @param {string} collection - Firestore collection name
 * @param {string} docId - Document ID
 * @param {object} data - Update data
 * @returns {Promise<void>}
 */
const updateDocument = async (collection, docId, data) => {
  try {
    await db.collection(collection).doc(docId).update({
      ...data,
      updatedAt: new Date(),
    });
  } catch (error) {
    throw new Error(`Error updating document: ${error.message}`);
  }
};

/**
 * Delete a document
 * @param {string} collection - Firestore collection name
 * @param {string} docId - Document ID
 * @returns {Promise<void>}
 */
const deleteDocument = async (collection, docId) => {
  try {
    await db.collection(collection).doc(docId).delete();
  } catch (error) {
    throw new Error(`Error deleting document: ${error.message}`);
  }
};

/**
 * Batch write operations
 * @param {string} collection - Firestore collection name
 * @param {array} operations - Array of {type: 'set'|'update'|'delete', docId, data}
 * @returns {Promise<void>}
 */
const batchWrite = async (collection, operations) => {
  try {
    const batch = db.batch();

    operations.forEach(({ type, docId, data }) => {
      const docRef = db.collection(collection).doc(docId);

      switch (type) {
        case 'set':
          batch.set(docRef, { ...data, createdAt: new Date(), updatedAt: new Date() });
          break;
        case 'update':
          batch.update(docRef, { ...data, updatedAt: new Date() });
          break;
        case 'delete':
          batch.delete(docRef);
          break;
      }
    });

    await batch.commit();
  } catch (error) {
    throw new Error(`Error in batch write: ${error.message}`);
  }
};

module.exports = {
  createDocument,
  getDocument,
  getAllDocuments,
  queryDocuments,
  updateDocument,
  deleteDocument,
  batchWrite,
};
