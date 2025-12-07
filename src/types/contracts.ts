export type Season = 'Primavera' | 'Verano' | 'Otoño' | 'Invierno';

export interface GameState {
  version: number;
  day: number;
  season: Season;
  player?: {
    x: number;
    y: number;
    name: string;
  };
  flags?: Record<string, boolean>;
}

export interface SaveSlot {
  id: string;
  label: string;
  updatedAt: number;
  state: GameState;
}

export interface SaveService {
  list(): Promise<SaveSlot[]>;
  load(id: string): Promise<SaveSlot | undefined>;
  save(slot: SaveSlot): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface AssetManifest {
  images?: Array<{ key: string; url: string }>;
  audio?: Array<{ key: string; urls: string[] }>;
  atlases?: Array<{ key: string; textureURL: string; atlasURL: string }>;
}

export interface AudioBus {
  setMasterVolume(v: number): void;
  setMusicVolume(v: number): void;
  setFxVolume(v: number): void;
  playFx(key: string): void;
  playMusic(key: string, loop?: boolean): void;
  stopMusic(): void;
}

export type GameEvents =
  | 'save:completed'
  | 'save:failed'
  | 'world:day-ended'
  | 'ui:toast';
