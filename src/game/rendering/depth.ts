export const DEPTH = {
  background: -1000,
  ground: -900,
  structures: -500,
  railwayStructure: -400,
  worldSortedBase: 0,
  worldLabels: 1000,
  hud: 2000,
  interactionPrompt: 2100,
  dialogue: 2200,
  debug: 3000,
} as const;

export function depthFromFeet(feetY: number, offset = 0): number {
  return DEPTH.worldSortedBase + Math.round(feetY) + offset;
}
