import Phaser from 'phaser';
import { DebugOverlay } from '@/game/systems/DebugOverlay';
import type { Season } from '@/game/config';
import { RETIRO_CONFIG } from '@/game/levels/retiro/retiro.config';
import { DEPTH, depthFromFeet } from '@/game/rendering/depth';
import { bus } from '@/core/events/bus';
import { saveService } from '@/core/save/SaveService';
import { WorldControls } from '@/game/input/WorldControls';
import { Player, registerPlayerAnimations } from '@/game/entities/Player';
import { Foreman } from '@/game/entities/Foreman';
import { AffTerminal } from '@/game/entities/AffTerminal';
import { resolveAffTerminalState } from '@/game/entities/affTerminal.types';
import { DialoguePanel } from '@/game/ui/DialoguePanel';
import { WorldHud } from '@/game/ui/WorldHud';
import {
  TutorialStep,
  InteractableId,
} from '@/game/tutorial/retiroTutorial.types';
import {
  getRetiroObjective,
  transitionRetiroTutorial,
} from '@/game/tutorial/RetiroTutorial';

const PLAYER_SPEED = 190;

interface InteractableObject {
  id: InteractableId;
  name: string;
  interactionLabel: string;
  x: number;
  y: number;
  radius: number;
}

export default class WorldScene extends Phaser.Scene {
  // Subsistemas
  private overlay?: DebugOverlay;
  private controls?: WorldControls;
  private dialoguePanel?: DialoguePanel;
  private hud?: WorldHud;

  // Estado de juego
  private day!: number;
  private season!: Season;
  private initialPlayerPos: { x: number; y: number } = {
    x: RETIRO_CONFIG.playerSpawn.x,
    y: RETIRO_CONFIG.playerSpawn.y,
  };

  // Entidades
  private player!: Player;
  private foreman!: Foreman;
  private affTerminal!: AffTerminal;

  // Grupos de físicas
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;

  // Semantic references for future asset replacement
  private trainDoor!: Phaser.GameObjects.Rectangle;
  private trainBody!: Phaser.GameObjects.Rectangle;
  private affOffice!: Phaser.GameObjects.Rectangle;

  // Tutorial
  private tutorialStep: TutorialStep = TutorialStep.TALK_TO_FOREMAN;
  private interactables: InteractableObject[] = [];
  private currentTarget: InteractableObject | null = null;
  private pendingObjectiveText: string | null = null;
  private shouldRefreshInteractionPrompt = false;

  constructor() {
    super('WorldScene');
  }

  init(data: { day?: number; season?: Season; player?: { x: number; y: number } }) {
    this.day = data?.day ?? 1;
    this.season = data?.season ?? 'Primavera';
    this.initialPlayerPos = data?.player
      ? { x: data.player.x, y: data.player.y }
      : {
          x: RETIRO_CONFIG.playerSpawn.x,
          y: RETIRO_CONFIG.playerSpawn.y,
        };
    this.tutorialStep = TutorialStep.TALK_TO_FOREMAN;
    this.pendingObjectiveText = null;
    this.currentTarget = null;
    this.shouldRefreshInteractionPrompt = false;
  }

  create() {
    const { width: worldWidth, height: worldHeight } = RETIRO_CONFIG.world;

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.obstacles = this.physics.add.staticGroup();

    registerPlayerAnimations(this);

    this.createEnvironment(worldWidth, worldHeight);
    this.createPlayer();
    this.createCharacters();
    this.createInteractables();

    // Colisiones y cámara
    this.physics.add.collider(this.player, this.obstacles);
    this.physics.add.collider(this.player, this.foreman);
    this.physics.add.collider(this.player, this.affTerminal);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Controles — validación explícita
    const keyboard = this.input.keyboard;
    if (!keyboard) {
      throw new Error('[WorldScene] No se encontró el plugin de teclado (KeyboardPlugin) en la escena.');
    }
    this.controls = new WorldControls(keyboard);

    // Componentes de UI
    this.dialoguePanel = new DialoguePanel(this);
    this.hud = new WorldHud(this);

    // Configuración inicial del HUD
    this.hud.showLocationIntro({ location: 'Retiro', day: this.day });
    this.hud.setObjective(getRetiroObjective(this.tutorialStep));

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handleShutdown, this);

