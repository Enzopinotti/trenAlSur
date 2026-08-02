import type { RetiroConfig } from './retiro.types';

export const RETIRO_CONFIG = {
  world: {
    width: 1200,
    height: 800,
  },
  playerSpawn: {
    x: 360,
    y: 440,
    facing: 'left',
  },
  foreman: {
    x: 240,
    y: 440,
    scale: 0.78,
    body: {
      width: 20,
      height: 12,
      offsetX: 22,
      offsetY: 80,
    },
    interactionRadius: 70,
    interactionLabel: 'Hablar con Capataz',
  },
  affTerminal: {
    x: 870,
    y: 340,
    scale: 0.72,
    body: {
      width: 48,
      height: 14,
      offsetX: 24,
      offsetY: 114,
    },
    interactionOffsetY: 26,
    interactionRadius: 52,
    interactionLabel: 'Consultar tablero AFF',
  },
  trainCoach: {
    x: 600,
    y: 650,
    scale: 1,
    // Derivado visualmente durante desarrollo; falta calibración humana con F2.
    calibrationStatus: 'provisional',
    body: {
      width: 576,
      height: 42,
      offsetX: 32,
      offsetY: 112,
    },
    door: {
      localX: -230,
      localY: -105,
      interactionRadius: 56,
      interactionLabel: 'Revisar puerta del tren',
    },
  },
  environment: {
    clock: { x: 600, y: 105 },
    hall: { x: 600, y: 240, width: 1100, height: 360 },
    platform: { x: 600, y: 480, width: 1100, height: 130 },
    tracks: { x: 600, y: 680, width: 1200, height: 240 },
    walkableAreas: [
      { x: 600, y: 240, width: 1100, height: 360 },
      { x: 600, y: 480, width: 1100, height: 130 },
    ],
    collisionStructures: [
      { x: 600, y: 35, width: 1200, height: 70 },
      { x: 25, y: 400, width: 50, height: 800 },
      { x: 1175, y: 400, width: 50, height: 800 },
      { x: 950, y: 210, width: 240, height: 180 },
      { x: 600, y: 700, width: 1200, height: 200 },
    ],
    affOffice: { x: 950, y: 210, width: 240, height: 180 },
    columns: [
      { x: 150, y: 320 },
      { x: 360, y: 320 },
      { x: 570, y: 320 },
      { x: 780, y: 320 },
    ],
    props: [
      { kind: 'bench', x: 450, y: 360 },
      { kind: 'bench', x: 670, y: 360 },
      { kind: 'luggageCart', x: 185, y: 370 },
      { kind: 'scale', x: 760, y: 270 },
      { kind: 'mailCrates', x: 790, y: 315 },
      { kind: 'hangingLamp', x: 520, y: 180 },
      { kind: 'telegraph', x: 760, y: 370 },
      { kind: 'trackSignal', x: 1050, y: 500 },
      { kind: 'luggagePile', x: 245, y: 365 },
    ],
    signs: [
      { text: 'RETIRO', x: 600, y: 88, fontSize: 18, color: '#f4e7c0' },
      { text: 'AFF', x: 950, y: 145, fontSize: 12, color: '#b6d8cc' },
      { text: '1', x: 95, y: 478, fontSize: 22, color: '#1f2d2d' },
      { text: '← EMBARQUE', x: 275, y: 505, fontSize: 11, color: '#332819' },
    ],
  },
  camera: {
    lerpX: 0.12,
    lerpY: 0.12,
    deadzoneWidth: 120,
    deadzoneHeight: 80,
  },
  defaultSeason: 'Primavera',
} as const satisfies RetiroConfig;
