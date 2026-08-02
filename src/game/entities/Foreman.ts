import Phaser from 'phaser';
import { ASSET_KEYS } from '@/game/assets/assetKeys';
import { depthFromFeet } from '@/game/rendering/depth';
import type { StaticWorldEntityConfig } from './worldEntity.types';

export class Foreman extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config: StaticWorldEntityConfig,
  ) {
    // frame 0 = quieto mirando hacia abajo
    super(scene, x, y, ASSET_KEYS.foremanSprite, 0);

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // objeto estático de física

    this.setScale(config.scale);
    this.setOrigin(0.5, 1);

    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(config.body.width, config.body.height);
    body.setOffset(config.body.offsetX, config.body.offsetY);
    this.refreshBody();

    this.setDepth(depthFromFeet(this.y));
  }
}
