import Phaser from 'phaser';
import type { Season } from '@/game/config';
import { RETIRO_CONFIG } from '@/game/levels/retiro/retiro.config';
import { createRetiroEnvironment, type RetiroEnvironment } from '@/game/levels/retiro/createRetiroEnvironment';
import { bus } from '@/core/events/bus';
import { saveService } from '@/core/save/SaveService';
import { WorldControls } from '@/game/input/WorldControls';
import { Player, registerPlayerAnimations, type PlayerDirection } from '@/game/entities/Player';
import { Foreman } from '@/game/entities/Foreman';
import { AffOfficeExterior } from '@/game/entities/AffOfficeExterior';
import { TrainCoach } from '@/game/entities/TrainCoach';
import { DialoguePanel } from '@/game/ui/DialoguePanel';
import { WorldHud } from '@/game/ui/WorldHud';
import { InteractionSystem } from '@/game/interactions/InteractionSystem';
import type { Interactable } from '@/game/interactions/interaction.types';
import { WorldDebugRenderer } from '@/game/debug/WorldDebugRenderer';
import { TutorialStep, type InteractableId } from '@/game/tutorial/retiroTutorial.types';
import { getRetiroObjective, transitionRetiroTutorial } from '@/game/tutorial/RetiroTutorial';
import { isWorldSceneInitData, type WorldSceneInitData } from './worldScene.types';

const PLAYER_SPEED = 190;
type RetiroInteractable = Interactable<InteractableId>;

