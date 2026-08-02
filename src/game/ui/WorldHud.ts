import Phaser from 'phaser';

export interface LocationIntroData {
  location: string;
  day: number;
}

const HUD_DEPTH = 400;
const INTERACTION_DEPTH = 450;
const SCREEN_MARGIN = 18;

export class WorldHud {
  // Presentación de ubicación (Placa temporal)
  private introContainer: Phaser.GameObjects.Container;
  private introBg: Phaser.GameObjects.Rectangle;
  private introText: Phaser.GameObjects.Text;
  private introTween?: Phaser.Tweens.Tween;

  // Tarjeta de objetivo
  private objectiveContainer: Phaser.GameObjects.Container;
  private objectiveBg: Phaser.GameObjects.Rectangle;
  private objectiveInnerBorder: Phaser.GameObjects.Rectangle;
  private objectiveLabel: Phaser.GameObjects.Text;
  private objectiveText: Phaser.GameObjects.Text;
  private currentObjectiveStr = '';

  // Prompt de interacción
  private promptContainer: Phaser.GameObjects.Container;
  private promptBg: Phaser.GameObjects.Rectangle;
  private promptKeyBox: Phaser.GameObjects.Rectangle;
  private promptKeyText: Phaser.GameObjects.Text;
  private promptLabelText: Phaser.GameObjects.Text;

  private isDestroyed = false;

  constructor(private scene: Phaser.Scene) {
    const screenWidth = this.scene.scale.width;

    // ── 1. Presentación de ubicación (Placa superior centrada) ─────────────────
    this.introContainer = this.scene.add
      .container(screenWidth / 2, 36)
      .setScrollFactor(0)
      .setDepth(HUD_DEPTH)
      .setAlpha(0);

    this.introBg = this.scene.add.rectangle(0, 0, 300, 44, 0x0b1329, 0.95);
    this.introBg.setStrokeStyle(1.5, 0xd97706);

    const introLeftDeco = this.scene.add.rectangle(-135, 0, 4, 24, 0xd97706);
    const introRightDeco = this.scene.add.rectangle(135, 0, 4, 24, 0xd97706);

    this.introText = this.scene.add
      .text(0, 0, '', {
        fontSize: '15px',
        color: '#fef3c7',
        fontStyle: 'bold',
        letterSpacing: 1.5,
      })
      .setOrigin(0.5);

    this.introContainer.add([
      this.introBg,
      introLeftDeco,
      introRightDeco,
      this.introText,
    ]);

    // ── 2. Tarjeta de objetivo (Arriba a la izquierda) ──────────────────────────
    this.objectiveContainer = this.scene.add
      .container(SCREEN_MARGIN, SCREEN_MARGIN)
      .setScrollFactor(0)
      .setDepth(HUD_DEPTH);

    this.objectiveBg = this.scene.add
      .rectangle(0, 0, 330, 72, 0x0b1329, 0.92)
      .setOrigin(0, 0);
    this.objectiveBg.setStrokeStyle(1.5, 0xd97706);

    this.objectiveInnerBorder = this.scene.add
      .rectangle(3, 3, 324, 66, 0x000000, 0)
      .setOrigin(0, 0);
    this.objectiveInnerBorder.setStrokeStyle(1, 0x1e293b);

    this.objectiveLabel = this.scene.add.text(12, 10, 'OBJETIVO', {
      fontSize: '10px',
      color: '#d97706',
      fontStyle: 'bold',
      letterSpacing: 1,
    });

    this.objectiveText = this.scene.add.text(12, 26, '', {
      fontSize: '14px',
      color: '#f8fafc',
      wordWrap: { width: 306 },
    });

    this.objectiveContainer.add([
      this.objectiveBg,
      this.objectiveInnerBorder,
      this.objectiveLabel,
      this.objectiveText,
    ]);

    // ── 3. Prompt de interacción (Abajo centrado: [ E ] Acción) ────────────────
    this.promptContainer = this.scene.add
      .container(screenWidth / 2, 480)
      .setScrollFactor(0)
      .setDepth(INTERACTION_DEPTH)
      .setVisible(false);

    this.promptBg = this.scene.add.rectangle(0, 0, 240, 38, 0x0f172a, 0.94);
    this.promptBg.setStrokeStyle(1.5, 0x028090);

    this.promptKeyBox = this.scene.add.rectangle(-95, 0, 26, 24, 0x1e293b);
    this.promptKeyBox.setStrokeStyle(1, 0x00f5d4);

    this.promptKeyText = this.scene.add
      .text(-95, 0, 'E', {
        fontSize: '13px',
        color: '#00f5d4',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.promptLabelText = this.scene.add.text(-70, 0, '', {
      fontSize: '14px',
      color: '#f8fafc',
    }).setOrigin(0, 0.5);

    this.promptContainer.add([
      this.promptBg,
      this.promptKeyBox,
      this.promptKeyText,
      this.promptLabelText,
    ]);
  }

  showLocationIntro(data: LocationIntroData): void {
    if (this.isDestroyed) return;

    this.introText.setText(`${data.location.toUpperCase()} · DÍA ${data.day}`);

    this.introTween?.stop();
    this.introContainer.setAlpha(0).setY(26);

    this.introTween = this.scene.tweens.add({
      targets: this.introContainer,
      alpha: { from: 0, to: 1 },
      y: { from: 26, to: 36 },
      duration: 250,
      hold: 2000,
      yoyo: true,
      onComplete: () => {
        if (!this.isDestroyed) {
          this.introContainer.setAlpha(0);
        }
      },
    });
  }

  setObjective(text: string): void {
    if (this.isDestroyed || this.currentObjectiveStr === text) return;
    this.currentObjectiveStr = text;

    this.objectiveText.setText(text);

    // Ajustar tamaño del fondo dinámicamente según la altura del texto
    const textHeight = this.objectiveText.height;
    const bgHeight = Math.max(64, textHeight + 36);

    this.objectiveBg.setSize(330, bgHeight);
    this.objectiveInnerBorder.setSize(324, bgHeight - 6);

    // Feedback sutil
    this.scene.tweens.add({
      targets: this.objectiveContainer,
      alpha: { from: 0.5, to: 1 },
      duration: 180,
    });
  }

  showInteractionPrompt(label: string): void {
    if (this.isDestroyed) return;

    this.promptLabelText.setText(label);

    // Reposicionar y ajustar ancho del contenedor del prompt según el largo de la etiqueta
    const labelWidth = this.promptLabelText.width;
    const totalWidth = Math.max(180, labelWidth + 60);

    this.promptBg.setSize(totalWidth, 38);
    const keyX = -totalWidth / 2 + 22;
    this.promptKeyBox.setX(keyX);
    this.promptKeyText.setX(keyX);
    this.promptLabelText.setX(keyX + 22);

    this.promptContainer.setVisible(true);
  }

  hideInteractionPrompt(): void {
    if (this.isDestroyed) return;
    this.promptContainer.setVisible(false);
  }

  destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    this.introTween?.stop();
    this.introTween = undefined;

    this.introContainer.destroy();
    this.objectiveContainer.destroy();
    this.promptContainer.destroy();
  }
}
