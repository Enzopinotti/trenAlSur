import Phaser from 'phaser';
import { DebugOverlay } from '@/game/systems/DebugOverlay';
import type { Season } from '@/game/config';
import { RETIRO_CONFIG } from '@/game/levels/retiro/retiro.config';
import {
  createRetiroEnvironment,
  type RetiroEnvironment,
} from '@/game/levels/retiro/createRetiroEnvironment';
import { bus } from '@/core/events/bus';
import { saveService } from '@/core/save/SaveService';
import { WorldControls } from '@/game/input/WorldControls';
import { Player, registerPlayerAnimations } from '@/game/entities/Player';
import { Foreman } from '@/game/entities/Foreman';
import { AffTerminal } from '@/game/entities/AffTerminal';
import { resolveAffTerminalState } from '@/game/entities/affTerminal.types';
import { TrainCoach } from '@/game/entities/TrainCoach';
import { DialoguePanel } from '@/game/ui/DialoguePanel';
import { WorldHud } from '@/game/ui/WorldHud';
import {
  InteractionSystem,
} from '@/game/interactions/InteractionSystem';
import type { Interactable } from '@/game/interactions/interaction.types';
import { WorldDebugRenderer } from '@/game/debug/WorldDebugRenderer';
import {
  TutorialStep,
  type InteractableId,
} from '@/game/tutorial/retiroTutorial.types';
import {
  getRetiroObjective,
  transitionRetiroTutorial,
} from '@/game/tutorial/RetiroTutorial';

const PLAYER_SPEED = 190;

type RetiroInteractable = Interactable<InteractableId>;

interface WorldSceneData {
  day?: number;
  season?: Season;
  player?: { x: number; y: number };
  tutorialStep?: TutorialStep;
}

export default class WorldScene extends Phaser.Scene {
  private overlay?: DebugOverlay;
  private controls?: WorldControls;
  private dialoguePanel?: DialoguePanel;
  private hud?: WorldHud;
  private worldDebugRenderer?: WorldDebugRenderer;

  private day!: number;
  private season!: Season;
  private initialPlayerPos: { x: number; y: number } = {
    x: RETIRO_CONFIG.playerSpawn.x,
    y: RETIRO_CONFIG.playerSpawn.y,
  };

  private player!: Player;
  private foreman!: Foreman;
  private affTerminal!: AffTerminal;
  private trainCoach!: TrainCoach;
  private environment?: RetiroEnvironment;
  private colliders: Phaser.Physics.Arcade.Collider[] = [];

  private tutorialStep: TutorialStep = TutorialStep.TALK_TO_FOREMAN;
  private readonly interactionSystem = new InteractionSystem<RetiroInteractable>();
  private interactables: RetiroInteractable[] = [];
  private pendingObjectiveText: string | null = null;
  private shouldRefreshInteractionPrompt = false;

  constructor() {
    super('WorldScene');
  }

  init(data: WorldSceneData) {
    this.day = data?.day ?? 1;
    this.season = data?.season ?? RETIRO_CONFIG.defaultSeason;
    this.initialPlayerPos = data?.player
      ? { x: data.player.x, y: data.player.y }
      : {
          x: RETIRO_CONFIG.playerSpawn.x,
          y: RETIRO_CONFIG.playerSpawn.y,
        };
    this.tutorialStep = data?.tutorialStep ?? TutorialStep.TALK_TO_FOREMAN;
    this.pendingObjectiveText = null;
    this.interactionSystem.clear();
    this.shouldRefreshInteractionPrompt = false;
  }

