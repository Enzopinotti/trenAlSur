import Phaser from 'phaser';
import { AFF_OFFICE_CONFIG } from '@/game/levels/affOffice/affOffice.config';
import { createAffOfficeEnvironment, type AffOfficeEnvironment } from '@/game/levels/affOffice/createAffOfficeEnvironment';
import { isAffOfficeEntryData, type AffOfficeEntryData } from '@/game/levels/affOffice/affOffice.types';
import { Player, registerPlayerAnimations } from '@/game/entities/Player';
import { WorldControls } from '@/game/input/WorldControls';
import { DialoguePanel } from '@/game/ui/DialoguePanel';
import { WorldHud } from '@/game/ui/WorldHud';
import { InteractionSystem } from '@/game/interactions/InteractionSystem';
import type { Interactable } from '@/game/interactions/interaction.types';
import { WorldDebugRenderer } from '@/game/debug/WorldDebugRenderer';
import { TutorialStep } from '@/game/tutorial/retiroTutorial.types';
import { transitionRetiroTutorial } from '@/game/tutorial/RetiroTutorial';
import { AFF_CLERK_CONFIRMED, AFF_CLERK_PERMISSION } from '@/game/dialogue/affOffice/affOffice.dialogues';
import { NpcRegistry } from '@/game/npcs/npcRegistry';
import { createNpc } from '@/game/npcs/createNpc';
import { toNpcInteractable } from '@/game/npcs/npcInteractionAdapter';
import { AFF_OFFICE_NPCS } from '@/game/levels/affOffice/affOffice.npcs';

const PLAYER_SPEED = 190;
type OfficeInteractable = Interactable<'affBoard' | 'affOfficeExit'>;

export default class AffOfficeScene extends Phaser.Scene {
  private entry!: AffOfficeEntryData; private player!: Player; private controls?: WorldControls; private dialogue?: DialoguePanel; private hud?: WorldHud; private debug?: WorldDebugRenderer; private environment?: AffOfficeEnvironment; private colliders: Phaser.Physics.Arcade.Collider[] = []; private readonly interactions = new InteractionSystem<OfficeInteractable>(); private interactables: OfficeInteractable[] = []; private readonly npcs = new NpcRegistry(); private pendingTutorialTransition = false;
  constructor() { super('AffOfficeScene'); }
  init(data: unknown): void { if (!isAffOfficeEntryData(data)) throw new Error('[AffOfficeScene] Datos de entrada inválidos.'); this.entry = data; this.pendingTutorialTransition = false; this.interactions.clear(); }
  create(): void {
    const config = AFF_OFFICE_CONFIG; this.physics.world.setBounds(0, 0, config.world.width, config.world.height); registerPlayerAnimations(this); this.environment = createAffOfficeEnvironment(this, config); this.player = new Player(this, config.playerSpawn.x, config.playerSpawn.y); this.player.face(config.playerSpawn.facing);
    const clerk = createNpc(this, { id: AFF_OFFICE_NPCS.clerk.id, x: config.clerk.x, y: config.clerk.y }); const clerkVisual = this.add.rectangle(0, 0, 38, 60, 0x35534d).setOrigin(0.5, 1); clerk.add(clerkVisual); this.npcs.add(clerk);
    this.colliders = [this.physics.add.collider(this.player, this.environment.collisionGroup)];
    this.interactables = [
      toNpcInteractable(clerk, 'affBoard', 'Hablar con Empleado AFF', config.clerk.interactionRadius, () => ({ x: config.clerk.interactionX, y: config.clerk.interactionY })),
      { id: 'affOfficeExit', interactionLabel: config.exit.interactionLabel, radius: config.exit.interactionRadius, getPosition: () => ({ x: config.exit.x, y: config.exit.y }) },
    ];
    if (!this.input.keyboard) throw new Error('[AffOfficeScene] No se encontró el teclado.'); this.controls = new WorldControls(this.input.keyboard); this.dialogue = new DialoguePanel(this); this.hud = new WorldHud(this); this.hud.setObjective('Gestioná el permiso ferroviario.'); this.debug = new WorldDebugRenderer(this); this.cameras.main.setBounds(0, 0, config.world.width, config.world.height).setRoundPixels(true);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
  }
  update(): void {
    if (this.controls?.justPressedToggleDebug()) this.debug?.toggle();
    if (this.controls?.justPressedMenu()) { if (!this.dialogue?.isOpen) this.returnToRetiro(); return; }
    if (this.controls?.justPressedInteract()) this.interact();
    if (!this.dialogue?.isOpen) { const input = this.controls?.getMovement() ?? { x: 0, y: 0 }; if (input.x || input.y) this.player.move(input, PLAYER_SPEED); else this.player.freeze(); const previous = this.interactions.currentTarget?.id; const target = this.interactions.update(this.player, this.interactables); if (previous !== target?.id) target ? this.hud?.showInteractionPrompt(target.interactionLabel) : this.hud?.hideInteractionPrompt(); } else { this.player.freeze(); this.hud?.hideInteractionPrompt(); }
    this.debug?.render({ bodies: [{ label: 'Player', body: this.player.body }], interactables: this.interactables, currentTarget: this.interactions.currentTarget, walkableAreas: AFF_OFFICE_CONFIG.walkableAreas });
  }
  private interact(): void {
    const dialogue = this.dialogue;
    if (!dialogue) return;
    if (dialogue.isOpen) {
      if (dialogue.advance() === 'closed' && this.pendingTutorialTransition) {
        this.entry = { ...this.entry, tutorialStep: transitionRetiroTutorial(this.entry.tutorialStep, 'affBoard').step };
        this.pendingTutorialTransition = false;
        this.hud?.setObjective('Permiso aprobado. Volvé al andén.');
      }
      return;
    }
    const target = this.interactions.currentTarget;
    if (!target) return;
    if (target.id === 'affOfficeExit') { this.returnToRetiro(); return; }
    if (this.entry.tutorialStep === TutorialStep.CHECK_AFF_BOARD) { this.pendingTutorialTransition = true; dialogue.open(AFF_CLERK_PERMISSION); } else { dialogue.open(AFF_CLERK_CONFIRMED); }
  }
  private returnToRetiro(): void { this.scene.start('WorldScene', { kind: 'returnedFromAffOffice', day: this.entry.day, season: this.entry.season, tutorialStep: this.entry.tutorialStep, player: this.entry.returnPosition }); }
  private shutdown(): void { this.colliders.forEach((collider) => collider.destroy()); this.colliders = []; this.environment?.ambientTweens.forEach((tween) => { tween.stop(); this.tweens.remove(tween); }); this.environment = undefined; this.controls?.destroy(); this.dialogue?.destroy(); this.hud?.destroy(); this.debug?.destroy(); this.npcs.destroy(); this.interactions.clear(); this.interactables = []; }
}
