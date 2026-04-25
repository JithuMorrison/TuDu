// ═══════════════════════════════════════════════════════════════
//  TuDu Birthday Service Worker
//  Background birthday checking with multi-trigger redundancy
// ═══════════════════════════════════════════════════════════════

const DB_NAME = 'TuDuBirthdays';
const DB_VERSION = 1;
const STORE_NAME = 'birthdays';
const CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour

let lastCheckTime = 0;

// ─── IndexedDB helpers (SW-compatible, no external deps) ──────
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

function getAllBirthdays() {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  });
}

function updateLastNotified(id, year) {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const record = getReq.result;
        if (record) {
          record.lastNotifiedYear = year;
          store.put(record);
        }
        resolve();
      };
      getReq.onerror = () => reject(getReq.error);
    });
  });
}

// ─── Birthday check logic ─────────────────────────────────────
async function checkBirthdays() {
  try {
    const birthdays = await getAllBirthdays();
    if (!birthdays || birthdays.length === 0) return;

    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const todayStr = `${month}-${day}`;
    const currentYear = today.getFullYear();

    const todaysBirthdays = birthdays.filter(b =>
      b.birthday === todayStr && b.lastNotifiedYear !== currentYear
    );

    for (const b of todaysBirthdays) {
      const age = b.year ? currentYear - b.year : null;
      const ageText = age ? ` (turning ${age})` : '';

      await self.registration.showNotification('🎂 Birthday Reminder!', {
        body: `${b.name}'s birthday is today!${ageText}`,
        icon: '/TuDu/vite.svg',
        badge: '/TuDu/vite.svg',
        tag: `birthday-${b.id}-${currentYear}`,
        data: { id: b.id },
        requireInteraction: false,
      });

      await updateLastNotified(b.id, currentYear);
    }

    // Also check upcoming (tomorrow) for early heads-up
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tMonth = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
    const tDay = tomorrow.getDate().toString().padStart(2, '0');
    const tomorrowStr = `${tMonth}-${tDay}`;

    const tomorrowBirthdays = birthdays.filter(b =>
      b.birthday === tomorrowStr && b.lastNotifiedYear !== currentYear
    );

    if (tomorrowBirthdays.length > 0) {
      const names = tomorrowBirthdays.map(b => b.name).join(', ');
      await self.registration.showNotification('📅 Birthday Tomorrow!', {
        body: `${names} — Don't forget to wish them!`,
        tag: `birthday-tomorrow-${tomorrowStr}-${currentYear}`,
        requireInteraction: false,
      });
    }
  } catch (err) {
    console.error('[SW] Birthday check failed:', err);
  }
}

// ─── Debounced check (max once per hour) ──────────────────────
function debouncedCheck() {
  const now = Date.now();
  if (now - lastCheckTime >= CHECK_INTERVAL) {
    lastCheckTime = now;
    checkBirthdays();
  }
}

// ─── SW Lifecycle Events ──────────────────────────────────────

// Trigger 1: On install — skip waiting to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Trigger 2: On activate — run check immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.claim().then(() => {
      lastCheckTime = Date.now();
      return checkBirthdays();
    })
  );
});

// Trigger 3: On fetch — debounced check (wakes SW on navigation)
self.addEventListener('fetch', (event) => {
  debouncedCheck();
  // Don't intercept any requests, just pass through
});

// Trigger 4: On message — explicit check from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_BIRTHDAYS') {
    lastCheckTime = 0; // Force a fresh check
    checkBirthdays().then(() => {
      event.source.postMessage({ type: 'BIRTHDAYS_CHECKED' });
    });
  }
});

// Trigger 5: Notification click — open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      if (clients.length > 0) {
        clients[0].focus();
        clients[0].postMessage({ type: 'NAVIGATE_BIRTHDAYS' });
      } else {
        self.clients.openWindow('/TuDu/');
      }
    })
  );
});

// Trigger 6: Periodic interval while SW is alive
setInterval(() => {
  checkBirthdays();
}, CHECK_INTERVAL);
