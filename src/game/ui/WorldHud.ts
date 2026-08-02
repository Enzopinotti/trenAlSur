import Phaser from 'phaser';
import { DEPTH } from '@/game/rendering/depth';
import { UI_THEME } from './uiTheme';

export interface LocationIntroData {
  location: string;
  day: number;
}

const SCREEN_MARGIN = UI_THEME.spacing.screen;
const INTRO_Y = 36;
const INTRO_WIDTH = 300;
const INTRO_HEIGHT = 42;
const INTRO_FADE_DURATION = 250;
const INTRO_HOLD_DURATION = 1650;
const OBJECTIVE_REVEAL_DURATION = 180;
const OBJECTIVE_REVEAL_DELAY = INTRO_FADE_DURATION - OBJECTIVE_REVEAL_DURATION;

const OBJECTIVE_WIDTH = 300;
const OBJECTIVE_SINGLE_LINE_HEIGHT = 62;
const OBJECTIVE_MULTI_LINE_HEIGHT = 78;
const OBJECTIVE_ACCENT_WIDTH = 4;
const OBJECTIVE_PADDING = 12;
const OBJECTIVE_TEXT_X = OBJECTIVE_ACCENT_WIDTH + OBJECTIVE_PADDING;

const PROMPT_HEIGHT = 34;
const PROMPT_KEY_SIZE = 26;
const PROMPT_HORIZONTAL_PADDING = 12;
const PROMPT_GAP = UI_THEME.spacing.small;

export class WorldHud {
  private introContainer: Phaser.GameObjects.Container;
  private introText: Phaser.GameObjects.Text;
  private introTween?: Phaser.Tweens.Tween;
  private isIntroActive = false;

  private objectiveContainer: Phaser.GameObjects.Container;
  private objectiveShadow: Phaser.GameObjects.Rectangle;
  private objectiveBg: Phaser.GameObjects.Rectangle;
  private objectiveAccent: Phaser.GameObjects.Rectangle;
  private objectiveText: Phaser.GameObjects.Text;
  private currentObjectiveText = '';
  private objectiveTween?: Phaser.Tweens.Tween;
  private objectiveFeedbackTween?: Phaser.Tweens.Tween;

  private promptContainer: Phaser.GameObjects.Container;
  private promptShadow: Phaser.GameObjects.Rectangle;
  private promptBg: Phaser.GameObjects.Rectangle;
  private promptKeyBox: Phaser.GameObjects.Rectangle;
  private promptKeyText: Phaser.GameObjects.Text;
  private promptLabelText: Phaser.GameObjects.Text;
  private requestedPromptLabel: string | null = null;
  private promptTween?: Phaser.Tweens.Tween;

  private isDestroyed = false;

