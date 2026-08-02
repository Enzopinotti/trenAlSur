import Phaser from 'phaser';
import { emitToast } from '@/core/events/bus';
import {
  ASSET_KEYS,
  PLAYER_SPRITESHEET,
  FOREMAN_SPRITESHEET,
  FOREMAN_PORTRAIT,
  AFF_TERMINAL_IMAGES,
} from '@/game/assets/assetKeys';

export default class PreloadScene extends Phaser.Scene {
  private progressBox!: Phaser.GameObjects.Rectangle;
  private progressBar!: Phaser.GameObjects.Rectangle;

  constructor() { super('PreloadScene'); }

  preload() {
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2 - 60, 'Cargando...', { fontSize: '24px', color: '#fff' }).setOrigin(0.5);
    this.progressBox = this.add.rectangle(width / 2, height / 2, 320, 24, 0x222222).setOrigin(0.5);
    this.progressBar = this.add.rectangle(width / 2 - 158, height / 2, 4, 16, 0x6cf7ff).setOrigin(0, 0.5);

    this.load.on('progress', (value: number) => {
      this.progressBar.width = 316 * value;
    });

    this.load.on('complete', () => {
      emitToast('Carga completa');
    });

    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      console.error(`[PreloadScene] No se pudo cargar el recurso: ${file.key} (${file.url})`);
      this.add.text(width / 2, height / 2 + 40, `Error: no se pudo cargar "${file.key}"`, {
        fontSize: '14px',
        color: '#ff6b6b',
      }).setOrigin(0.5);
    });

    // Spritesheet del jugador
    this.load.spritesheet(
      ASSET_KEYS.player,
      PLAYER_SPRITESHEET.url,
      {
        frameWidth: PLAYER_SPRITESHEET.frameWidth,
        frameHeight: PLAYER_SPRITESHEET.frameHeight,
      }
    );

    // Spritesheet del capataz
    this.load.spritesheet(
      ASSET_KEYS.foremanSprite,
      FOREMAN_SPRITESHEET.url,
      {
        frameWidth: FOREMAN_SPRITESHEET.frameWidth,
        frameHeight: FOREMAN_SPRITESHEET.frameHeight,
      }
    );

    // Retrato del capataz
    this.load.image(ASSET_KEYS.foremanPortrait, FOREMAN_PORTRAIT.url);

    this.load.image(ASSET_KEYS.affTerminalIdle, AFF_TERMINAL_IMAGES.idle);
    this.load.image(ASSET_KEYS.affTerminalActive, AFF_TERMINAL_IMAGES.active);
    this.load.image(ASSET_KEYS.affTerminalConfirmed, AFF_TERMINAL_IMAGES.confirmed);
  }

  create() {
    this.scene.start('MenuScene');
  }
}
