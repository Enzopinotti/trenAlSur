import Phaser from 'phaser';
import type { TrainInteriorConfig } from './trainInterior.types';

export interface TrainInteriorEnvironment {
  collisionGroup: Phaser.Physics.Arcade.StaticGroup;
  ambientTweens: Phaser.Tweens.Tween[];
}

export function createTrainInteriorEnvironment(
  scene: Phaser.Scene,
  config: TrainInteriorConfig,
): TrainInteriorEnvironment {
  const collisionGroup = scene.physics.add.staticGroup();
  const ambientTweens: Phaser.Tweens.Tween[] = [];

  // Crear estructuras de colisión
  config.collisionStructures.forEach((structure) => {
    const rect = scene.add.rectangle(
      structure.x,
      structure.y,
      structure.width,
      structure.height,
      0x2a2a2a,
    );
    collisionGroup.add(rect);
  });

  // Crear piso del vagón
  const floor = scene.add.rectangle(
    config.world.width / 2,
    config.world.height / 2,
    config.world.width - 96,
    config.world.height - 120,
    0x4a4a4a,
  );
  floor.setStrokeStyle(2, 0x6a6a6a);

  // Crear asientos (geometría placeholder)
  const seatColor = 0x3a3a3a;
  const seatWidth = 120;
  const seatHeight = 40;
  const seatY = 220;

  for (let i = 0; i < 4; i++) {
    const seatX = 150 + i * 160;
    const seat = scene.add.rectangle(seatX, seatY, seatWidth, seatHeight, seatColor);
    seat.setStrokeStyle(1, 0x5a5a5a);
  }

  // Crear ventanas
  const windowColor = 0x87ceeb;
  const windowWidth = 80;
  const windowHeight = 60;
  const windowY = 150;

  for (let i = 0; i < 4; i++) {
    const windowX = 150 + i * 160;
    const window = scene.add.rectangle(windowX, windowY, windowWidth, windowHeight, windowColor, 0.5);
    window.setStrokeStyle(2, 0x5a5a5a);
  }

  // Crear techo
  const ceiling = scene.add.rectangle(
    config.world.width / 2,
    40,
    config.world.width - 96,
    80,
    0x3a3a3a,
  );
  ceiling.setStrokeStyle(2, 0x5a5a5a);

  return { collisionGroup, ambientTweens };
}
