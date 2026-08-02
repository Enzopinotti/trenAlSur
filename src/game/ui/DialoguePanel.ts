import Phaser from 'phaser';
import type { DialogueSequence } from '@/game/dialogue/dialogue.types';
import { DIALOGUE_ACTORS } from '@/game/dialogue/dialogueActors';

export class DialoguePanel {
  private container: Phaser.GameObjects.Container;
  private panelBg: Phaser.GameObjects.Rectangle;
  private innerBorder: Phaser.GameObjects.Rectangle;
  private portraitImage: Phaser.GameObjects.Image;
  private portraitFrame: Phaser.GameObjects.Rectangle;
  private speakerText: Phaser.GameObjects.Text;
  private bodyText: Phaser.GameObjects.Text;
  private pageText: Phaser.GameObjects.Text;
  private hintText: Phaser.GameObjects.Text;

  private activeSequence: DialogueSequence = [];
  private currentIndex = 0;
  private activeIsOpen = false;

  constructor(private scene: Phaser.Scene) {
    // Fijo en parte inferior del viewport (800x600)
    this.container = this.scene.add.container(400, 510).setScrollFactor(0).setDepth(500).setVisible(false);

    // Fondo principal (752 × 156 px)
    this.panelBg = this.scene.add.rectangle(0, 0, 752, 156, 0x0b1329, 0.96);
    this.panelBg.setStrokeStyle(2, 0x38bdf8);

    // Línea interior secundaria tenue
    this.innerBorder = this.scene.add.rectangle(0, 0, 744, 148, 0x000000, 0);
    this.innerBorder.setStrokeStyle(1, 0x1e293b);

    // Retrato
    this.portraitImage = this.scene.add.image(-300, 0, '').setOrigin(0.5);
    this.portraitFrame = this.scene.add.rectangle(-300, 0, 116, 116, 0x000000, 0);
    this.portraitFrame.setStrokeStyle(2, 0x38bdf8);

    // Nombre del hablante
    this.speakerText = this.scene.add.text(-360, -62, '', {
      fontSize: '14px',
      fontStyle: 'bold',
    });

    // Cuerpo del texto
    this.bodyText = this.scene.add.text(-360, -40, '', {
      fontSize: '15px',
      color: '#f8fafc',
      wordWrap: { width: 710 },
    });

    // Contador de páginas
    this.pageText = this.scene.add.text(-360, 58, '', {
      fontSize: '12px',
      color: '#64748b',
    }).setOrigin(0, 1);

    // Ayuda "E — Continuar"
    this.hintText = this.scene.add.text(360, 58, 'E — Continuar', {
      fontSize: '12px',
      color: '#94a3b8',
    }).setOrigin(1, 1);

    this.container.add([
      this.panelBg,
      this.innerBorder,
      this.portraitFrame,
      this.portraitImage,
      this.speakerText,
      this.bodyText,
      this.pageText,
      this.hintText,
    ]);
  }

  open(sequence: DialogueSequence): void {
    if (sequence.length === 0) return;
    this.activeSequence = sequence;
    this.currentIndex = 0;
    this.activeIsOpen = true;
    this.container.setVisible(true);
    this.renderCurrentPage();
  }

  advance(): 'advanced' | 'closed' {
    if (!this.activeIsOpen) return 'closed';
    this.currentIndex += 1;
    if (this.currentIndex >= this.activeSequence.length) {
      this.close();
      return 'closed';
    }
    this.renderCurrentPage();
    return 'advanced';
  }

  close(): void {
    this.container.setVisible(false);
    this.activeIsOpen = false;
    this.activeSequence = [];
    this.currentIndex = 0;
  }

  get isOpen(): boolean {
    return this.activeIsOpen;
  }

  private renderCurrentPage(): void {
    const line = this.activeSequence[this.currentIndex];
    if (!line) return;

    const actor = DIALOGUE_ACTORS[line.actorId];
    const hasPortrait = Boolean(actor?.portraitKey && this.scene.textures.exists(actor.portraitKey));

    // Estilos de acento del actor
    this.panelBg.setStrokeStyle(2, actor?.accentColor ?? 0x38bdf8);
    this.speakerText.setText(actor?.displayName ?? line.actorId);
    this.speakerText.setColor(actor?.nameColor ?? '#ffffff');

    this.bodyText.setText(line.text);
    this.pageText.setText(`${this.currentIndex + 1} / ${this.activeSequence.length}`);

    if (hasPortrait && actor.portraitKey) {
      // Con retrato: desplazar texto y mostrar retrato a la izquierda
      this.portraitImage.setTexture(actor.portraitKey).setDisplaySize(112, 112).setVisible(true);
      this.portraitFrame.setStrokeStyle(2, actor.accentColor).setVisible(true);

      this.speakerText.setX(-220);
      this.bodyText.setX(-220);
      this.bodyText.setWordWrapWidth(570);
      this.pageText.setX(-220);
    } else {
      // Sin retrato: expandir texto a ancho completo
      this.portraitImage.setVisible(false);
      this.portraitFrame.setVisible(false);

      this.speakerText.setX(-360);
      this.bodyText.setX(-360);
      this.bodyText.setWordWrapWidth(710);
      this.pageText.setX(-360);
    }
  }

  destroy(): void {
    this.container?.destroy();
    this.activeSequence = [];
    this.activeIsOpen = false;
  }
}
