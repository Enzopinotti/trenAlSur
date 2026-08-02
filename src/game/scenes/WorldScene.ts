import Phaser from 'phaser';
import { DebugOverlay } from '@/game/systems/DebugOverlay';
import type { Season } from '@/game/config';
import { bus } from '@/core/events/bus';
import { saveService } from '@/core/save/SaveService';
import { WorldControls } from '@/game/input/WorldControls';
import { Player, registerPlayerAnimations } from '@/game/entities/Player';
import {
  TutorialStep,
  InteractableId,
} from '@/game/tutorial/retiroTutorial.types';
import {
  getRetiroObjective,
  transitionRetiroTutorial,
} from '@/game/tutorial/RetiroTutorial';
import type { DialogueSequence } from '@/game/dialogue/dialogue.types';

// ── Constantes de posición predeterminada ──────────────────────────────────
const DEFAULT_PLAYER_POSITION = { x: 250, y: 440 } as const;
const PLAYER_SPEED = 190;

// ── Interfaz de interactuables ─────────────────────────────────────────────
interface InteractableObject {
  id: InteractableId;
  name: string;
  x: number;
  y: number;
  radius: number;
}

export default class WorldScene extends Phaser.Scene {
  // Subsistemas
  private overlay!: DebugOverlay;
  private controls?: WorldControls;

  // Estado de juego
  private day!: number;
  private season!: Season;
  private initialPlayerPos: { x: number; y: number } = {
    x: DEFAULT_PLAYER_POSITION.x,
    y: DEFAULT_PLAYER_POSITION.y,
  };

  // Entidad jugador
  private player!: Player;

  // Grupos de físicas
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;

  // Semantic references for future asset replacement
  private foreman!: Phaser.GameObjects.Rectangle;
  private affBoard!: Phaser.GameObjects.Rectangle;
  private trainDoor!: Phaser.GameObjects.Rectangle;
  private trainBody!: Phaser.GameObjects.Rectangle;
  private affOffice!: Phaser.GameObjects.Rectangle;

  // Tutorial
  private tutorialStep: TutorialStep = TutorialStep.TALK_TO_FOREMAN;
  private interactables: InteractableObject[] = [];
  private currentTarget: InteractableObject | null = null;

  // Estado del diálogo por páginas
  private activeDialogue: DialogueSequence = [];
  private dialogueIndex = 0;
  private isDialogueOpen = false;

  // UI (referenciadas para actualización posterior)
  private interactionPromptText!: Phaser.GameObjects.Text;
  private objectiveText!: Phaser.GameObjects.Text;
  private dialogueContainer!: Phaser.GameObjects.Container;
  private dialogueSpeakerText!: Phaser.GameObjects.Text;
  private dialogueBodyText!: Phaser.GameObjects.Text;
  private dialoguePageText!: Phaser.GameObjects.Text;
  private dialogueHintText!: Phaser.GameObjects.Text;

  constructor() {
    super('WorldScene');
  }

  init(data: { day?: number; season?: Season; player?: { x: number; y: number } }) {
    this.day = data?.day ?? 1;
    this.season = data?.season ?? 'Primavera';
    this.initialPlayerPos = data?.player
      ? { x: data.player.x, y: data.player.y }
      : { x: DEFAULT_PLAYER_POSITION.x, y: DEFAULT_PLAYER_POSITION.y };
    this.tutorialStep = TutorialStep.TALK_TO_FOREMAN;
    this.isDialogueOpen = false;
    this.activeDialogue = [];
    this.dialogueIndex = 0;
  }

  create() {
    const WORLD_WIDTH = 1200;
    const WORLD_HEIGHT = 800;

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.obstacles = this.physics.add.staticGroup();

    // Registrar animaciones globalmente (solo si no existen)
    registerPlayerAnimations(this);

    this.createEnvironment(WORLD_WIDTH, WORLD_HEIGHT);
    this.createPlayer();
    this.createCharacters();
    this.createInteractables();
    this.createInterface();

    // Colisiones y cámara
    this.physics.add.collider(this.player, this.obstacles);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Controles — validación explícita del plugin
    const keyboard = this.input.keyboard;
    if (!keyboard) {
      throw new Error('[WorldScene] No se encontró el plugin de teclado (KeyboardPlugin) en la escena.');
    }
    this.controls = new WorldControls(keyboard);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handleShutdown, this);

