const { db } = require('../src/config/firebase');

const clone = value => {
  if (value === undefined || value === null) return value;
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value.map(clone);
  if (typeof value === 'object') {
    if (typeof value.toDate === 'function') return value.toDate();
    const out = {};
    Object.entries(value).forEach(([key, item]) => {
      if (item !== undefined) out[key] = clone(item);
    });
    return out;
  }
  return value;
};

const normalizeId = value => String(value || '');

const matchesValue = (actual, expected) => {
  if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
    if (expected.$in) return expected.$in.map(String).includes(String(actual));
    if (expected.$ne !== undefined) return actual !== expected.$ne;
  }
  if (Array.isArray(actual)) return actual.map(String).includes(String(expected));
  return String(actual) === String(expected) || actual === expected;
};

const matchesQuery = (doc, query = {}) => Object.entries(query).every(([field, expected]) => {
  if (field === '_id' || field === 'id') return matchesValue(doc._id || doc.id, expected);
  return matchesValue(doc[field], expected);
});

class FirestoreQuery {
  constructor(model, query = {}, single = false) {
    this.model = model;
    this.query = query || {};
    this.single = single;
    this.sortSpec = null;
    this.limitCount = null;
    this.selectSpec = null;
    this.populateFields = [];
  }

  sort(spec) { this.sortSpec = spec; return this; }
  limit(count) { this.limitCount = Number(count); return this; }
  select(spec) { this.selectSpec = spec; return this; }
  populate(field) { this.populateFields.push(field); return this; }

  async exec() { return this._run(); }
  then(resolve, reject) { return this.exec().then(resolve, reject); }
  catch(reject) { return this.exec().catch(reject); }

  async _run() {
    let items = await this.model._all();
    items = items.filter(item => matchesQuery(item, this.query));

    if (this.sortSpec) {
      const entries = Object.entries(this.sortSpec);
      items.sort((a, b) => {
        for (const [field, dir] of entries) {
          const av = a[field];
          const bv = b[field];
          if (av === bv) continue;
          const direction = Number(dir) < 0 ? -1 : 1;
          if (av === undefined || av === null) return 1;
          if (bv === undefined || bv === null) return -1;
          return av > bv ? direction : -direction;
        }
        return 0;
      });
    }

    if (this.limitCount !== null) items = items.slice(0, this.limitCount);
    if (this.selectSpec) items = items.map(item => projectFields(item, this.selectSpec));
    if (this.populateFields.length) items = await Promise.all(items.map(item => populateItem(item, this.populateFields)));

    return this.single ? (items[0] || null) : items;
  }
}

const projectFields = (item, spec) => {
  const fields = String(spec).split(/\s+/).filter(Boolean);
  if (!fields.length) return item;
  const include = !fields[0].startsWith('-');
  if (include) {
    return fields.reduce((out, field) => {
      if (item[field] !== undefined) out[field] = item[field];
      return out;
    }, { _id: item._id, id: item.id });
  }
  const out = { ...item };
  fields.forEach(field => delete out[field.replace(/^-/, '')]);
  return out;
};

const populateMap = {
  package: 'domesticPackages',
  months: 'visitMonths',
  destinations: 'bestTimeDestinations',
  tourPackages: 'bestTimeTourPackages',
  destination: 'bestTimeDestinations'
};

const populateItem = async (item, fields) => {
  const out = { ...item };
  for (const field of fields) {
    const pathName = typeof field === 'string' ? field : field.path;
    const collection = populateMap[pathName];
    if (!collection || out[pathName] === undefined || out[pathName] === null) continue;
    if (Array.isArray(out[pathName])) {
      out[pathName] = await Promise.all(out[pathName].map(id => getByCollectionId(collection, id)));
    } else {
      out[pathName] = await getByCollectionId(collection, out[pathName]);
    }
  }
  return out;
};

const getByCollectionId = async (collection, id) => {
  const snap = await db.collection(collection).doc(normalizeId(id)).get();
  return snap.exists ? normalizeDoc(snap) : null;
};

const normalizeDoc = snap => {
  const data = clone(snap.data() || {});
  return { _id: snap.id, id: snap.id, ...data };
};

