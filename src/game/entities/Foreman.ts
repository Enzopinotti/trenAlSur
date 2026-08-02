import Phaser from 'phaser';
import { ASSET_KEYS, FOREMAN_SPRITESHEET } from '@/game/assets/assetKeys';
import { depthFromFeet } from '@/game/rendering/depth';

const FOREMAN_SCALE = 0.78;

const HITBOX_WIDTH = 20;
const HITBOX_HEIGHT = 12;
const HITBOX_OFFSET_X = (FOREMAN_SPRITESHEET.frameWidth - HITBOX_WIDTH) / 2;
const HITBOX_OFFSET_Y = 80;

export class Foreman extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    // frame 0 = quieto mirando hacia abajo
    super(scene, x, y, ASSET_KEYS.foremanSprite, 0);

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // objeto estático de física

    this.setScale(FOREMAN_SCALE);
    this.setOrigin(0.5, 1);

    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(HITBOX_WIDTH, HITBOX_HEIGHT);
    body.setOffset(HITBOX_OFFSET_X, HITBOX_OFFSET_Y);
    this.refreshBody();

    this.setDepth(depthFromFeet(this.y));
  }
}
