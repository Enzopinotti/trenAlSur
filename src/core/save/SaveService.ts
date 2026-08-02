import { openDB, type DBSchema } from 'idb';
import { migrateSaveState } from '@/game/save/migrateSaveState';
import type { SaveService as ISaveService, SaveSlot } from '@/types/contracts';

interface StoredSaveSlot {
  id: string;
  label: string;
  updatedAt: number;
  state: unknown;
}

interface SaveDB extends DBSchema {
  slots: {
    key: string;
    value: StoredSaveSlot;
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
    },
  });

  async list(): Promise<SaveSlot[]> {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction('slots', 'readonly');
      const slots = await tx.store.index('by-updatedAt').getAll();
      await tx.done;
      return slots
        .map((slot) => this.restoreSlot(slot))
        .sort((first, second) => second.updatedAt - first.updatedAt);
    } catch (error: unknown) {
      console.error('[SaveService] No se pudo listar las partidas:', error);
      throw error;
    }
  }

  async load(id: string): Promise<SaveSlot | undefined> {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction('slots', 'readonly');
      const slot = await tx.store.get(id);
      await tx.done;
      return slot ? this.restoreSlot(slot) : undefined;
    } catch (error: unknown) {
      console.error('[SaveService] No se pudo cargar la partida:', error);
      throw error;
    }
  }

  async save(slot: SaveSlot): Promise<void> {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction('slots', 'readwrite');
      await tx.store.put({ ...slot, updatedAt: Date.now() });
      await tx.done;
    } catch (error: unknown) {
      console.error('[SaveService] No se pudo guardar la partida:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction('slots', 'readwrite');
    await tx.store.delete(id);
    await tx.done;
  }

  private restoreSlot(slot: StoredSaveSlot): SaveSlot {
    return {
      id: slot.id,
      label: slot.label,
      updatedAt: slot.updatedAt,
      state: migrateSaveState(slot.state),
    };
  }
}

export const saveService = new SaveService();
