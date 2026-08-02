import Phaser from 'phaser';
import { ASSET_KEYS } from '@/game/assets/assetKeys';
import { DEPTH } from '@/game/rendering/depth';
import type { TrainCoachConfig } from './trainCoach.types';

export class TrainCoach extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    private readonly config: TrainCoachConfig,
  ) {
    super(scene, config.x, config.y, ASSET_KEYS.trainSouthCoach);

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.setOrigin(0.5, 1);
    this.setScale(config.scale);

    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(config.body.width, config.body.height);
    body.setOffset(config.body.offsetX, config.body.offsetY);
    this.refreshBody();

    this.setDepth(DEPTH.railwayStructure);
  }

  getDoorInteractionPoint(): Readonly<{ x: number; y: number }> {
    return {
      x: this.x + this.config.door.localX * this.scaleX,
      y: this.y + this.config.door.localY * this.scaleY,
    };
  }
}