const withSave = (model, data) => Object.assign(data, {
  save: async function save() {
    const id = normalizeId(this._id || this.id);
    const payload = clone({ ...this });
    delete payload.save;
    delete payload._id;
    delete payload.id;
    payload.updatedAt = new Date();
    if (id) {
      await db.collection(model.collectionName).doc(id).set(payload, { merge: true });
      return withSave(model, { _id: id, id, ...payload });
    }
    return model.create(payload);
  }
});

const makeFirestoreModel = (modelName, collectionName) => {
  class FirestoreModel {
    constructor(data = {}) {
      Object.assign(this, clone(data));
    }

    async save() {
      return FirestoreModel.create(this);
    }

    static get modelName() { return modelName; }
    static get collectionName() { return collectionName; }

    static async _all() {
      const snapshot = await db.collection(collectionName).get();
      return snapshot.docs.map(doc => withSave(FirestoreModel, normalizeDoc(doc)));
    }

    static find(query = {}) { return new FirestoreQuery(FirestoreModel, query, false); }
    static findOne(query = {}) { return new FirestoreQuery(FirestoreModel, query, true); }

    static findById(id) {
      return {
        populateFields: [],
        populate(field) { this.populateFields.push(field); return this; },
        then(resolve, reject) { return this.exec().then(resolve, reject); },
        catch(reject) { return this.exec().catch(reject); },
        async exec() {
          const snap = await db.collection(collectionName).doc(normalizeId(id)).get();
          if (!snap.exists) return null;
          let doc = withSave(FirestoreModel, normalizeDoc(snap));
          if (this.populateFields.length) doc = await populateItem(doc, this.populateFields);
          return doc;
        }
      };
    }

    static async create(data) {
      const now = new Date();
      const payload = clone({ ...data, createdAt: data.createdAt || now, updatedAt: now });
      delete payload._id;
      delete payload.id;
      const ref = await db.collection(collectionName).add(payload);
      return withSave(FirestoreModel, { _id: ref.id, id: ref.id, ...payload });
    }

    static async insertMany(items = []) {
      const created = [];
      for (const item of items) created.push(await FirestoreModel.create(item));
      return created;
    }

    static async countDocuments(query = {}) {
      const items = await FirestoreModel.find(query);
      return items.length;
    }

    static findByIdAndUpdate(id, update = {}, options = {}) {
      const query = {
        populateFields: [],
        populate(field) { this.populateFields.push(field); return this; },
        then(resolve, reject) { return this.exec().then(resolve, reject); },
        catch(reject) { return this.exec().catch(reject); },
        async exec() {
          const ref = db.collection(collectionName).doc(normalizeId(id));
          const snap = await ref.get();
          if (!snap.exists) return null;
          const payload = clone({ ...update, updatedAt: new Date() });
          delete payload._id;
          delete payload.id;
          await ref.set(payload, { merge: true });
          const nextSnap = await ref.get();
          let doc = withSave(FirestoreModel, normalizeDoc(nextSnap));
          if (this.populateFields.length) doc = await populateItem(doc, this.populateFields);
          return options.new === false ? withSave(FirestoreModel, normalizeDoc(snap)) : doc;
        }
      };
      return query;
    }

    static async findByIdAndDelete(id) {
      const ref = db.collection(collectionName).doc(normalizeId(id));
      const snap = await ref.get();
      if (!snap.exists) return null;
      const doc = withSave(FirestoreModel, normalizeDoc(snap));
      await ref.delete();
      return doc;
    }

    static async bulkWrite(operations = []) {
      let modifiedCount = 0;
      for (const operation of operations) {
        if (!operation.updateOne) continue;
        const { filter = {}, update = {}, upsert = false } = operation.updateOne;
        const existing = await FirestoreModel.findOne(filter);
        const payload = clone(update.$set || update);
        if (existing) {
          await FirestoreModel.findByIdAndUpdate(existing._id, payload).exec();
          modifiedCount += 1;
        } else if (upsert) {
          await FirestoreModel.create(payload);
          modifiedCount += 1;
        }
      }
      return { modifiedCount, upsertedCount: modifiedCount };
    }
  }

  return FirestoreModel;
};

module.exports = makeFirestoreModel;
