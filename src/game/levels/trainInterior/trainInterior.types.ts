import type { Season } from '@/game/config';
import type { TutorialStep } from '@/game/tutorial/retiroTutorial.types';
import type { PlayerDirection } from '@/game/entities/Player';

export interface TrainInteriorEntryData {
  day: number;
  season: Season;
  tutorialStep: TutorialStep;
  returnPosition: { x: number; y: number; facing: PlayerDirection };
}

export interface TrainInteriorRectConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TrainInteriorConfig {
  world: { width: number; height: number };
  playerSpawn: { x: number; y: number; facing: PlayerDirection };
  walkableAreas: readonly TrainInteriorRectConfig[];
  collisionStructures: readonly TrainInteriorRectConfig[];
  crew: { x: number; y: number; interactionX: number; interactionY: number; interactionRadius: number };
  exit: { x: number; y: number; interactionRadius: number; interactionLabel: string };
}

export function isTrainInteriorEntryData(value: unknown): value is TrainInteriorEntryData {
  if (!isRecord(value) || !isRecord(value.returnPosition)) return false;
  return typeof value.day === 'number'
    && typeof value.season === 'string'
    && typeof value.tutorialStep === 'string'
    && typeof value.returnPosition.x === 'number'
    && typeof value.returnPosition.y === 'number'
    && isDirection(value.returnPosition.facing);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function isDirection(value: unknown): value is PlayerDirection {
  return value === 'down' || value === 'left' || value === 'right' || value === 'up';
}
