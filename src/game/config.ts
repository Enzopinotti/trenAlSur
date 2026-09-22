export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const SEASONS = ['Primavera', 'Verano', 'Otoño', 'Invierno'] as const;
export type Season = (typeof SEASONS)[number];

export function isSeason(value: unknown): value is Season {
  return typeof value === 'string' && SEASONS.some((season) => season === value);
}

export const DEFAULT_STATE = {
  day: 1,
  season: 'Primavera' as Season,
};
