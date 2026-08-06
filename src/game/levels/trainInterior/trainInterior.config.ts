import type { TrainInteriorConfig } from './trainInterior.types';

export const TRAIN_INTERIOR_CONFIG: TrainInteriorConfig = {
  world: { width: 800, height: 600 },
  playerSpawn: { x: 400, y: 480, facing: 'up' },
  walkableAreas: [
    { x: 400, y: 320, width: 720, height: 200 },
  ],
  collisionStructures: [
    { x: 400, y: 48, width: 800, height: 64 },
    { x: 24, y: 300, width: 48, height: 600 },
    { x: 776, y: 300, width: 48, height: 600 },
    { x: 400, y: 536, width: 800, height: 64 },
    { x: 200, y: 160, width: 120, height: 80 },
    { x: 620, y: 160, width: 120, height: 80 },
    { x: 400, y: 120, width: 100, height: 60 },
  ],
  sofia: { x: 320, y: 280, interactionX: 320, interactionY: 340, interactionRadius: 58 },
  exit: { x: 400, y: 520, interactionRadius: 48, interactionLabel: 'Salir a Retiro' },
  elements: {
    workbench: { x: 200, y: 160 },
    toolCabinet: { x: 620, y: 160 },
    smallTable: { x: 400, y: 120 },
    map: { x: 400, y: 120 },
    telegraph: { x: 650, y: 120 },
    windows: [
      { x: 200, y: 200 },
      { x: 600, y: 200 },
    ],
    lamp: { x: 400, y: 80 },
    cargoCrate: { x: 550, y: 350 },
    mate: { x: 400, y: 120 },
  },
  dimensions: {
    workbench: { width: 120, height: 80 },
    toolCabinet: { width: 120, height: 80 },
    smallTable: { width: 100, height: 60 },
    map: { width: 80, height: 50 },
    telegraph: { width: 60, height: 40 },
    window: { width: 80, height: 60 },
    lamp: { width: 40, height: 40 },
    cargoCrate: { width: 60, height: 50 },
    mate: { width: 20, height: 20 },
  },
};
