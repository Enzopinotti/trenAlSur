import type { TrainCoachConfig } from '@/game/entities/trainCoach.types';
import type { StaticWorldEntityConfig } from '@/game/entities/worldEntity.types';
import type { Season } from '@/game/config';

export interface RetiroEntityConfig extends StaticWorldEntityConfig {
  x: number;
  y: number;
  interactionRadius: number;
  interactionLabel: string;
}

export interface RetiroRectConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type RetiroPropKind =
  | 'bench'
  | 'luggageCart'
  | 'scale'
  | 'mailCrates'
  | 'hangingLamp'
  | 'telegraph'
  | 'trackSignal'
  | 'luggagePile';

export interface RetiroPropConfig {
  kind: RetiroPropKind;
  x: number;
  y: number;
}

export interface RetiroSignConfig {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
}

export interface RetiroEnvironmentConfig {
  clock: { x: number; y: number };
  hall: RetiroRectConfig;
  platform: RetiroRectConfig;
  tracks: RetiroRectConfig;
  walkableAreas: readonly RetiroRectConfig[];
  collisionStructures: readonly RetiroRectConfig[];
  affOffice: RetiroRectConfig;
  columns: readonly { x: number; y: number }[];
  props: readonly RetiroPropConfig[];
  signs: readonly RetiroSignConfig[];
}

export interface RetiroConfig {
  world: {
    width: number;
    height: number;
  };
  playerSpawn: {
    x: number;
    y: number;
    facing: 'down' | 'left' | 'right' | 'up';
  };
  foreman: RetiroEntityConfig;
  affTerminal: RetiroEntityConfig;
  trainCoach: TrainCoachConfig;
  environment: RetiroEnvironmentConfig;
  camera: {
    lerpX: number;
    lerpY: number;
    deadzoneWidth: number;
    deadzoneHeight: number;
  };
  defaultSeason: Season;
}
