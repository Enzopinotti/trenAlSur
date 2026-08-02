import Phaser from 'phaser';
import type { DialogueSequence } from '@/game/dialogue/dialogue.types';
import { DIALOGUE_ACTORS } from '@/game/dialogue/dialogueActors';
import { DEPTH } from '@/game/rendering/depth';
import { UI_THEME } from './uiTheme';

const PANEL_WIDTH = 752;
const PANEL_HEIGHT = 156;
const PANEL_MARGIN = 20;
const PANEL_PADDING = UI_THEME.spacing.panel;
const PORTRAIT_SIZE = 104;
const PORTRAIT_BACKDROP_SIZE = 108;
const CONTENT_GAP = 16;
const FOOTER_HEIGHT = 22;
const ACCENT_WIDTH = 4;
const KEYCAP_SIZE = 18;
const HINT_LABEL = 'Continuar';

const PANEL_LEFT = -PANEL_WIDTH / 2;
const CONTENT_X_WITH_PORTRAIT = PANEL_LEFT + PANEL_PADDING + PORTRAIT_SIZE + CONTENT_GAP;
const CONTENT_X_WITHOUT_PORTRAIT = PANEL_LEFT + PANEL_PADDING;
const PORTRAIT_X = PANEL_LEFT + PANEL_PADDING + PORTRAIT_SIZE / 2;
const SPEAKER_Y = -PANEL_HEIGHT / 2 + PANEL_PADDING;
const BODY_Y = SPEAKER_Y + 23;
const FOOTER_Y = PANEL_HEIGHT / 2 - PANEL_PADDING;
const TEXT_WIDTH_WITH_PORTRAIT = 600;
const TEXT_WIDTH_WITHOUT_PORTRAIT = 720;

export class DialoguePanel {
  private container: Phaser.GameObjects.Container;
  private panelShadow: Phaser.GameObjects.Rectangle;
  private panelBg: Phaser.GameObjects.Rectangle;
  private actorAccent: Phaser.GameObjects.Rectangle;
  private portraitShadow: Phaser.GameObjects.Rectangle;
  private portraitBg: Phaser.GameObjects.Rectangle;
  private portraitImage: Phaser.GameObjects.Image;
  private portraitMaskGraphics: Phaser.GameObjects.Graphics;
  private speakerText: Phaser.GameObjects.Text;
  private bodyText: Phaser.GameObjects.Text;
  private pageText: Phaser.GameObjects.Text;
  private hintKeyBox: Phaser.GameObjects.Rectangle;
  private hintKeyText: Phaser.GameObjects.Text;
  private hintText: Phaser.GameObjects.Text;

  private activeSequence: DialogueSequence = [];
  private currentIndex = 0;
  private activeIsOpen = false;
  private isDestroyed = false;

  constructor(private scene: Phaser.Scene) {
    const panelX = this.scene.scale.width / 2;
    const panelY = this.scene.scale.height - PANEL_MARGIN - PANEL_HEIGHT / 2;
    const hintRight = PANEL_WIDTH / 2 - PANEL_PADDING;

    this.container = this.scene.add
      .container(panelX, panelY)
      .setScrollFactor(0)
      .setDepth(DEPTH.dialogue)
      .setVisible(false);

    this.panelShadow = this.scene.add.rectangle(
      4,
      4,
      PANEL_WIDTH,
      PANEL_HEIGHT,
      UI_THEME.colors.shadow,
      UI_THEME.alpha.shadow,
    );
    this.panelBg = this.scene.add.rectangle(
      0,
      0,
      PANEL_WIDTH,
      PANEL_HEIGHT,
      UI_THEME.colors.surface,
      0.96,
    );
    this.actorAccent = this.scene.add.rectangle(
      PANEL_LEFT + PANEL_PADDING / 2,
      0,
      ACCENT_WIDTH,
      PANEL_HEIGHT - PANEL_PADDING * 2,
      UI_THEME.colors.interactionAccent,
    );

    this.portraitShadow = this.scene.add.rectangle(
      panelX + PORTRAIT_X + 3,
      panelY + 3,
      PORTRAIT_BACKDROP_SIZE,
      PORTRAIT_BACKDROP_SIZE,
      UI_THEME.colors.shadow,
      UI_THEME.alpha.shadow,
    ).setScrollFactor(0).setDepth(DEPTH.dialogue + 1).setVisible(false);
    this.portraitBg = this.scene.add.rectangle(
      panelX + PORTRAIT_X,
      panelY,
      PORTRAIT_BACKDROP_SIZE,
      PORTRAIT_BACKDROP_SIZE,
      UI_THEME.colors.surfaceElevated,
      0.9,
    ).setScrollFactor(0).setDepth(DEPTH.dialogue + 1).setVisible(false);
    this.portraitImage = this.scene.add
      .image(panelX + PORTRAIT_X, panelY, '')
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.dialogue + 2)
      .setVisible(false);

    this.portraitMaskGraphics = this.scene.make.graphics().setScrollFactor(0);
    this.portraitMaskGraphics.fillStyle(0xffffff);
    this.portraitMaskGraphics.fillRect(
      panelX + PORTRAIT_X - PORTRAIT_SIZE / 2,
      panelY - PORTRAIT_SIZE / 2,
      PORTRAIT_SIZE,
      PORTRAIT_SIZE,
    );
    this.portraitImage.setMask(this.portraitMaskGraphics.createGeometryMask());

