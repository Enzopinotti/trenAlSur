import type { Season } from '@/game/config';
import type { PlayerDirection } from '@/game/entities/Player';
import type { TutorialStep } from '@/game/tutorial/retiroTutorial.types';

export interface NewGameInitData {
  kind: 'newGame';
}

export interface LoadedGameInitData {
  kind: 'loadedGame';
  day: number;
  season: Season;
  tutorialStep: TutorialStep;
  player: { x: number; y: number };
}

export interface ReturnedFromAffOfficeData {
  kind: 'returnedFromAffOffice';
  day: number;
  season: Season;
  tutorialStep: TutorialStep;
  player: { x: number; y: number; facing: PlayerDirection };
}

export interface ReturnedFromTrainData {
  kind: 'returnedFromTrain';
  day: number;
  season: Season;
  tutorialStep: TutorialStep;
  player: { x: number; y: number; facing: PlayerDirection };
}

export type WorldSceneInitData = NewGameInitData | LoadedGameInitData | ReturnedFromAffOfficeData | ReturnedFromTrainData;

export function isWorldSceneInitData(value: unknown): value is WorldSceneInitData {
  if (!isRecord(value) || typeof value.kind !== 'string') return false;
  if (value.kind === 'newGame') return true;
  return isValidWorldState(value) && (value.kind === 'loadedGame' || value.kind === 'returnedFromAffOffice' || value.kind === 'returnedFromTrain');
}

function isValidWorldState(value: Record<string, unknown>): boolean {
  return typeof value.day === 'number'
    && typeof value.season === 'string'
    && typeof value.tutorialStep === 'string'
    && isRecord(value.player)
    && typeof value.player.x === 'number'
    && typeof value.player.y === 'number';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}
