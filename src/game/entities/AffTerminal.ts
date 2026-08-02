import Phaser from 'phaser';
import { ASSET_KEYS } from '@/game/assets/assetKeys';
import { depthFromFeet } from '@/game/rendering/depth';
import type { AffTerminalState } from './affTerminal.types';

const TERMINAL_SCALE = 0.72;
const BODY_WIDTH = 48;
const BODY_HEIGHT = 14;
const BODY_OFFSET_X = (96 - BODY_WIDTH) / 2;
const BODY_OFFSET_Y = 128 - BODY_HEIGHT;
const INTERACTION_OFFSET_Y = 26;

const TEXTURE_BY_STATE: Record<AffTerminalState, string> = {
  idle: ASSET_KEYS.affTerminalIdle,
  active: ASSET_KEYS.affTerminalActive,
  confirmed: ASSET_KEYS.affTerminalConfirmed,
};

export class AffTerminal extends Phaser.Physics.Arcade.Sprite {
  private currentTerminalState: AffTerminalState = 'idle';

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSET_KEYS.affTerminalIdle);

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.setScale(TERMINAL_SCALE);
    this.setOrigin(0.5, 1);

    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(BODY_WIDTH, BODY_HEIGHT);
    body.setOffset(BODY_OFFSET_X, BODY_OFFSET_Y);
    this.refreshBody();

    this.setDepth(depthFromFeet(this.y));
  }

  get terminalState(): AffTerminalState {
    return this.currentTerminalState;
  }

  setTerminalState(state: AffTerminalState): void {
    if (state === this.currentTerminalState) return;

    this.currentTerminalState = state;
    this.setTexture(TEXTURE_BY_STATE[state]);
  }

  getInteractionPoint(): Readonly<{ x: number; y: number }> {
    return {
      x: this.x,
      y: this.y + INTERACTION_OFFSET_Y,
    };
  }
}
