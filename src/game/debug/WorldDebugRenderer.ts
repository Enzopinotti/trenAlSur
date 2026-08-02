import Phaser from 'phaser';
import { DEPTH } from '@/game/rendering/depth';
import type { Interactable } from '@/game/interactions/interaction.types';
import type { RetiroRectConfig } from '@/game/levels/retiro/retiro.types';

type ArcadeBody = Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody;

export interface DebugBody {
  label: string;
  body: ArcadeBody | null;
}

export interface WorldDebugState {
  bodies: readonly DebugBody[];
  interactables: readonly Interactable[];
  currentTarget: Interactable | null;
  walkableAreas: readonly RetiroRectConfig[];
}

export class WorldDebugRenderer {
  private readonly graphics: Phaser.GameObjects.Graphics;
  private visible = false;
  private destroyed = false;

  constructor(private readonly scene: Phaser.Scene) {
    this.graphics = this.scene.add.graphics().setDepth(DEPTH.debug).setVisible(false);
  }

  toggle(): void {
    if (this.destroyed) return;

    this.visible = !this.visible;
    this.graphics.setVisible(this.visible);
    if (!this.visible) this.graphics.clear();
  }

  render(state: WorldDebugState): void {
    if (this.destroyed || !this.visible) return;

    this.graphics.clear();
    this.drawWalkableAreas(state.walkableAreas);
    this.drawBodies(state.bodies);
    this.drawInteractions(state.interactables, state.currentTarget);
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.graphics.destroy();
  }

  private drawWalkableAreas(areas: readonly RetiroRectConfig[]): void {
    this.graphics.lineStyle(1, 0x6ee7b7, 0.72);
    for (const area of areas) {
      this.graphics.strokeRect(
        area.x - area.width / 2,
        area.y - area.height / 2,
        area.width,
        area.height,
      );
    }
  }

  private drawBodies(bodies: readonly DebugBody[]): void {
    this.graphics.lineStyle(2, 0xf59e0b, 0.9);
    for (const entry of bodies) {
      const body = entry.body;
      if (!body) continue;

      this.graphics.strokeRect(body.x, body.y, body.width, body.height);
      this.graphics.fillStyle(0xfef3c7, 1).fillCircle(body.x + body.width / 2, body.y - 5, 2);
    }
  }

  private drawInteractions(
    interactables: readonly Interactable[],
    currentTarget: Interactable | null,
  ): void {
    for (const interactable of interactables) {
      const position = interactable.getPosition();
      const isCurrentTarget = currentTarget?.id === interactable.id;
      this.graphics.lineStyle(1, isCurrentTarget ? 0x38bdf8 : 0x94a3b8, 0.85);
      this.graphics.strokeCircle(position.x, position.y, interactable.radius);
      this.graphics.fillStyle(isCurrentTarget ? 0x38bdf8 : 0x94a3b8, 1);
      this.graphics.fillCircle(position.x, position.y, isCurrentTarget ? 4 : 3);
    }
  }
}
