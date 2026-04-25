// ═══════════════════════════════════════════════════════════════
//  TuDu Birthday — IndexedDB Utility Layer
//  Shared database between React frontend and Service Worker
// ═══════════════════════════════════════════════════════════════

const DB_NAME = 'TuDuBirthdays';
const DB_VERSION = 1;
const STORE_NAME = 'birthdays';

const generateId = () => `bd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ─── Open / Create Database ───────────────────────────────────
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('birthday', 'birthday', { unique: false });
        store.createIndex('category', 'category', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ─── Get All Birthdays ────────────────────────────────────────
export async function getAllBirthdays() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

// ─── Get Single Birthday ─────────────────────────────────────
export async function getBirthday(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ─── Add Birthday ─────────────────────────────────────────────
export async function addBirthday(record) {
  const db = await openDB();
  const entry = {
    id: record.id || generateId(),
    name: record.name || '',
    birthday: record.birthday || '', // "MM-DD" format
    year: record.year || null,        // birth year (optional, for age calc)
    category: record.category || 'Uncategorized',
    notes: record.notes || '',
    lastNotifiedYear: record.lastNotifiedYear || null,
    createdAt: record.createdAt || new Date().toISOString(),
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.add(entry);
    req.onsuccess = () => resolve(entry);
    req.onerror = () => reject(req.error);
  });
}

// ─── Update Birthday ──────────────────────────────────────────
export async function updateBirthday(id, updates) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const existing = getReq.result;
      if (!existing) return reject(new Error('Birthday not found'));
      const updated = { ...existing, ...updates, id };
      store.put(updated);
      resolve(updated);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

// ─── Delete Birthday ──────────────────────────────────────────
export async function deleteBirthday(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ─── Clear All ────────────────────────────────────────────────
export async function clearAllBirthdays() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ─── Export as JSON ───────────────────────────────────────────
export async function exportBirthdays() {
  const all = await getAllBirthdays();
  return JSON.stringify(all, null, 2);
}

// ─── Import from JSON ─────────────────────────────────────────
export async function importBirthdays(jsonArray, mode = 'merge') {
  const db = await openDB();

  if (mode === 'replace') {
    await clearAllBirthdays();
  }

  const existing = mode === 'merge' ? await getAllBirthdays() : [];
  const existingIds = new Set(existing.map(b => b.id));

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    let added = 0;
    let skipped = 0;

    jsonArray.forEach(record => {
      const entry = {
        id: record.id || generateId(),
        name: record.name || '',
        birthday: record.birthday || '',
        year: record.year || null,
        category: record.category || 'Uncategorized',
        notes: record.notes || '',
        lastNotifiedYear: record.lastNotifiedYear || null,
        createdAt: record.createdAt || new Date().toISOString(),
      };

      if (mode === 'merge' && existingIds.has(entry.id)) {
        store.put(entry); // Update existing
        skipped++;
      } else {
        // For merge with new id or replace mode
        if (mode === 'merge' && existingIds.has(entry.id)) {
          skipped++;
        } else {
          store.put(entry);
          added++;
        }
      }
    });

    tx.oncomplete = () => resolve({ added, skipped, total: jsonArray.length });
    tx.onerror = () => reject(tx.error);
  });
}

// ─── Get Unique Categories ────────────────────────────────────
export async function getCategories() {
  const all = await getAllBirthdays();
  const cats = new Set(all.map(b => b.category).filter(Boolean));
  return [...cats];
}

// ─── Trigger SW birthday check ────────────────────────────────
export function triggerSWCheck() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CHECK_BIRTHDAYS' });
  }
}
