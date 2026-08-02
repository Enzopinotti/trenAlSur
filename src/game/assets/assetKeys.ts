export const ASSET_KEYS = {
  player: 'player',
  foremanSprite: 'foremanSprite',
  foremanPortrait: 'foremanPortrait',
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