  constructor(private scene: Phaser.Scene) {
    const screenWidth = this.scene.scale.width;
    const promptY = this.scene.scale.height - SCREEN_MARGIN - PROMPT_HEIGHT / 2;

    this.introContainer = this.scene.add
      .container(screenWidth / 2, INTRO_Y)
      .setScrollFactor(0)
      .setDepth(DEPTH.hud + 1)
      .setAlpha(0);

    const introShadow = this.scene.add.rectangle(
      3,
      4,
      INTRO_WIDTH,
      INTRO_HEIGHT,
      UI_THEME.colors.shadow,
      UI_THEME.alpha.shadow,
    );
    const introBg = this.scene.add.rectangle(
      0,
      0,
      INTRO_WIDTH,
      INTRO_HEIGHT,
      UI_THEME.colors.surfaceElevated,
      UI_THEME.alpha.surface,
    );
    const introAccent = this.scene.add.rectangle(
      0,
      INTRO_HEIGHT / 2 - 4,
      INTRO_WIDTH - 36,
      2,
      UI_THEME.colors.objectiveAccent,
    );

    this.introText = this.scene.add
      .text(0, -3, '', {
        fontSize: '15px',
        color: UI_THEME.colors.textPrimary,
        fontStyle: 'bold',
        letterSpacing: 1.5,
      })
      .setOrigin(0.5);

    this.introContainer.add([
      introShadow,
      introBg,
      introAccent,
      this.introText,
    ]);

    this.objectiveContainer = this.scene.add
      .container(SCREEN_MARGIN, SCREEN_MARGIN)
      .setScrollFactor(0)
      .setDepth(DEPTH.hud)
      .setVisible(false);

    this.objectiveShadow = this.scene.add
      .rectangle(
        3,
        4,
        OBJECTIVE_WIDTH,
        OBJECTIVE_SINGLE_LINE_HEIGHT,
        UI_THEME.colors.shadow,
        UI_THEME.alpha.shadow,
      )
      .setOrigin(0, 0);
    this.objectiveBg = this.scene.add
      .rectangle(
        0,
        0,
        OBJECTIVE_WIDTH,
        OBJECTIVE_SINGLE_LINE_HEIGHT,
        UI_THEME.colors.surface,
        UI_THEME.alpha.surface,
      )
      .setOrigin(0, 0);
    this.objectiveAccent = this.scene.add
      .rectangle(0, 0, OBJECTIVE_ACCENT_WIDTH, OBJECTIVE_SINGLE_LINE_HEIGHT, UI_THEME.colors.objectiveAccent)
      .setOrigin(0, 0)
      .setAlpha(0.85);

    const objectiveLabel = this.scene.add.text(OBJECTIVE_TEXT_X, 8, 'OBJETIVO', {
      fontSize: '9px',
      color: UI_THEME.colors.objectiveLabel,
      fontStyle: 'bold',
      letterSpacing: 1,
    });

    this.objectiveText = this.scene.add.text(OBJECTIVE_TEXT_X, 24, '', {
      fontSize: '13px',
      color: UI_THEME.colors.textPrimary,
      lineSpacing: 2,
      wordWrap: { width: OBJECTIVE_WIDTH - OBJECTIVE_TEXT_X - OBJECTIVE_PADDING },
    });

    this.objectiveContainer.add([
      this.objectiveShadow,
      this.objectiveBg,
      this.objectiveAccent,
      objectiveLabel,
      this.objectiveText,
    ]);

    this.promptContainer = this.scene.add
      .container(screenWidth / 2, promptY)
      .setScrollFactor(0)
      .setDepth(DEPTH.interactionPrompt)
      .setVisible(false);

    this.promptShadow = this.scene.add.rectangle(3, 4, 160, PROMPT_HEIGHT, UI_THEME.colors.shadow, UI_THEME.alpha.shadow);
    this.promptBg = this.scene.add.rectangle(0, 0, 160, PROMPT_HEIGHT, UI_THEME.colors.surface, UI_THEME.alpha.surface);
    this.promptKeyBox = this.scene.add.rectangle(0, 0, PROMPT_KEY_SIZE, PROMPT_KEY_SIZE, UI_THEME.colors.surfaceElevated);
    this.promptKeyBox.setStrokeStyle(1, UI_THEME.colors.interactionAccent, 0.7);

    this.promptKeyText = this.scene.add
      .text(0, 0, 'E', {
        fontSize: '13px',
        color: UI_THEME.colors.textPrimary,
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.promptLabelText = this.scene.add
      .text(0, 0, '', {
        fontSize: '13px',
        color: UI_THEME.colors.textPrimary,
      })
      .setOrigin(0, 0.5);

    this.promptContainer.add([
      this.promptShadow,
      this.promptBg,
      this.promptKeyBox,
      this.promptKeyText,
      this.promptLabelText,
    ]);
  }

  showLocationIntro(data: LocationIntroData): void {
    if (this.isDestroyed) return;

    this.introText.setText(`${data.location.toUpperCase()} · DÍA ${data.day}`);
    this.isIntroActive = true;

    this.introTween?.stop();
    this.objectiveTween?.stop();
    this.introContainer.setAlpha(0).setY(INTRO_Y - 10);
    this.objectiveContainer.setVisible(false).setAlpha(0);
    this.promptContainer.setVisible(false).setAlpha(1);

    this.introTween = this.scene.tweens.add({
      targets: this.introContainer,
      alpha: { from: 0, to: 1 },
      y: { from: INTRO_Y - 10, to: INTRO_Y },
      duration: INTRO_FADE_DURATION,
      hold: INTRO_HOLD_DURATION,
      yoyo: true,
      onYoyo: () => {
        if (!this.isDestroyed) {
          this.revealObjective();
        }
      },
      onComplete: () => {
        if (this.isDestroyed) return;

        this.isIntroActive = false;
        this.introContainer.setAlpha(0);
        this.showRequestedPrompt();
      },
    });
  }

  setObjective(text: string): void {
    if (this.isDestroyed || this.currentObjectiveText === text) return;

    this.currentObjectiveText = text;
    this.objectiveText.setText(text);
    this.updateObjectiveLayout();

    if (this.isIntroActive) return;

    this.objectiveContainer.setVisible(true).setAlpha(1);
    this.flashObjectiveAccent();
  }

  showInteractionPrompt(label: string): void {
    if (this.isDestroyed) return;

    this.requestedPromptLabel = label;
    if (this.isIntroActive) return;

    this.showRequestedPrompt();
  }

  hideInteractionPrompt(): void {
    if (this.isDestroyed) return;

    this.requestedPromptLabel = null;
    this.promptTween?.stop();
    this.promptContainer.setVisible(false).setAlpha(1);
  }

  destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    this.introTween?.stop();
    this.objectiveTween?.stop();
    this.objectiveFeedbackTween?.stop();
    this.promptTween?.stop();
    this.introTween = undefined;
    this.objectiveTween = undefined;
    this.objectiveFeedbackTween = undefined;
    this.promptTween = undefined;

    this.introContainer.destroy();
    this.objectiveContainer.destroy();
    this.promptContainer.destroy();
  }

  private updateObjectiveLayout(): void {
    const objectiveHeight = this.objectiveText.height > 18
      ? OBJECTIVE_MULTI_LINE_HEIGHT
      : OBJECTIVE_SINGLE_LINE_HEIGHT;

    this.objectiveShadow.setSize(OBJECTIVE_WIDTH, objectiveHeight);
    this.objectiveBg.setSize(OBJECTIVE_WIDTH, objectiveHeight);
    this.objectiveAccent.setSize(OBJECTIVE_ACCENT_WIDTH, objectiveHeight);
  }

  private revealObjective(): void {
    if (!this.currentObjectiveText) return;

    this.objectiveTween?.stop();
    this.objectiveContainer.setVisible(true).setAlpha(0);
    this.objectiveTween = this.scene.tweens.add({
      targets: this.objectiveContainer,
      alpha: { from: 0, to: 1 },
      delay: OBJECTIVE_REVEAL_DELAY,
      duration: OBJECTIVE_REVEAL_DURATION,
    });
  }

  private flashObjectiveAccent(): void {
    this.objectiveFeedbackTween?.stop();
    this.objectiveAccent.setAlpha(0.5);
    this.objectiveFeedbackTween = this.scene.tweens.add({
      targets: this.objectiveAccent,
      alpha: { from: 0.5, to: 1 },
      duration: 90,
      yoyo: true,
      onComplete: () => this.objectiveAccent.setAlpha(0.85),
    });
  }

  private showRequestedPrompt(): void {
    if (!this.requestedPromptLabel) return;

    this.promptLabelText.setText(this.requestedPromptLabel);

    const labelWidth = this.promptLabelText.width;
    const totalWidth = labelWidth
      + PROMPT_KEY_SIZE
      + PROMPT_GAP
      + PROMPT_HORIZONTAL_PADDING * 2;
    const keyX = -totalWidth / 2 + PROMPT_HORIZONTAL_PADDING + PROMPT_KEY_SIZE / 2;

    this.promptShadow.setSize(totalWidth, PROMPT_HEIGHT);
    this.promptBg.setSize(totalWidth, PROMPT_HEIGHT);
    this.promptKeyBox.setX(keyX);
    this.promptKeyText.setX(keyX);
    this.promptLabelText.setX(keyX + PROMPT_KEY_SIZE / 2 + PROMPT_GAP);

    const wasVisible = this.promptContainer.visible;
    this.promptTween?.stop();
    this.promptContainer.setVisible(true);

    if (wasVisible) {
      this.promptContainer.setAlpha(1);
      return;
    }

    this.promptTween = this.scene.tweens.add({
      targets: this.promptContainer,
      alpha: { from: 0, to: 1 },
      duration: 120,
    });
  }
}
