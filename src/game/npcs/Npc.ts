import Phaser from 'phaser';
import type { NpcConfig } from './npc.types';
export class Npc extends Phaser.GameObjects.Container {
  readonly id: string;
  constructor(scene: Phaser.Scene, config: NpcConfig) { super(scene, config.x, config.y); this.id = config.id; scene.add.existing(this); }
}
