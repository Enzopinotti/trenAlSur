import type { TrainInteriorConfig } from './trainInterior.types';

export const TRAIN_INTERIOR_CONFIG: TrainInteriorConfig = {
  world: { width: 800, height: 600 },
  playerSpawn: { x: 400, y: 480, facing: 'up' },
  walkableAreas: [
    { x: 400, y: 300, width: 720, height: 240 },
  ],
  collisionStructures: [
    { x: 400, y: 56, width: 800, height: 48 },
    { x: 24, y: 300, width: 48, height: 600 },
    { x: 776, y: 300, width: 48, height: 600 },
    { x: 400, y: 528, width: 800, height: 72 },
    { x: 400, y: 200, width: 200, height: 34 },
  ],
  crew: { x: 400, y: 180, interactionX: 400, interactionY: 260, interactionRadius: 58 },
  exit: { x: 400, y: 500, interactionRadius: 48, interactionLabel: 'Salir a Retiro' },
};
