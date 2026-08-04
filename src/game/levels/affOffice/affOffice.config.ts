import type { AffOfficeConfig } from './affOffice.types';

export const AFF_OFFICE_CONFIG: AffOfficeConfig = {
  world: { width: 640, height: 480 },
  playerSpawn: { x: 320, y: 390, facing: 'up' },
  walkableAreas: [{ x: 320, y: 270, width: 560, height: 330 }],
  collisionStructures: [
    { x: 320, y: 56, width: 640, height: 48 },
    { x: 24, y: 240, width: 48, height: 480 },
    { x: 616, y: 240, width: 48, height: 480 },
    { x: 320, y: 438, width: 640, height: 30 },
    { x: 320, y: 190, width: 350, height: 34 },
  ],
  clerk: { x: 320, y: 150, interactionX: 320, interactionY: 220, interactionRadius: 58 },
  exit: { x: 320, y: 405, interactionRadius: 48, interactionLabel: 'Salir a Retiro' },
};
