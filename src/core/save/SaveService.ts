import { openDB, DBSchema } from 'idb';
import type { SaveService as ISaveService, SaveSlot } from '@/types/contracts';

interface SaveDB extends DBSchema {
  slots: {
    key: string;
    value: SaveSlot;
    indexes: { 'by-updatedAt': number };
  };
}

const DB_NAME = 'estaciones-saves';
const DB_VERSION = 1;

export class SaveService implements ISaveService {
  private dbPromise = openDB<SaveDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore('slots', { keyPath: 'id' });
      store.createIndex('by-updatedAt', 'updatedAt');
    }
  });

  async list(): Promise<SaveSlot[]> {
    const db = await this.dbPromise;
    const tx = db.transaction('slots', 'readonly');
    const idx = tx.store.index('by-updatedAt');
    const all = await idx.getAll();
    await tx.done;
    return all.sort((a,b)=>b.updatedAt - a.updatedAt);
  }

  async load(id: string): Promise<SaveSlot | undefined> {
    const db = await this.dbPromise;
    const tx = db.transaction('slots', 'readonly');
    const data = await tx.store.get(id);
    await tx.done;
    return data ?? undefined;
  }

  async save(slot: SaveSlot): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction('slots', 'readwrite');
    await tx.store.put({ ...slot, updatedAt: Date.now() });
    await tx.done;
  }

  async delete(id: string): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction('slots', 'readwrite');
    await tx.store.delete(id);
    await tx.done;
  }
}

export const saveService = new SaveService();
