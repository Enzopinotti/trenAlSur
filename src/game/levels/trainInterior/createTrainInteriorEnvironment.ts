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

  const dim = config.dimensions;
  const elements = config.elements;

  // Crear estructuras de colisión (paredes y muebles grandes)
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

  // Piso del vagón - madera oscura aceitada
  const floor = scene.add.rectangle(
    config.world.width / 2,
    config.world.height / 2,
    config.world.width - 96,
    config.world.height - 120,
    0x4a3728,
  );
  floor.setStrokeStyle(2, 0x3a2718);

  // Techo del vagón - metal oscuro
  const ceiling = scene.add.rectangle(
    config.world.width / 2,
    48,
    config.world.width - 96,
    96,
    0x2a2a2a,
  );
  ceiling.setStrokeStyle(2, 0x1a1a1a);

  // Banco de trabajo de Sofía - madera gastada con manchas de grasa
  const workbench = scene.add.rectangle(
    elements.workbench.x,
    elements.workbench.y,
    dim.workbench.width,
    dim.workbench.height,
    0x5c4033,
  );
  workbench.setStrokeStyle(2, 0x3a2718);

  // Armario de herramientas - metal con cajones
  const toolCabinet = scene.add.rectangle(
    elements.toolCabinet.x,
    elements.toolCabinet.y,
    dim.toolCabinet.width,
    dim.toolCabinet.height,
    0x4a4a4a,
  );
  toolCabinet.setStrokeStyle(2, 0x2a2a2a);

  // Mesa pequeña - madera clara
  const smallTable = scene.add.rectangle(
    elements.smallTable.x,
    elements.smallTable.y,
    dim.smallTable.width,
    dim.smallTable.height,
    0x8b7355,
  );
  smallTable.setStrokeStyle(1, 0x5c4033);

  // Mapa de ruta Buenos Aires → Arequipa - papel amarillento
  const map = scene.add.rectangle(
    elements.map.x,
    elements.map.y,
    dim.map.width,
    dim.map.height,
    0xd4c4a8,
  );
  map.setStrokeStyle(1, 0x8b7355);

  // Telégrafo - latón oscuro
  const telegraph = scene.add.rectangle(
    elements.telegraph.x,
    elements.telegraph.y,
    dim.telegraph.width,
    dim.telegraph.height,
    0xb8860b,
  );
  telegraph.setStrokeStyle(1, 0x8b6914);

  // Ventanas - luz fría desde el andén
  const windowColor = 0x87ceeb;
  elements.windows.forEach((windowPos) => {
    const window = scene.add.rectangle(
      windowPos.x,
      windowPos.y,
      dim.window.width,
      dim.window.height,
      windowColor,
      0.4,
    );
    window.setStrokeStyle(2, 0x5a5a5a);
  });

  // Lámpara principal - luz cálida interior
  const lamp = scene.add.rectangle(
    elements.lamp.x,
    elements.lamp.y,
    dim.lamp.width,
    dim.lamp.height,
    0xffd700,
    0.6,
  );
  lamp.setStrokeStyle(1, 0xdaa520);

  // Baúl marcado "Proyecto Aurora" - madera reforzada
  const cargoCrate = scene.add.rectangle(
    elements.cargoCrate.x,
    elements.cargoCrate.y,
    dim.cargoCrate.width,
    dim.cargoCrate.height,
    0x654321,
  );
  cargoCrate.setStrokeStyle(2, 0x3a2718);

  // Mate sobre la mesa - calabaza verde
  const mate = scene.add.rectangle(
    elements.mate.x,
    elements.mate.y,
    dim.mate.width,
    dim.mate.height,
    0x228b22,
  );
  mate.setStrokeStyle(1, 0x006400);

  return { collisionGroup, ambientTweens };
}