    this.speakerText = this.scene.add.text(CONTENT_X_WITHOUT_PORTRAIT, SPEAKER_Y, '', {
      fontSize: '14px',
      fontStyle: 'bold',
    });
    this.bodyText = this.scene.add.text(CONTENT_X_WITHOUT_PORTRAIT, BODY_Y, '', {
      fontSize: '15px',
      color: UI_THEME.colors.textPrimary,
      lineSpacing: 3,
      wordWrap: { width: TEXT_WIDTH_WITHOUT_PORTRAIT },
    });
    this.pageText = this.scene.add.text(CONTENT_X_WITHOUT_PORTRAIT, FOOTER_Y, '', {
      fontSize: '12px',
      color: UI_THEME.colors.textSecondary,
    }).setOrigin(0, 1);
    this.hintText = this.scene.add.text(hintRight, FOOTER_Y, HINT_LABEL, {
      fontSize: '12px',
      color: UI_THEME.colors.textSecondary,
    }).setOrigin(1, 1);

    const hintKeyX = hintRight - this.hintText.width - CONTENT_GAP - KEYCAP_SIZE / 2;
    this.hintKeyBox = this.scene.add.rectangle(
      hintKeyX,
      FOOTER_Y - FOOTER_HEIGHT / 2,
      KEYCAP_SIZE,
      KEYCAP_SIZE,
      UI_THEME.colors.surfaceElevated,
    );
    this.hintKeyBox.setStrokeStyle(1, UI_THEME.colors.interactionAccent, 0.65);
    this.hintKeyText = this.scene.add.text(hintKeyX, FOOTER_Y - FOOTER_HEIGHT / 2, 'E', {
      fontSize: '11px',
      fontStyle: 'bold',
      color: UI_THEME.colors.textPrimary,
    }).setOrigin(0.5);

    this.container.add([
      this.panelShadow,
      this.panelBg,
      this.actorAccent,
      this.speakerText,
      this.bodyText,
      this.pageText,
      this.hintKeyBox,
      this.hintKeyText,
      this.hintText,
    ]);
  }

  open(sequence: DialogueSequence): void {
    if (this.isDestroyed || sequence.length === 0) return;

    this.activeSequence = sequence;
    this.currentIndex = 0;
    this.activeIsOpen = true;
    this.container.setVisible(true);
    this.renderCurrentPage();
  }

  advance(): 'advanced' | 'closed' {
    if (this.isDestroyed || !this.activeIsOpen) return 'closed';

    this.currentIndex += 1;
    if (this.currentIndex >= this.activeSequence.length) {
      this.close();
      return 'closed';
    }

    this.renderCurrentPage();
    return 'advanced';
  }

  close(): void {
    if (!this.isDestroyed) {
      this.container.setVisible(false);
      this.setPortraitVisible(false);
    }
    this.activeIsOpen = false;
    this.activeSequence = [];
    this.currentIndex = 0;
  }

  get isOpen(): boolean {
    return this.activeIsOpen;
  }

  destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    this.portraitImage.clearMask(true);
    this.portraitMaskGraphics.destroy();
    this.portraitShadow.destroy();
    this.portraitBg.destroy();
    this.portraitImage.destroy();
    this.container.destroy();
    this.activeSequence = [];
    this.activeIsOpen = false;
  }

  private renderCurrentPage(): void {
    if (this.isDestroyed) return;

    const line = this.activeSequence[this.currentIndex];
    if (!line) return;

    const actor = DIALOGUE_ACTORS[line.actorId];
    const hasPortrait = Boolean(actor?.portraitKey && this.scene.textures.exists(actor.portraitKey));

    this.actorAccent.setFillStyle(actor?.accentColor ?? UI_THEME.colors.interactionAccent);
    this.speakerText.setText(actor?.displayName ?? line.actorId);
    this.speakerText.setColor(actor?.nameColor ?? UI_THEME.colors.textPrimary);
    this.bodyText.setText(line.text);
    this.pageText.setText(`${this.currentIndex + 1} / ${this.activeSequence.length}`);

    if (hasPortrait && actor.portraitKey) {
      this.portraitImage.setTexture(actor.portraitKey).setDisplaySize(PORTRAIT_SIZE, PORTRAIT_SIZE);
      this.setPortraitVisible(true);
      this.setContentPosition(CONTENT_X_WITH_PORTRAIT, TEXT_WIDTH_WITH_PORTRAIT);
      return;
    }

    this.setPortraitVisible(false);
    this.setContentPosition(CONTENT_X_WITHOUT_PORTRAIT, TEXT_WIDTH_WITHOUT_PORTRAIT);
  }

  private setPortraitVisible(visible: boolean): void {
    this.portraitShadow.setVisible(visible);
    this.portraitBg.setVisible(visible);
    this.portraitImage.setVisible(visible);
  }

  private setContentPosition(contentX: number, wordWrapWidth: number): void {
    this.speakerText.setX(contentX);
    this.bodyText.setX(contentX).setWordWrapWidth(wordWrapWidth);
    this.pageText.setX(contentX);
  }
}
