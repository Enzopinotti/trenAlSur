import Phaser from 'phaser';
import { bus } from '@/core/events/bus';
import { saveService } from '@/core/save/SaveService';
import { RETIRO_CONFIG } from '@/game/levels/retiro/retiro.config';

export default class MenuScene extends Phaser.Scene {
  private readonly options = ['Nuevo Juego', 'Cargar', 'Salir'];
  private selected = 0;
  private items: Phaser.GameObjects.Text[] = [];

  private readonly onUp = () => this.move(-1);
  private readonly onDown = () => this.move(1);
  private readonly onEnter = () => this.select();
  private readonly onToast = (message: unknown) => this.toast(String(message));

  constructor() {
    super('MenuScene');
  }

  create() {
    const centerX = this.scale.width / 2;

    this.add.text(centerX, 110, 'Tren al Sur', { fontSize: '42px', color: '#fff' })
      .setOrigin(0.5);

    this.items = this.options.map((label, index) =>
      this.add.text(centerX, 230 + index * 50, label, { fontSize: '28px', color: '#fff' })
        .setOrigin(0.5),
    );
    this.paint();

    const keyboard = this.input.keyboard;
    keyboard?.on('keydown-UP', this.onUp);
    keyboard?.on('keydown-DOWN', this.onDown);
    keyboard?.on('keydown-ENTER', this.onEnter);

    this.items.forEach((item, index) => {
      item.setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
          this.selected = index;
          this.paint();
        })
        .on('pointerup', () => this.select());
    });

    bus.on('ui:toast', this.onToast);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handleShutdown, this);
  }

  private move(delta: number) {
    this.selected = (this.selected + delta + this.options.length) % this.options.length;
    this.paint();
  }

  private paint() {
    this.items.forEach((item, index) => {
      item.setColor(index === this.selected ? '#ffd54a' : '#ffffff');
    });
  }

  private select() {
    if (this.selected === 0) {
      this.scene.start('WorldScene', {
        kind: 'newGame',
      });
      return;
    }
    if (this.selected === 1) {
      void this.loadGame();
      return;
    }
    this.game.destroy(true);
  }

  private async loadGame(): Promise<void> {
    try {
      const slot = await saveService.load('slot-1');
      if (!slot) {
        this.toast('No hay una partida guardada.');
        return;
      }

      this.scene.start('WorldScene', { kind: 'loadedGame', ...slot.state });
    } catch (error: unknown) {
      console.error('[MenuScene] No se pudo cargar la partida:', error);
      this.toast('No se pudo cargar la partida.');
    }
  }

  private toast(message: string) {
    const toast = this.add.text(this.scale.width / 2, 520, message, {
      fontSize: '18px',
      color: '#bbb',
    }).setOrigin(0.5);
    this.time.delayedCall(1200, () => toast.destroy());
  }

  private handleShutdown() {
    const keyboard = this.input.keyboard;
    keyboard?.off('keydown-UP', this.onUp);
    keyboard?.off('keydown-DOWN', this.onDown);
    keyboard?.off('keydown-ENTER', this.onEnter);
    bus.off('ui:toast', this.onToast);
  }
}
