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
