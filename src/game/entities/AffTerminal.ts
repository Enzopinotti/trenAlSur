import Phaser from 'phaser';
import { ASSET_KEYS } from '@/game/assets/assetKeys';
import { depthFromFeet } from '@/game/rendering/depth';
import type { AffTerminalState } from './affTerminal.types';
import type { StaticWorldEntityConfig } from './worldEntity.types';

const TEXTURE_BY_STATE: Record<AffTerminalState, string> = {
  idle: ASSET_KEYS.affTerminalIdle,
  active: ASSET_KEYS.affTerminalActive,
  confirmed: ASSET_KEYS.affTerminalConfirmed,
};

export class AffTerminal extends Phaser.Physics.Arcade.Sprite {
  private currentTerminalState: AffTerminalState = 'idle';
  private readonly interactionOffsetY: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config: StaticWorldEntityConfig,
  ) {
    super(scene, x, y, ASSET_KEYS.affTerminalIdle);

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.setScale(config.scale);
    this.setOrigin(0.5, 1);

    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(config.body.width, config.body.height);
    body.setOffset(config.body.offsetX, config.body.offsetY);
    this.refreshBody();

    this.interactionOffsetY = config.interactionOffsetY ?? 0;

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
      y: this.y + this.interactionOffsetY,
    };
  }
}
