import Phaser from 'phaser';
import { DEPTH } from '@/game/rendering/depth';
import type { AffOfficeConfig } from './affOffice.types';

export interface AffOfficeEnvironment {
  collisionGroup: Phaser.Physics.Arcade.StaticGroup;
  decorations: Phaser.GameObjects.GameObject[];
  ambientTweens: Phaser.Tweens.Tween[];
}

export function createAffOfficeEnvironment(scene: Phaser.Scene, config: AffOfficeConfig): AffOfficeEnvironment {
  const collisionGroup = scene.physics.add.staticGroup();
  const decorations: Phaser.GameObjects.GameObject[] = [];
  const ambientTweens: Phaser.Tweens.Tween[] = [];
  const background = scene.add.graphics().setDepth(DEPTH.background);
  background.fillStyle(0x45372d).fillRect(0, 0, config.world.width, config.world.height);
  background.fillStyle(0x84735b).fillRect(40, 80, 560, 350);
  background.fillStyle(0x5b4030).fillRect(145, 173, 350, 34);
  background.fillStyle(0x2e2926).fillRect(60, 90, 520, 18);
  decorations.push(background);
  for (const rect of config.collisionStructures) {
    collisionGroup.add(scene.add.rectangle(rect.x, rect.y, rect.width, rect.height, 0, 0));
  }
  const lamp = scene.add.circle(320, 105, 16, 0xf5cf78, 0.2).setDepth(DEPTH.structures);
  decorations.push(lamp);
  ambientTweens.push(scene.tweens.add({ targets: lamp, alpha: { from: 0.12, to: 0.28 }, duration: 1400, yoyo: true, repeat: -1 }));
  return { collisionGroup, decorations, ambientTweens };
}