    this.overlay = new DebugOverlay(this);
    this.overlay.mount();
  }

  update(_time: number, delta: number) {
    // 1. Menú (ESC) — corta el frame completo
    if (this.controls?.justPressedMenu()) {
      this.scene.start('MenuScene');
      return;
    }

    // 2. Guardado (G) y diálogo/interacción (E) son mutuamente exclusivos en el mismo frame
    if (this.controls?.justPressedSave()) {
      this.handleSave();
    } else if (this.controls?.justPressedInteract()) {
      this.interact();
    }

    // 3. Movimiento
    this.updateMovement();

    // 4. Actualizar target interactuable
    this.updateInteractionTarget();

    // 5. Debug overlay
    this.overlay.update(_time, delta);
  }

  // ── Construcción del escenario ─────────────────────────────────────────────

  private createEnvironment(width: number, height: number) {
    // Placeholder futuro: tileset del piso de la estación Retiro
    this.add.rectangle(width / 2, height / 2, width, height, 0x3d2e24).setDepth(-10);

    // Placeholder futuro: textura de baldosa/concreto del hall de Retiro
    this.add.rectangle(600, 250, 1100, 360, 0x5a3d28).setDepth(-9);
    // Placeholder futuro: textura del andén de embarque
    this.add.rectangle(600, 480, 1100, 100, 0x6e523c).setDepth(-8);

    // Placeholder futuro: sprite/tileset de vías ferreas y balasto
    this.add.rectangle(600, 670, 1200, 260, 0x1c1613).setDepth(-7);
    this.add.rectangle(600, 600, 1200, 8, 0x8b5a2b).setDepth(-6);
    this.add.rectangle(600, 630, 1200, 8, 0x8b5a2b).setDepth(-6);

    const tracksBarrier = this.add.rectangle(600, 660, 1200, 180, 0x000000, 0);
    this.obstacles.add(tracksBarrier);

    // Placeholder futuro: estructuras de muros de ladrillo de Retiro
    const wallTop = this.add.rectangle(600, 35, 1200, 70, 0x2b1d16);
    const wallLeft = this.add.rectangle(25, 400, 50, 800, 0x2b1d16);
    const wallRight = this.add.rectangle(1175, 400, 50, 800, 0x2b1d16);
    this.obstacles.add(wallTop);
    this.obstacles.add(wallLeft);
    this.obstacles.add(wallRight);

    this.add.text(600, 35, 'ESTACIÓN RETIRO — LÍNEA MITRE / AFF', { fontSize: '20px', color: '#d97706' }).setOrigin(0.5);

    // Placeholder futuro: estructura modular/puesto turquesa de la AFF
    this.affOffice = this.add.rectangle(950, 210, 240, 180, 0x028090);
    this.obstacles.add(this.affOffice);
    this.add.text(950, 160, 'OFICINA AFF', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);

    // Placeholder futuro: sprite del convoy/tren federal Tren al Sur
    this.trainBody = this.add.rectangle(550, 605, 780, 70, 0x80091b);
    this.obstacles.add(this.trainBody);
    this.add.text(550, 615, 'TREN AL SUR (CONVOY COOPERATIVO #01)', { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5);

    // Placeholder futuro: sprite de la escotilla/puerta de acceso al Tren
    this.trainDoor = this.add.rectangle(350, 565, 50, 15, 0x48cae4);
    this.add.text(350, 545, 'PUERTA', { fontSize: '12px', color: '#ffffff' }).setOrigin(0.5);

    // Placeholder futuro: sprites de bancos de madera/hierro
    const bench1 = this.add.rectangle(450, 330, 90, 30, 0x5a3d28);
    const bench2 = this.add.rectangle(670, 330, 90, 30, 0x5a3d28);
    this.obstacles.add(bench1);
    this.obstacles.add(bench2);
    this.add.text(450, 330, 'BANCO', { fontSize: '10px', color: '#bbb' }).setOrigin(0.5);
    this.add.text(670, 330, 'BANCO', { fontSize: '10px', color: '#bbb' }).setOrigin(0.5);

    // Placeholder futuro: sprites de contenedores/cajas de madera
    const crate1 = this.add.rectangle(780, 230, 45, 45, 0x8b4513);
    const crate2 = this.add.rectangle(780, 280, 45, 45, 0x8b4513);
    const crate3 = this.add.rectangle(200, 330, 45, 45, 0x8b4513);
    this.obstacles.add(crate1);
    this.obstacles.add(crate2);
    this.obstacles.add(crate3);
    this.add.text(780, 255, 'CAJAS', { fontSize: '10px', color: '#ddd' }).setOrigin(0.5);
    this.add.text(200, 330, 'CAJA', { fontSize: '10px', color: '#ddd' }).setOrigin(0.5);
  }

  private createPlayer() {
    // Placeholder futuro: reemplazado por sprite animado definitivo con tileset de Retiro
    this.player = new Player(this, this.initialPlayerPos.x, this.initialPlayerPos.y);
  }

  private createCharacters() {
    // Placeholder futuro: sprite del NPC Capataz de cuadrilla
    this.foreman = this.add.rectangle(240, 440, 32, 32, 0xb7094c);
    this.obstacles.add(this.foreman);
    this.add.text(240, 410, 'CAPATAZ', { fontSize: '13px', color: '#ffd54a' }).setOrigin(0.5);
  }

  private createInteractables() {
    // Placeholder futuro: sprite de terminal interactiva de la AFF
    this.affBoard = this.add.rectangle(810, 240, 25, 40, 0x48cae4);
    this.add.text(810, 205, 'TABLERO DE SLOTS', { fontSize: '11px', color: '#00f5d4' }).setOrigin(0.5);

    this.interactables = [
      { id: 'foreman',   name: 'Capataz',          x: this.foreman.x,   y: this.foreman.y,   radius: 70 },
      { id: 'affBoard',  name: 'Tablero AFF',       x: this.affBoard.x,  y: this.affBoard.y,  radius: 75 },
      { id: 'trainDoor', name: 'Puerta del Tren',   x: this.trainDoor.x, y: this.trainDoor.y, radius: 65 },
    ];
  }

  private createInterface() {
    // Header fijo a cámara
    this.add.text(16, 16, `Andén de Retiro — Día ${this.day}`, {
      fontSize: '22px', color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 8, y: 4 },
    }).setScrollFactor(0).setDepth(400);

    this.objectiveText = this.add.text(16, 50, '', {
      fontSize: '16px', color: '#ffd54a',
      backgroundColor: 'rgba(0,0,0,0.6)',
      padding: { x: 8, y: 4 },
    }).setScrollFactor(0).setDepth(400);

    this.setObjective(getRetiroObjective(this.tutorialStep));

    this.interactionPromptText = this.add.text(400, 480, '', {
      fontSize: '18px', color: '#00f5d4',
      backgroundColor: '#111827',
      padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(450).setVisible(false);

    // Panel de diálogo paginado
    this.dialogueContainer = this.add.container(400, 510).setScrollFactor(0).setDepth(500).setVisible(false);

    const panelBg = this.add.rectangle(0, 0, 760, 130, 0x0f172a, 0.96);
    panelBg.setStrokeStyle(2, 0x38bdf8);

    // Nombre del hablante
    this.dialogueSpeakerText = this.add.text(-365, -54, '', {
      fontSize: '13px', color: '#38bdf8',
      fontStyle: 'bold',
    });

    // Cuerpo del texto
    this.dialogueBodyText = this.add.text(-365, -34, '', {
      fontSize: '15px', color: '#f8fafc',
      wordWrap: { width: 720 },
    });

    // Indicador "E — Continuar"
    this.dialogueHintText = this.add.text(360, 46, 'E — Continuar', {
      fontSize: '12px', color: '#94a3b8',
    }).setOrigin(1, 1);

    // Contador de páginas
    this.dialoguePageText = this.add.text(-365, 46, '', {
      fontSize: '12px', color: '#64748b',
    }).setOrigin(0, 1);

    this.dialogueContainer.add([
      panelBg,
      this.dialogueSpeakerText,
      this.dialogueBodyText,
      this.dialogueHintText,
      this.dialoguePageText,
    ]);
  }

  // ── Movimiento ─────────────────────────────────────────────────────────────

  private updateMovement() {
    if (this.isDialogueOpen) {
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
    if (this.isDialogueOpen) {
      this.interactionPromptText.setVisible(false);
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

    this.currentTarget = nearest;

    if (this.currentTarget) {
      this.interactionPromptText.setText(`E — Interactuar con ${this.currentTarget.name}`);
      this.interactionPromptText.setVisible(true);
    } else {
      this.interactionPromptText.setVisible(false);
    }
  }

  private interact() {
    if (this.isDialogueOpen) {
      // Avanzar página o cerrar si es la última
      this.advanceDialogue();
      return;
    }

    if (!this.currentTarget) return;

    const result = transitionRetiroTutorial(this.tutorialStep, this.currentTarget.id);
    this.tutorialStep = result.step;
    this.setObjective(result.objectiveText);
    this.openDialogue(result.dialogue);
  }

  // ── Sistema de diálogo por páginas ────────────────────────────────────────

  private openDialogue(sequence: DialogueSequence) {
    if (sequence.length === 0) return;
    this.activeDialogue = sequence;
    this.dialogueIndex = 0;
    this.isDialogueOpen = true;
    this.dialogueContainer.setVisible(true);
    this.interactionPromptText.setVisible(false);
    this.renderCurrentPage();
  }

  private advanceDialogue() {
    this.dialogueIndex += 1;
    if (this.dialogueIndex >= this.activeDialogue.length) {
      this.closeDialogue();
    } else {
      this.renderCurrentPage();
    }
  }

  private renderCurrentPage() {
    const line = this.activeDialogue[this.dialogueIndex];
    if (!line) return;
    this.dialogueSpeakerText.setText(line.speaker);
    this.dialogueBodyText.setText(line.text);
    this.dialoguePageText.setText(`${this.dialogueIndex + 1} / ${this.activeDialogue.length}`);
  }

  private closeDialogue() {
    this.dialogueContainer.setVisible(false);
    this.isDialogueOpen = false;
    this.activeDialogue = [];
    this.dialogueIndex = 0;
  }

  // ── Guardado ───────────────────────────────────────────────────────────────

  private async handleSave() {
    if (this.isDialogueOpen) return;
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

  // ── UI helpers ─────────────────────────────────────────────────────────────

  private setObjective(text: string) {
    this.objectiveText.setText(`Objetivo: ${text}`);
  }

  // ── Ciclo de vida ──────────────────────────────────────────────────────────

  private handleShutdown() {
    this.controls?.destroy();
    this.controls = undefined;
    this.overlay?.destroy();
  }
}
