import type { LocalInteractionConfig, StaticSpriteBodyConfig } from './worldEntity.types';

export interface AffOfficeExteriorConfig {
  x: number;
  y: number;
  scale: number;
  calibrationStatus: 'provisional' | 'validated';
  body: StaticSpriteBodyConfig;
  door: LocalInteractionConfig;
  returnPosition: {
    x: number;
    y: number;
    facing: 'down' | 'left' | 'right' | 'up';
  };
}
