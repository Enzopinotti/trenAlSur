import { isSeason, type Season } from '@/game/config';
import type { PlayerDirection } from '@/game/entities/Player';
import { isTutorialStep, type TutorialStep } from '@/game/tutorial/retiroTutorial.types';

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
  if (!hasValidWorldState(value) || !isRecord(value.player)) return false;

  if (value.kind === 'loadedGame') {
    return hasPosition(value.player);
  }

  if (value.kind === 'returnedFromAffOffice' || value.kind === 'returnedFromTrain') {
    return hasPosition(value.player) && isDirection(value.player.facing);
  }

  return false;
}

function hasValidWorldState(value: Record<string, unknown>): boolean {
  return typeof value.day === 'number'
    && isSeason(value.season)
    && isTutorialStep(value.tutorialStep);
}

function hasPosition(value: Record<string, unknown>): boolean {
  return typeof value.x === 'number' && typeof value.y === 'number';
}

function isDirection(value: unknown): value is PlayerDirection {
  return value === 'down' || value === 'left' || value === 'right' || value === 'up';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}
