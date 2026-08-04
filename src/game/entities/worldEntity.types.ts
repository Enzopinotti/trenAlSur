export interface StaticSpriteBodyConfig {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

export interface StaticWorldEntityConfig {
  scale: number;
  body: StaticSpriteBodyConfig;
  interactionOffsetY?: number;
}

export interface LocalInteractionConfig {
  localX: number;
  localY: number;
  interactionOffsetX: number;
  interactionOffsetY: number;
  interactionRadius: number;
  interactionLabel: string;
}
