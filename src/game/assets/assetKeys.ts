export const ASSET_KEYS = {
  player: 'player',
  foremanSprite: 'foremanSprite',
  foremanPortrait: 'foremanPortrait',
  affOfficeExterior: 'affOfficeExterior',
  trainSouthCoach: 'trainSouthCoach',
} as const;

export const PLAYER_SPRITESHEET = {
  url: '/assets/characters/player/player.png',
  frameWidth: 64,
  frameHeight: 96,
} as const;

export const FOREMAN_SPRITESHEET = {
  url: '/assets/characters/foreman/foreman.png',
  frameWidth: 64,
  frameHeight: 96,
} as const;

export const FOREMAN_PORTRAIT = {
  url: '/assets/portraits/foreman.png',
} as const;

export const AFF_OFFICE_EXTERIOR_IMAGE = {
  url: '/assets/stations/retiro/aff-office-exterior.png',
} as const;

export const TRAIN_SOUTH_COACH_IMAGE = {
  url: '/assets/trains/tren-al-sur/coach-exterior.png',
} as const;
