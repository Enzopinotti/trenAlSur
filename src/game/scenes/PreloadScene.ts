import Phaser from 'phaser';
import { emitToast } from '@/core/events/bus';

export default class PreloadScene extends Phaser.Scene {
  private progressBox!: Phaser.GameObjects.Rectangle;
  private progressBar!: Phaser.GameObjects.Rectangle;

  constructor(){ super('PreloadScene'); }

  preload(){
    const { width, height } = this.scale;

    this.add.text(width/2, height/2 - 60, 'Cargando...', { fontSize: '24px', color:'#fff' }).setOrigin(0.5);
    this.progressBox = this.add.rectangle(width/2, height/2, 320, 24, 0x222222).setOrigin(0.5);
    this.progressBar = this.add.rectangle(width/2 - 158, height/2, 4, 16, 0x6cf7ff).setOrigin(0, 0.5);

    this.load.on('progress', (value: number) => {
      this.progressBar.width = 316 * value;
    });

    this.load.on('complete', () => {
      emitToast('Carga completa');
    });

    for (let i = 0; i < 25; i++) {
      this.load.image(`dummy-${i}`, `https://picsum.photos/seed/${i}/8/8`);
    }
  }

  create(){
    this.scene.start('MenuScene');
  }
}
