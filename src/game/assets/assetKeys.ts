export const ASSET_KEYS = {
  player: 'player',
  foremanSprite: 'foremanSprite',
  foremanPortrait: 'foremanPortrait',
  affTerminalIdle: 'affTerminalIdle',
  affTerminalActive: 'affTerminalActive',
  affTerminalConfirmed: 'affTerminalConfirmed',
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

export const AFF_TERMINAL_IMAGES = {
  idle: '/assets/stations/retiro/aff-terminal-idle.png',
  active: '/assets/stations/retiro/aff-terminal-active.png',
  confirmed: '/assets/stations/retiro/aff-terminal-confirmed.png',
} as const;