export default class WorldScene extends Phaser.Scene {
  private controls?: WorldControls; private dialoguePanel?: DialoguePanel; private hud?: WorldHud; private debug?: WorldDebugRenderer;
  private player!: Player; private foreman!: Foreman; private office!: AffOfficeExterior; private trainCoach!: TrainCoach; private environment?: RetiroEnvironment;
  private colliders: Phaser.Physics.Arcade.Collider[] = []; private readonly interactions = new InteractionSystem<RetiroInteractable>(); private interactables: RetiroInteractable[] = [];
  private day = 1; private season: Season = RETIRO_CONFIG.defaultSeason; private tutorialStep = TutorialStep.TALK_TO_FOREMAN; private playerPosition: { x: number; y: number; facing: PlayerDirection } = { ...RETIRO_CONFIG.playerSpawn }; private showIntro = true; private transitioning = false;
  constructor() { super('WorldScene'); }
  init(data: unknown): void {
    const init: WorldSceneInitData = isWorldSceneInitData(data) ? data : { kind: 'newGame' };
    this.day = init.kind === 'newGame' ? 1 : init.day; this.season = init.kind === 'newGame' ? RETIRO_CONFIG.defaultSeason : init.season;
    this.tutorialStep = init.kind === 'newGame' ? TutorialStep.TALK_TO_FOREMAN : init.tutorialStep;
    this.playerPosition = init.kind === 'newGame'
      ? { ...RETIRO_CONFIG.playerSpawn }
      : { ...init.player, facing: init.kind === 'returnedFromAffOffice' ? init.player.facing : RETIRO_CONFIG.playerSpawn.facing };
    this.showIntro = init.kind !== 'returnedFromAffOffice'; this.interactions.clear(); this.transitioning = false;
  }
  create(): void {
    const world = RETIRO_CONFIG.world; this.physics.world.setBounds(0, 0, world.width, world.height); registerPlayerAnimations(this);
    this.environment = createRetiroEnvironment(this, RETIRO_CONFIG.environment, world); this.player = new Player(this, this.playerPosition.x, this.playerPosition.y); this.player.face(this.playerPosition.facing);
    this.foreman = new Foreman(this, RETIRO_CONFIG.foreman.x, RETIRO_CONFIG.foreman.y, RETIRO_CONFIG.foreman); this.office = new AffOfficeExterior(this, RETIRO_CONFIG.affOfficeExterior); this.trainCoach = new TrainCoach(this, RETIRO_CONFIG.trainCoach);
    this.interactables = [
      { id: 'foreman', interactionLabel: RETIRO_CONFIG.foreman.interactionLabel, radius: RETIRO_CONFIG.foreman.interactionRadius, getPosition: () => ({ x: this.foreman.x, y: this.foreman.y }) },
      { id: 'affBoard', interactionLabel: RETIRO_CONFIG.affOfficeExterior.door.interactionLabel, radius: RETIRO_CONFIG.affOfficeExterior.door.interactionRadius, getPosition: () => this.office.getDoorInteractionPoint() },
      { id: 'trainDoor', interactionLabel: RETIRO_CONFIG.trainCoach.door.interactionLabel, radius: RETIRO_CONFIG.trainCoach.door.interactionRadius, getPosition: () => this.trainCoach.getDoorInteractionPoint() },
    ];
    this.colliders = [this.physics.add.collider(this.player, this.environment.collisionGroup), this.physics.add.collider(this.player, this.foreman), this.physics.add.collider(this.player, this.office), this.physics.add.collider(this.player, this.trainCoach)];
    this.cameras.main.setBounds(0, 0, world.width, world.height).setRoundPixels(true).setDeadzone(RETIRO_CONFIG.camera.deadzoneWidth, RETIRO_CONFIG.camera.deadzoneHeight).startFollow(this.player, true, RETIRO_CONFIG.camera.lerpX, RETIRO_CONFIG.camera.lerpY);
    if (!this.input.keyboard) throw new Error('[WorldScene] No se encontró el teclado.'); this.controls = new WorldControls(this.input.keyboard); this.dialoguePanel = new DialoguePanel(this); this.hud = new WorldHud(this); this.debug = new WorldDebugRenderer(this); if (this.showIntro) this.hud.showLocationIntro({ location: 'Retiro', day: this.day }); this.hud.setObjective(getRetiroObjective(this.tutorialStep));
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
  }
  update(): void {
    if (this.controls?.justPressedMenu()) { this.scene.start('MenuScene'); return; }
    if (this.controls?.justPressedToggleDebug()) this.debug?.toggle();
    if (this.controls?.justPressedSave()) void this.save(); else if (this.controls?.justPressedInteract()) this.interact();
    if (!this.dialoguePanel?.isOpen && !this.transitioning) { const input = this.controls?.getMovement() ?? { x: 0, y: 0 }; if (input.x || input.y) this.player.move(input, PLAYER_SPEED); else this.player.freeze(); const oldId = this.interactions.currentTarget?.id; const next = this.interactions.update(this.player, this.interactables); if (oldId !== next?.id) next ? this.hud?.showInteractionPrompt(next.interactionLabel) : this.hud?.hideInteractionPrompt(); } else { this.player.freeze(); this.interactions.clear(); this.hud?.hideInteractionPrompt(); }
    this.debug?.render({ bodies: [{ label: 'Player', body: this.player.body }, { label: 'Foreman', body: this.foreman.body }, { label: 'AffOfficeExterior', body: this.office.body }, { label: 'TrainCoach', body: this.trainCoach.body }], interactables: this.interactables, currentTarget: this.interactions.currentTarget, walkableAreas: RETIRO_CONFIG.environment.walkableAreas });
  }
  private interact(): void { if (this.dialoguePanel?.isOpen) { if (this.dialoguePanel.advance() === 'closed') this.hud?.setObjective(getRetiroObjective(this.tutorialStep)); return; } const target = this.interactions.currentTarget; if (!target) return; if (target.id === 'affBoard') { this.enterOffice(); return; } const result = transitionRetiroTutorial(this.tutorialStep, target.id); this.tutorialStep = result.step; this.dialoguePanel?.open(result.dialogue); }
  private enterOffice(): void { this.transitioning = true; this.player.freeze(); this.hud?.hideInteractionPrompt(); this.cameras.main.fadeOut(220, 0, 0, 0); this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('AffOfficeScene', { day: this.day, season: this.season, tutorialStep: this.tutorialStep, returnPosition: RETIRO_CONFIG.affOfficeExterior.returnPosition })); }
  private async save(): Promise<void> { if (this.dialoguePanel?.isOpen) return; try { await saveService.save({ id: 'slot-1', label: 'Partida 1', updatedAt: Date.now(), state: { version: 2, day: this.day, season: this.season, tutorialStep: this.tutorialStep, player: { x: this.player.x, y: this.player.y } } }); bus.emit('ui:toast', '💾 Partida guardada.'); } catch (error: unknown) { console.error('[WorldScene] No se pudo guardar la partida:', error); } }
  private shutdown(): void { this.colliders.forEach((collider) => collider.destroy()); this.colliders = []; this.environment?.ambientTweens.forEach((tween) => { tween.stop(); this.tweens.remove(tween); }); this.environment = undefined; this.controls?.destroy(); this.controls = undefined; this.dialoguePanel?.destroy(); this.dialoguePanel = undefined; this.hud?.destroy(); this.hud = undefined; this.debug?.destroy(); this.debug = undefined; this.interactions.clear(); this.interactables = []; }
}
