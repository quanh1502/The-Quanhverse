
// IndexedDB Wrapper Service
const DB_NAME = 'MindPalaceDB';
const DB_VERSION = 1;
const STORE_CAFE = 'cafe_shelves';
const STORE_AUDIO = 'audio_shelves';

// Initialize the Database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("IndexedDB error:", request.error);
      reject(request.error);
    };

    request.onsuccess = (event) => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores if they don't exist
      // keyPath 'id' assumes every shelf has a unique 'id'
      if (!db.objectStoreNames.contains(STORE_CAFE)) {
        db.createObjectStore(STORE_CAFE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_AUDIO)) {
        db.createObjectStore(STORE_AUDIO, { keyPath: 'id' });
      }
    };
  });
};

// Generic Save Function (Overwrites/Updates all items in a store)
export const saveToDB = async (storeName: string, data: any[]): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    // Clear old data first to ensure sync (simple approach for this app structure)
    // In a more complex app, we would update individual records.
    const clearRequest = store.clear();

    clearRequest.onsuccess = () => {
      // Add new items
      data.forEach(item => {
        store.put(item);
      });
    };

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

// Generic Load Function
export const loadFromDB = async (storeName: string): Promise<any[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };
    request.onerror = () => reject(request.error);
  });
};

export const DB_STORES = {
  CAFE: STORE_CAFE,
  AUDIO: STORE_AUDIO
};
