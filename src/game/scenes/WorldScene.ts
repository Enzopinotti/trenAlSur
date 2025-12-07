import Phaser from 'phaser';
import { DebugOverlay } from '@/game/systems/DebugOverlay';
import type { Season } from '@/game/config';
import { bus } from '@/core/events/bus';
import { saveService } from '@/core/save/SaveService';

export default class WorldScene extends Phaser.Scene {
  private overlay!: DebugOverlay;
  private vx = 120;
  private box!: Phaser.GameObjects.Rectangle;
  private day!: number;
  private season!: Season;

  constructor(){ super('WorldScene'); }

  init(data: { day?: number; season?: Season }){
    this.day = data?.day ?? 1;
    this.season = data?.season ?? 'Primavera';
  }

  create(){
    this.add.text(24, 24, `🌱 Día ${this.day} — ${this.season}`, { fontSize: '24px', color:'#fff' });
    this.add.text(24, 56, 'ESC: menú | S: guardar', { fontSize: '16px', color:'#bbb' });

    this.box = this.add.rectangle(120, 300, 40, 40, 0x6cf7ff).setOrigin(0.5);

    this.overlay = new DebugOverlay(this);
    this.overlay.mount();

    this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));
    this.input.keyboard.on('keydown-S', async () => {
      await saveService.save({
        id: 'slot-1',
        label: 'Partida 1',
        updatedAt: Date.now(),
        state: { version: 1, day: this.day, season: this.season, player: { x: this.box.x, y: this.box.y, name: 'Dev' } }
      });
      bus.emit('ui:toast', '💾 Partida guardada (slot-1)');
    });
  }

  update(time: number, delta: number){
    const dt = delta / 1000;
    this.box.x += this.vx * dt;
    if(this.box.x > this.scale.width - 40 || this.box.x < 40) this.vx *= -1;

    this.overlay.update(time, delta);
  }

  shutdown(){
    this.overlay?.destroy();
  }
}
