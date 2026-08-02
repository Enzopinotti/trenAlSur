import type { Season } from '@/game/config';
import type { TutorialStep } from '@/game/tutorial/retiroTutorial.types';

export interface PlayerSavePosition {
  x: number;
  y: number;
}

export interface GameStateV2 {
  version: 2;
  day: number;
  season: Season;
  tutorialStep: TutorialStep;
  player: PlayerSavePosition;
}

export type GameState = GameStateV2;

export interface SaveSlot {
  id: string;
  label: string;
  updatedAt: number;
  state: GameStateV2;
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
