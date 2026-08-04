import Phaser from 'phaser';
import { DEPTH } from '@/game/rendering/depth';
import type {
  RetiroEnvironmentConfig,
  RetiroPropConfig,
  RetiroRectConfig,
} from './retiro.types';

const COLORS = {
  stone: 0x59615f,
  hall: 0xc7baa0,
  tileLine: 0xa99779,
  platform: 0x847a68,
  platformEdge: 0xc5923e,
  ballast: 0x343738,
  rail: 0x1e292b,
  sleeper: 0x60472e,
  iron: 0x273336,
  wood: 0x6a4930,
  brass: 0xb68a43,
  oxblood: 0x6f382c,
  aff: 0x477b78,
  affDark: 0x244846,
  warmLight: 0xf4ca70,
} as const;

export interface RetiroEnvironment {
  collisionGroup: Phaser.Physics.Arcade.StaticGroup;
  decorations: Phaser.GameObjects.GameObject[];
  ambientTweens: Phaser.Tweens.Tween[];
}

export function createRetiroEnvironment(
  scene: Phaser.Scene,
  config: RetiroEnvironmentConfig,
  world: Readonly<{ width: number; height: number }>,
): RetiroEnvironment {
  const collisionGroup = scene.physics.add.staticGroup();
  const decorations: Phaser.GameObjects.GameObject[] = [];
  const ambientTweens: Phaser.Tweens.Tween[] = [];

  const ground = scene.add.graphics().setDepth(DEPTH.background);
  ground.fillStyle(COLORS.stone).fillRect(0, 0, world.width, world.height);
  drawRect(ground, config.hall, COLORS.hall);
  drawRect(ground, config.platform, COLORS.platform);
  drawRect(ground, config.tracks, COLORS.ballast);
  drawHallTiles(ground, config.hall);
  drawPlatform(ground, config.platform);
  drawTracks(ground, config.tracks);
  decorations.push(ground);

  const structures = scene.add.graphics().setDepth(DEPTH.structures);
  drawMarqueeShadow(structures, config.hall);
  for (const column of config.columns) {
    drawColumn(structures, column.x, column.y);
  }
  for (const prop of config.props) {
    drawProp(structures, prop);
  }
  decorations.push(structures);

  for (const structure of config.collisionStructures) {
    const collider = scene.add.rectangle(
      structure.x,
      structure.y,
      structure.width,
      structure.height,
      0x000000,
      0,
    );
    collisionGroup.add(collider);
  }

  for (const sign of config.signs) {
    const signObject = scene.add
      .text(sign.x, sign.y, sign.text, {
        fontSize: `${sign.fontSize}px`,
        color: sign.color,
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.structures + 1);
    decorations.push(signObject);
  }

  const clockFace = scene.add.circle(config.clock.x, config.clock.y, 16, 0xf0e4be).setDepth(DEPTH.structures + 1);
  const clockRim = scene.add.circle(config.clock.x, config.clock.y, 18, COLORS.iron).setDepth(DEPTH.structures);
  const clockHand = scene.add.graphics()
    .setPosition(config.clock.x, config.clock.y)
    .setDepth(DEPTH.structures + 2);
  clockHand.lineStyle(2, COLORS.iron).lineBetween(0, 0, 0, -10);
  decorations.push(clockRim, clockFace, clockHand);

  const lamp = config.props.find((prop) => prop.kind === 'hangingLamp');
  const lampGlow = scene.add.circle(
    lamp?.x ?? config.hall.x,
    (lamp?.y ?? config.hall.y) + 8,
    20,
    COLORS.warmLight,
    0.16,
  ).setDepth(DEPTH.structures + 1);
  decorations.push(lampGlow);
  ambientTweens.push(
    scene.tweens.add({
      targets: lampGlow,
      alpha: { from: 0.1, to: 0.28 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
    }),
    scene.tweens.add({
      targets: clockHand,
      angle: 360,
      duration: 60000,
      repeat: -1,
    }),
  );

  return { collisionGroup, decorations, ambientTweens };
}

function drawRect(graphics: Phaser.GameObjects.Graphics, rect: RetiroRectConfig, color: number): void {
  graphics.fillStyle(color).fillRect(
    rect.x - rect.width / 2,
    rect.y - rect.height / 2,
    rect.width,
    rect.height,
  );
}

function drawHallTiles(graphics: Phaser.GameObjects.Graphics, hall: RetiroRectConfig): void {
  const left = hall.x - hall.width / 2;
  const top = hall.y - hall.height / 2;
  graphics.lineStyle(1, COLORS.tileLine, 0.42);
  for (let x = left; x <= left + hall.width; x += 48) {
    graphics.lineBetween(x, top, x, top + hall.height);
  }
  for (let y = top; y <= top + hall.height; y += 40) {
    graphics.lineBetween(left, y, left + hall.width, y);
  }
}

function drawPlatform(graphics: Phaser.GameObjects.Graphics, platform: RetiroRectConfig): void {
  const left = platform.x - platform.width / 2;
  const bottom = platform.y + platform.height / 2;
  graphics.fillStyle(COLORS.platformEdge).fillRect(left, bottom - 10, platform.width, 10);
  graphics.lineStyle(2, 0xe0c47a, 0.8).lineBetween(left, bottom - 14, left + platform.width, bottom - 14);
}

function drawTracks(graphics: Phaser.GameObjects.Graphics, tracks: RetiroRectConfig): void {
  const left = tracks.x - tracks.width / 2;
  const top = tracks.y - tracks.height / 2;
  for (let x = left + 24; x < left + tracks.width; x += 48) {
    graphics.fillStyle(COLORS.sleeper).fillRect(x, top + 34, 26, 92);
  }
  graphics.lineStyle(6, COLORS.rail).lineBetween(left, top + 48, left + tracks.width, top + 48);
  graphics.lineStyle(6, COLORS.rail).lineBetween(left, top + 104, left + tracks.width, top + 104);
}

function drawMarqueeShadow(graphics: Phaser.GameObjects.Graphics, hall: RetiroRectConfig): void {
  const left = hall.x - hall.width / 2;
  graphics.fillStyle(0x1c2627, 0.24).fillRect(left, hall.y + 70, hall.width, 28);
}


function drawColumn(graphics: Phaser.GameObjects.Graphics, x: number, y: number): void {
  graphics.fillStyle(COLORS.iron).fillRect(x - 8, y - 120, 16, 240);
  graphics.fillStyle(COLORS.brass).fillRect(x - 12, y - 120, 24, 8);
  graphics.fillStyle(COLORS.iron).fillRect(x - 16, y + 108, 32, 12);
}

function drawProp(graphics: Phaser.GameObjects.Graphics, prop: RetiroPropConfig): void {
  switch (prop.kind) {
    case 'bench':
      graphics.fillStyle(COLORS.wood).fillRect(prop.x - 48, prop.y - 10, 96, 14);
      graphics.fillStyle(COLORS.iron).fillRect(prop.x - 40, prop.y + 4, 8, 16);
      graphics.fillStyle(COLORS.iron).fillRect(prop.x + 32, prop.y + 4, 8, 16);
      return;
    case 'luggageCart':
      graphics.lineStyle(4, COLORS.iron).lineBetween(prop.x - 26, prop.y + 14, prop.x + 28, prop.y + 14);
      graphics.lineStyle(4, COLORS.iron).lineBetween(prop.x - 20, prop.y + 12, prop.x - 20, prop.y - 28);
      graphics.fillStyle(COLORS.wood).fillRect(prop.x - 10, prop.y - 8, 32, 18);
      graphics.fillStyle(COLORS.iron).fillCircle(prop.x - 14, prop.y + 20, 6).fillCircle(prop.x + 22, prop.y + 20, 6);
      return;
    case 'scale':
      graphics.fillStyle(COLORS.iron).fillRect(prop.x - 16, prop.y - 4, 32, 26);
      graphics.fillStyle(COLORS.brass).fillCircle(prop.x, prop.y - 12, 16);
      graphics.lineStyle(2, COLORS.iron).lineBetween(prop.x, prop.y - 12, prop.x + 8, prop.y - 18);
      return;
    case 'mailCrates':
      graphics.fillStyle(COLORS.wood).fillRect(prop.x - 22, prop.y - 18, 36, 28);
      graphics.fillStyle(COLORS.wood).fillRect(prop.x + 8, prop.y - 6, 32, 22);
      return;
    case 'hangingLamp':
      graphics.lineStyle(2, COLORS.iron).lineBetween(prop.x, prop.y - 50, prop.x, prop.y - 8);
      graphics.fillStyle(COLORS.brass).fillCircle(prop.x, prop.y, 10);
      return;
    case 'telegraph':
      graphics.fillStyle(COLORS.wood).fillRect(prop.x - 26, prop.y - 8, 52, 18);
      graphics.lineStyle(3, COLORS.iron).lineBetween(prop.x - 8, prop.y - 12, prop.x + 10, prop.y - 28);
      return;
    case 'trackSignal':
      graphics.fillStyle(COLORS.iron).fillRect(prop.x - 4, prop.y - 58, 8, 62);
      graphics.fillStyle(COLORS.oxblood).fillCircle(prop.x, prop.y - 62, 12);
      return;
    case 'luggagePile':
      graphics.fillStyle(COLORS.wood).fillRect(prop.x - 28, prop.y - 10, 34, 22);
      graphics.fillStyle(COLORS.oxblood).fillRect(prop.x + 4, prop.y - 20, 32, 32);
      return;
  }
}
