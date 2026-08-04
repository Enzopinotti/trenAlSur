import type { Season } from '@/game/config';
import type { TutorialStep } from '@/game/tutorial/retiroTutorial.types';

export interface AffOfficeEntryData {
  day: number;
  season: Season;
  tutorialStep: TutorialStep;
  returnPosition: { x: number; y: number; facing: 'down' | 'left' | 'right' | 'up' };
}

export interface AffOfficeRectConfig { x: number; y: number; width: number; height: number; }

export interface AffOfficeConfig {
  world: { width: number; height: number };
  playerSpawn: { x: number; y: number; facing: 'down' | 'left' | 'right' | 'up' };
  walkableAreas: readonly AffOfficeRectConfig[];
  collisionStructures: readonly AffOfficeRectConfig[];
  clerk: { x: number; y: number; interactionX: number; interactionY: number; interactionRadius: number };
  exit: { x: number; y: number; interactionRadius: number; interactionLabel: string };
}

export function isAffOfficeEntryData(value: unknown): value is AffOfficeEntryData {
  if (!isRecord(value) || !isRecord(value.returnPosition)) return false;
  return typeof value.day === 'number'
    && typeof value.season === 'string'
    && typeof value.tutorialStep === 'string'
    && typeof value.returnPosition.x === 'number'
    && typeof value.returnPosition.y === 'number'
    && isDirection(value.returnPosition.facing);
}

function isRecord(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === 'object'; }
function isDirection(value: unknown): value is 'down' | 'left' | 'right' | 'up' {
  return value === 'down' || value === 'left' || value === 'right' || value === 'up';
}
