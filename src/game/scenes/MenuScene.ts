import Phaser from 'phaser';
import { bus } from '@/core/events/bus';

export default class MenuScene extends Phaser.Scene {
  private options = ['Nuevo Juego', 'Cargar', 'Salir'];
  private selected = 0;
  private items: Phaser.GameObjects.Text[] = [];

  constructor(){ super('MenuScene'); }

  create(){
    const cx = this.scale.width / 2;

    this.add.text(cx, 110, 'El Tren de las Estaciones', { fontSize: '42px', color:'#fff' })
      .setOrigin(0.5);

    this.items = this.options.map((label, i) =>
      this.add.text(cx, 230 + i*50, label, { fontSize: '28px', color:'#fff' }).setOrigin(0.5)
    );
    this.paint();

    const kb = this.input.keyboard;
    kb.on('keydown-UP',   () => this.move(-1));
    kb.on('keydown-DOWN', () => this.move(1));
    kb.on('keydown-ENTER',() => this.select());

    this.items.forEach((t, i) => {
      t.setInteractive({ useHandCursor: true })
       .on('pointerover', () => { this.selected = i; this.paint(); })
       .on('pointerup',   () => this.select());
    });

    bus.on('ui:toast', (msg) => this.toast(String(msg)));
  }

  move(delta: number){
    this.selected = (this.selected + delta + this.options.length) % this.options.length;
    this.paint();
  }

  paint(){
    this.items.forEach((t, i) => t.setColor(i === this.selected ? '#ffd54a' : '#ffffff'));
  }

  select(){
    if(this.selected === 0) this.scene.start('WorldScene', { day: 1, season: 'Primavera' });
    else if(this.selected === 1) this.toast('Cargar: próximamente');
    else this.game.destroy(true);
  }

  toast(msg: string){
    const t = this.add.text(this.scale.width/2, 520, msg, { fontSize:'18px', color:'#bbb' }).setOrigin(0.5);
    this.time.delayedCall(1200, () => t.destroy());
  }
}
