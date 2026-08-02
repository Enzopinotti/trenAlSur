import Phaser from 'phaser';
import { ASSET_KEYS, PLAYER_SPRITESHEET } from '@/game/assets/assetKeys';
import { depthFromFeet } from '@/game/rendering/depth';

export type PlayerDirection = 'down' | 'left' | 'right' | 'up';

const ANIM_KEYS: Record<PlayerDirection, string> = {
  down: 'player-walk-down',
  left: 'player-walk-left',
  right: 'player-walk-right',
  up: 'player-walk-up',
};

const IDLE_FRAMES: Record<PlayerDirection, number> = {
  down: 0,
  left: 3,
  right: 6,
  up: 9,
};

// Escala visual: 64 × 96 px * 0.72 ≈ 46 × 69 px visibles (proporcional al mapa)
const PLAYER_SCALE = 0.72;

// Hitbox alrededor de los pies: 22 × 18 px, desplazado al tercio inferior del sprite
const HITBOX_WIDTH = 22;
const HITBOX_HEIGHT = 18;
const HITBOX_OFFSET_X = (PLAYER_SPRITESHEET.frameWidth - HITBOX_WIDTH) / 2; // ~21
const HITBOX_OFFSET_Y = PLAYER_SPRITESHEET.frameHeight - HITBOX_HEIGHT - 4; // ~74

export function registerPlayerAnimations(scene: Phaser.Scene): void {
  const frames = (seq: number[]) =>
    seq.map((f) => ({ key: ASSET_KEYS.player, frame: f }));

  const anims: Array<{ key: string; frames: number[]; frameRate: number; repeat: number }> = [
    { key: ANIM_KEYS.down,  frames: [0, 1, 0, 2], frameRate: 8, repeat: -1 },
    { key: ANIM_KEYS.left,  frames: [3, 4, 3, 5], frameRate: 8, repeat: -1 },
    { key: ANIM_KEYS.right, frames: [6, 7, 6, 8], frameRate: 8, repeat: -1 },
    { key: ANIM_KEYS.up,    frames: [9, 10, 9, 11], frameRate: 8, repeat: -1 },
  ];

  for (const cfg of anims) {
    if (!scene.anims.exists(cfg.key)) {
      scene.anims.create({
        key: cfg.key,
        frames: frames(cfg.frames),
        frameRate: cfg.frameRate,
        repeat: cfg.repeat,
      });
    }
  }
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  private direction: PlayerDirection = 'down';
  private lastRenderedDepth?: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // frame 0 = idle abajo
    super(scene, x, y, ASSET_KEYS.player, 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(PLAYER_SCALE);
    // El origen en (0.5, 1) hace que la posición lógica del objeto sea los pies
    this.setOrigin(0.5, 1);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setSize(HITBOX_WIDTH, HITBOX_HEIGHT);
    body.setOffset(HITBOX_OFFSET_X, HITBOX_OFFSET_Y);

    this.updateRenderedDepth();
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.updateRenderedDepth();
  }

  move(input: { x: number; y: number }, speed: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(input.x * speed, input.y * speed);

    // Elegir dirección y animación
    // Prioridad vertical sobre horizontal para diagonal
    let dir: PlayerDirection;
    if (input.y < 0) {
      dir = 'up';
    } else if (input.y > 0) {
      dir = 'down';
    } else if (input.x < 0) {
      dir = 'left';
    } else {
      dir = 'right';
    }

    this.direction = dir;
    const animKey = ANIM_KEYS[dir];

    // No reiniciar si ya se está reproduciendo la misma animación
    if (this.anims.currentAnim?.key !== animKey) {
      this.play(animKey);
    }
  }

  freeze(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    this.anims.stop();
    this.setFrame(IDLE_FRAMES[this.direction]);
  }

  face(direction: PlayerDirection): void {
    this.direction = direction;
    this.anims.stop();
    this.setFrame(IDLE_FRAMES[direction]);
  }

  getDirection(): PlayerDirection {
    return this.direction;
  }

  private updateRenderedDepth(): void {
    const nextDepth = depthFromFeet(this.y);
    if (nextDepth === this.lastRenderedDepth) return;

    this.lastRenderedDepth = nextDepth;
    this.setDepth(nextDepth);
  }
}