  create() {
    const { width: worldWidth, height: worldHeight } = RETIRO_CONFIG.world;
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    registerPlayerAnimations(this);
    this.environment = createRetiroEnvironment(
      this,
      RETIRO_CONFIG.environment,
      RETIRO_CONFIG.world,
    );
    this.createPlayer();
    this.createCharacters();
    this.createInteractables();

    this.colliders = [
      this.physics.add.collider(this.player, this.environment.collisionGroup),
      this.physics.add.collider(this.player, this.foreman),
      this.physics.add.collider(this.player, this.affTerminal),
      this.physics.add.collider(this.player, this.trainCoach),
    ];

    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setDeadzone(
      RETIRO_CONFIG.camera.deadzoneWidth,
      RETIRO_CONFIG.camera.deadzoneHeight,
    );
    this.cameras.main.startFollow(
      this.player,
      true,
      RETIRO_CONFIG.camera.lerpX,
      RETIRO_CONFIG.camera.lerpY,
    );

    const keyboard = this.input.keyboard;
    if (!keyboard) {
      throw new Error('[WorldScene] No se encontró el plugin de teclado (KeyboardPlugin) en la escena.');
    }
    this.controls = new WorldControls(keyboard);
    this.dialoguePanel = new DialoguePanel(this);
    this.hud = new WorldHud(this);
    this.worldDebugRenderer = new WorldDebugRenderer(this);
    this.hud.showLocationIntro({ location: 'Retiro', day: this.day });
    this.hud.setObjective(getRetiroObjective(this.tutorialStep));

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handleShutdown, this);
    this.overlay = new DebugOverlay(this);
    this.overlay.mount();
  }

  update(time: number, delta: number) {
    if (this.controls?.justPressedMenu()) {
      this.scene.start('MenuScene');
      return;
    }

    if (this.controls?.justPressedToggleDebug()) {
      this.worldDebugRenderer?.toggle();
    }

    if (this.controls?.justPressedSave()) {
      this.handleSave();
    } else if (this.controls?.justPressedInteract()) {
      this.interact();
    }

    this.updateMovement();
    this.updateInteractionTarget();
    this.updateAffTerminalState();
    this.worldDebugRenderer?.render({
      bodies: [
        { label: 'Player', body: this.player.body },
        { label: 'Foreman', body: this.foreman.body },
        { label: 'AffTerminal', body: this.affTerminal.body },
        { label: 'TrainCoach', body: this.trainCoach.body },
      ],
      interactables: this.interactables,
      currentTarget: this.interactionSystem.currentTarget,
      walkableAreas: RETIRO_CONFIG.environment.walkableAreas,
    });
    this.overlay?.update(time, delta);
  }

  private createPlayer() {
    this.player = new Player(this, this.initialPlayerPos.x, this.initialPlayerPos.y);
    this.player.face(RETIRO_CONFIG.playerSpawn.facing);
  }

  private createCharacters() {
    this.foreman = new Foreman(
      this,
      RETIRO_CONFIG.foreman.x,
      RETIRO_CONFIG.foreman.y,
      RETIRO_CONFIG.foreman,
    );
    this.trainCoach = new TrainCoach(this, RETIRO_CONFIG.trainCoach);
  }

  private createInteractables() {
    this.affTerminal = new AffTerminal(
      this,
      RETIRO_CONFIG.affTerminal.x,
      RETIRO_CONFIG.affTerminal.y,
      RETIRO_CONFIG.affTerminal,
    );
    this.interactables = [
      {
        id: 'foreman',
        interactionLabel: RETIRO_CONFIG.foreman.interactionLabel,
        getPosition: () => ({ x: this.foreman.x, y: this.foreman.y }),
        radius: RETIRO_CONFIG.foreman.interactionRadius,
      },
      {
        id: 'affBoard',
        interactionLabel: RETIRO_CONFIG.affTerminal.interactionLabel,
        getPosition: () => this.affTerminal.getInteractionPoint(),
        radius: RETIRO_CONFIG.affTerminal.interactionRadius,
      },
      {
        id: 'trainDoor',
        interactionLabel: RETIRO_CONFIG.trainCoach.door.interactionLabel,
        getPosition: () => this.trainCoach.getDoorInteractionPoint(),
        radius: RETIRO_CONFIG.trainCoach.door.interactionRadius,
      },
    ];
  }

  private updateMovement() {
    if (this.dialoguePanel?.isOpen) {
      this.player.freeze();
      return;
    }

    const movement = this.controls?.getMovement() ?? { x: 0, y: 0 };
    if (movement.x !== 0 || movement.y !== 0) {
      this.player.move(movement, PLAYER_SPEED);
    } else {
      this.player.freeze();
    }
  }

  private updateInteractionTarget() {
    if (this.dialoguePanel?.isOpen) {
      this.interactionSystem.clear();
      this.hud?.hideInteractionPrompt();
      return;
    }

    if (this.shouldRefreshInteractionPrompt) {
      this.shouldRefreshInteractionPrompt = false;
      return;
    }

    const previousTargetId = this.interactionSystem.currentTarget?.id ?? null;
    const nextTarget = this.interactionSystem.update(this.player, this.interactables);
    if (previousTargetId === (nextTarget?.id ?? null)) return;

    if (nextTarget) {
      this.hud?.showInteractionPrompt(nextTarget.interactionLabel);
    } else {
      this.hud?.hideInteractionPrompt();
    }
  }

  private updateAffTerminalState() {
    const interactionPoint = this.affTerminal.getInteractionPoint();
    const playerInRange = !this.dialoguePanel?.isOpen
      && Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        interactionPoint.x,
        interactionPoint.y,
      ) <= RETIRO_CONFIG.affTerminal.interactionRadius;
    const slotConfirmed = this.tutorialStep === TutorialStep.RETURN_TO_TRAIN
      || this.tutorialStep === TutorialStep.COMPLETED;

    this.affTerminal.setTerminalState(
      resolveAffTerminalState(slotConfirmed, playerInRange),
    );
  }

  private interact() {
    const dialoguePanel = this.dialoguePanel;
    if (!dialoguePanel) return;

    if (dialoguePanel.isOpen) {
      if (dialoguePanel.advance() === 'closed') {
        this.applyPendingObjective();
        this.interactionSystem.clear();
        this.shouldRefreshInteractionPrompt = true;
      }
      return;
    }

    const target = this.interactionSystem.currentTarget;
    if (!target) return;

    const result = transitionRetiroTutorial(this.tutorialStep, target.id);
    this.tutorialStep = result.step;
    dialoguePanel.open(result.dialogue);
    this.pendingObjectiveText = result.stepChanged ? result.objectiveText : null;
  }

  private applyPendingObjective() {
    if (!this.pendingObjectiveText) return;

    this.hud?.setObjective(this.pendingObjectiveText);
    this.pendingObjectiveText = null;
  }

  private async handleSave() {
    if (this.dialoguePanel?.isOpen) return;
    try {
      await saveService.save({
        id: 'slot-1',
        label: 'Partida 1',
        updatedAt: Date.now(),
        state: {
          version: 2,
          day: this.day,
          season: this.season,
          tutorialStep: this.tutorialStep,
          player: { x: this.player.x, y: this.player.y },
        },
      });
      bus.emit('ui:toast', '💾 Partida guardada.');
    } catch (error: unknown) {
      console.error('[WorldScene] No se pudo guardar la partida:', error);
      bus.emit('ui:toast', '❌ No se pudo guardar la partida.');
    }
  }

  private handleShutdown() {
    for (const collider of this.colliders) {
      collider.destroy();
    }
    this.colliders = [];
    for (const tween of this.environment?.ambientTweens ?? []) {
      tween.stop();
      this.tweens.remove(tween);
    }
    this.environment = undefined;
    this.pendingObjectiveText = null;
    this.interactionSystem.clear();
    this.shouldRefreshInteractionPrompt = false;
    this.interactables = [];
    this.controls?.destroy();
    this.controls = undefined;
    this.hud?.destroy();
    this.hud = undefined;
    this.dialoguePanel?.destroy();
    this.dialoguePanel = undefined;
    this.overlay?.destroy();
    this.overlay = undefined;
    this.worldDebugRenderer?.destroy();
    this.worldDebugRenderer = undefined;
  }
}
