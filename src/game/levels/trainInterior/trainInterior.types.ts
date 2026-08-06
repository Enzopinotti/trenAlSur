import type { Season } from '@/game/config';
import type { TutorialStep } from '@/game/tutorial/retiroTutorial.types';
import type { PlayerDirection } from '@/game/entities/Player';

export interface TrainInteriorEntryData {
  kind: 'enterTrain';
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

export interface TrainInteriorDimensions {
  workbench: { width: number; height: number };
  toolCabinet: { width: number; height: number };
  smallTable: { width: number; height: number };
  map: { width: number; height: number };
  telegraph: { width: number; height: number };
  window: { width: number; height: number };
  lamp: { width: number; height: number };
  cargoCrate: { width: number; height: number };
  mate: { width: number; height: number };
}

export interface TrainInteriorConfig {
  world: { width: number; height: number };
  playerSpawn: { x: number; y: number; facing: PlayerDirection };
  walkableAreas: readonly TrainInteriorRectConfig[];
  collisionStructures: readonly TrainInteriorRectConfig[];
  sofia: { x: number; y: number; interactionX: number; interactionY: number; interactionRadius: number };
  exit: { x: number; y: number; interactionRadius: number; interactionLabel: string };
  elements: {
    workbench: { x: number; y: number };
    toolCabinet: { x: number; y: number };
    smallTable: { x: number; y: number };
    map: { x: number; y: number };
    telegraph: { x: number; y: number };
    windows: Array<{ x: number; y: number }>;
    lamp: { x: number; y: number };
    cargoCrate: { x: number; y: number };
    mate: { x: number; y: number };
  };
  dimensions: TrainInteriorDimensions;
}

export function isTrainInteriorEntryData(value: unknown): value is TrainInteriorEntryData {
  if (!isRecord(value) || !isRecord(value.returnPosition)) return false;
  return value.kind === 'enterTrain'
    && typeof value.day === 'number'
    && typeof value.season === 'string'
    && value.tutorialStep !== undefined
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
