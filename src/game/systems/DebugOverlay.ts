import type Phaser from 'phaser';
import { DEPTH } from '@/game/rendering/depth';

export class DebugOverlay {
  private text!: Phaser.GameObjects.Text;
  private lastUpdate = 0;

  constructor(private scene: Phaser.Scene) {}

  mount() {
    this.text = this.scene.add.text(8, 8, '', { fontSize: '12px', color: '#9ad' }).setDepth(DEPTH.debug);
  }

  update(time: number, _delta: number) {
    if (time - this.lastUpdate < 250) return;
    this.lastUpdate = time;

    const loop = this.scene.game.loop;
    const fps = Math.round(loop.actualFps);
    const count = this.scene.children.list.length;
    const mem = (performance as any).memory?.usedJSHeapSize
      ? (Number((performance as any).memory.usedJSHeapSize) / 1048576).toFixed(1) + ' MB'
      : 'n/a';

    this.text.setText([
      `FPS: ${fps}`,
      `Objs: ${count}`,
      `Mem: ${mem}`,
    ]);
  }

  destroy() {
    this.text?.destroy();
  }
}
