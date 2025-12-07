import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '@/game/config';
import BootScene from '@/game/scenes/BootScene';
import PreloadScene from '@/game/scenes/PreloadScene';
import MenuScene from '@/game/scenes/MenuScene';
import WorldScene from '@/game/scenes/WorldScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#1e1e2f',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, PreloadScene, MenuScene, WorldScene],
};

new Phaser.Game(config);