    this.overlay = new DebugOverlay(this);
    this.overlay.mount();
  }

  update(_time: number, delta: number) {
    // 1. Menú (ESC)
    if (this.controls?.justPressedMenu()) {
      this.scene.start('MenuScene');
      return;
    }

    // 2. Guardado (G) o Interacción (E)
    if (this.controls?.justPressedSave()) {
      this.handleSave();
    } else if (this.controls?.justPressedInteract()) {
      this.interact();
    }

    // 3. Movimiento (bloqueado durante diálogo)
    this.updateMovement();

    // 4. Target interactuable
    this.updateInteractionTarget();
    this.updateAffTerminalState();

    // 5. Debug overlay
    this.overlay?.update(_time, delta);
  }

  // ── Construcción del escenario ─────────────────────────────────────────────

  private createEnvironment(width: number, height: number) {
    // Placeholder futuro: tileset del piso de la estación Retiro
    this.add.rectangle(width / 2, height / 2, width, height, 0x3d2e24).setDepth(DEPTH.background);

    // Placeholder futuro: textura de baldosa/concreto del hall de Retiro
    this.add.rectangle(600, 250, 1100, 360, 0x5a3d28).setDepth(DEPTH.ground);
    // Placeholder futuro: textura del andén de embarque
    this.add.rectangle(600, 480, 1100, 100, 0x6e523c).setDepth(DEPTH.ground);

    // Placeholder futuro: sprite/tileset de vías ferreas y balasto
    this.add.rectangle(600, 670, 1200, 260, 0x1c1613).setDepth(DEPTH.ground);
    this.add.rectangle(600, 600, 1200, 8, 0x8b5a2b).setDepth(DEPTH.structures);
    this.add.rectangle(600, 630, 1200, 8, 0x8b5a2b).setDepth(DEPTH.structures);

    const tracksBarrier = this.add.rectangle(600, 660, 1200, 180, 0x000000, 0);
    this.obstacles.add(tracksBarrier);

    // Placeholder futuro: estructuras de muros de ladrillo de Retiro
    const wallTop = this.add.rectangle(600, 35, 1200, 70, 0x2b1d16);
    const wallLeft = this.add.rectangle(25, 400, 50, 800, 0x2b1d16);
    const wallRight = this.add.rectangle(1175, 400, 50, 800, 0x2b1d16);
    this.obstacles.add(wallTop);
    this.obstacles.add(wallLeft);
    this.obstacles.add(wallRight);

    // Oficina de la AFF
    // Placeholder futuro: estructura modular/puesto turquesa de la AFF
    this.affOffice = this.add.rectangle(950, 210, 240, 180, 0x028090).setDepth(DEPTH.structures);
    this.obstacles.add(this.affOffice);
    this.add.text(950, 160, 'OFICINA AFF', { fontSize: '13px', color: '#94a3b8' }).setOrigin(0.5).setDepth(DEPTH.worldLabels);

    // Tren al Sur detenido en el andén
    // Placeholder futuro: sprite del convoy/tren federal Tren al Sur
    this.trainBody = this.add.rectangle(550, 605, 780, 70, 0x80091b).setDepth(DEPTH.structures);
    this.obstacles.add(this.trainBody);
    this.add.text(550, 615, 'TREN AL SUR', { fontSize: '13px', color: '#cbd5e1' }).setOrigin(0.5).setDepth(DEPTH.worldLabels);

    // Puerta del Tren al Sur
    // Placeholder futuro: sprite de la escotilla/puerta de acceso al Tren
    this.trainDoor = this.add
      .rectangle(RETIRO_CONFIG.trainDoor.x, RETIRO_CONFIG.trainDoor.y, 50, 15, 0x48cae4)
      .setDepth(depthFromFeet(RETIRO_CONFIG.trainDoor.y));
    this.add
      .text(RETIRO_CONFIG.trainDoor.x, RETIRO_CONFIG.trainDoor.y - 20, 'PUERTA', { fontSize: '11px', color: '#94a3b8' })
      .setOrigin(0.5)
      .setDepth(DEPTH.worldLabels);

    // Bancos de la estación (2)
    // Placeholder futuro: sprites de bancos de madera/hierro
    const bench1 = this.add.rectangle(450, 330, 90, 30, 0x5a3d28);
    const bench2 = this.add.rectangle(670, 330, 90, 30, 0x5a3d28);
    this.obstacles.add(bench1);
    this.obstacles.add(bench2);

    // Cajas de carga
    // Placeholder futuro: sprites de contenedores/cajas de madera
    const crate1 = this.add.rectangle(780, 230, 45, 45, 0x8b4513);
    const crate2 = this.add.rectangle(780, 280, 45, 45, 0x8b4513);
    const crate3 = this.add.rectangle(200, 330, 45, 45, 0x8b4513);
    this.obstacles.add(crate1);
    this.obstacles.add(crate2);
    this.obstacles.add(crate3);
  }

  private createPlayer() {
    this.player = new Player(this, this.initialPlayerPos.x, this.initialPlayerPos.y);
    this.player.face(RETIRO_CONFIG.playerSpawn.facing);
  }

  private createCharacters() {
    this.foreman = new Foreman(this, RETIRO_CONFIG.foreman.x, RETIRO_CONFIG.foreman.y);
  }

  private createInteractables() {
    this.affTerminal = new AffTerminal(
      this,
      RETIRO_CONFIG.affBoard.x,
      RETIRO_CONFIG.affBoard.y,
    );
    const terminalInteractionPoint = this.affTerminal.getInteractionPoint();

    this.interactables = [
      {
        id: 'foreman',
        name: 'Capataz',
        interactionLabel: RETIRO_CONFIG.foreman.interactionLabel,
        x: RETIRO_CONFIG.foreman.x,
        y: RETIRO_CONFIG.foreman.y,
        radius: RETIRO_CONFIG.foreman.interactionRadius,
      },
      {
        id: 'affBoard',
        name: 'Terminal AFF',
        interactionLabel: RETIRO_CONFIG.affBoard.interactionLabel,
        x: terminalInteractionPoint.x,
        y: terminalInteractionPoint.y,
        radius: RETIRO_CONFIG.affBoard.interactionRadius,
      },
      {
        id: 'trainDoor',
        name: 'Puerta del Tren',
        interactionLabel: RETIRO_CONFIG.trainDoor.interactionLabel,
        x: RETIRO_CONFIG.trainDoor.x,
        y: RETIRO_CONFIG.trainDoor.y,
        radius: RETIRO_CONFIG.trainDoor.interactionRadius,
      },
    ];
  }

  // ── Movimiento ─────────────────────────────────────────────────────────────

  private updateMovement() {
    if (this.dialoguePanel?.isOpen) {
      this.player.freeze();
      return;
    }

    const movement = this.controls?.getMovement() ?? { x: 0, y: 0 };
    const isMoving = movement.x !== 0 || movement.y !== 0;

    if (isMoving) {
      this.player.move(movement, PLAYER_SPEED);
    } else {
      this.player.freeze();
    }
  }

  // ── Interacción ────────────────────────────────────────────────────────────

  private updateInteractionTarget() {
    if (this.dialoguePanel?.isOpen) {
      this.hud?.hideInteractionPrompt();
      return;
    }

    if (this.shouldRefreshInteractionPrompt) {
      this.shouldRefreshInteractionPrompt = false;
      return;
    }

    let nearest: InteractableObject | null = null;
    let minDist = Infinity;

    for (const obj of this.interactables) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, obj.x, obj.y);
      if (dist <= obj.radius && dist < minDist) {
        minDist = dist;
        nearest = obj;
      }
    }

    const previousTargetId = this.currentTarget?.id ?? null;
    const nextTargetId = nearest?.id ?? null;

    this.currentTarget = nearest;

    // Solo actualizar la UI del HUD si el objetivo cambió
    if (previousTargetId !== nextTargetId) {
      if (this.currentTarget) {
        this.hud?.showInteractionPrompt(this.currentTarget.interactionLabel);
      } else {
        this.hud?.hideInteractionPrompt();
      }
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
      ) <= RETIRO_CONFIG.affBoard.interactionRadius;
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
        this.currentTarget = null;
        this.shouldRefreshInteractionPrompt = true;
      }
      return;
    }

    if (!this.currentTarget) return;

    const result = transitionRetiroTutorial(this.tutorialStep, this.currentTarget.id);
    this.tutorialStep = result.step;
    dialoguePanel.open(result.dialogue);
    this.pendingObjectiveText = result.stepChanged ? result.objectiveText : null;
  }

  private applyPendingObjective() {
    if (!this.pendingObjectiveText) return;

    this.hud?.setObjective(this.pendingObjectiveText);
    this.pendingObjectiveText = null;
  }

  // ── Guardado ───────────────────────────────────────────────────────────────

  private async handleSave() {
    if (this.dialoguePanel?.isOpen) return;
    try {
      await saveService.save({
        id: 'slot-1',
        label: 'Partida 1',
        updatedAt: Date.now(),
        state: {
          version: 1,
          day: this.day,
          season: this.season,
          player: { x: this.player.x, y: this.player.y, name: 'Dev' },
        },
      });
      bus.emit('ui:toast', '💾 Partida guardada.');
    } catch (error: unknown) {
      console.error('[WorldScene] No se pudo guardar la partida:', error);
      bus.emit('ui:toast', '❌ No se pudo guardar la partida.');
    }
  }

  // ── Ciclo de vida ──────────────────────────────────────────────────────────

  private handleShutdown() {
    this.pendingObjectiveText = null;
    this.currentTarget = null;
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
  }
}
