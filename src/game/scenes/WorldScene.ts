import Phaser from 'phaser';
import { DebugOverlay } from '@/game/systems/DebugOverlay';
import type { Season } from '@/game/config';
import { bus } from '@/core/events/bus';
import { saveService } from '@/core/save/SaveService';

export enum TutorialStep {
  TALK_TO_FOREMAN = 'TALK_TO_FOREMAN',
  CHECK_AFF_BOARD = 'CHECK_AFF_BOARD',
  RETURN_TO_TRAIN = 'RETURN_TO_TRAIN',
  COMPLETED = 'COMPLETED',
}

interface InteractableObject {
  id: string;
  name: string;
  x: number;
  y: number;
  radius: number;
}

export default class WorldScene extends Phaser.Scene {
  private overlay!: DebugOverlay;
  private day!: number;
  private season!: Season;
  private initialPlayerPos: { x: number; y: number } = { x: 250, y: 440 };

  // Core game objects
  private player!: Phaser.GameObjects.Rectangle;
  private playerBody!: Phaser.Physics.Arcade.Body;
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;

  // Semantic references for future asset replacement
  private foreman!: Phaser.GameObjects.Rectangle;
  private affBoard!: Phaser.GameObjects.Rectangle;
  private trainDoor!: Phaser.GameObjects.Rectangle;
  private trainBody!: Phaser.GameObjects.Rectangle;
  private affOffice!: Phaser.GameObjects.Rectangle;

  // Controls
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys?: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    E: Phaser.Input.Keyboard.Key;
  };

  // State & Interacting
  private tutorialStep: TutorialStep = TutorialStep.TALK_TO_FOREMAN;
  private interactables: InteractableObject[] = [];
  private currentTarget: InteractableObject | null = null;

  // UI Elements
  private interactionPromptText!: Phaser.GameObjects.Text;
  private objectiveText!: Phaser.GameObjects.Text;
  private dialogueContainer!: Phaser.GameObjects.Container;
  private dialogueText!: Phaser.GameObjects.Text;
  private isDialogueOpen = false;

  constructor() {
    super('WorldScene');
  }

  init(data: { day?: number; season?: Season; player?: { x: number; y: number } }) {
    this.day = data?.day ?? 1;
    this.season = data?.season ?? 'Primavera';
    if (data?.player) {
      this.initialPlayerPos = { x: data.player.x, y: data.player.y };
    }
  }

  create() {
    // Configurar límites del mundo (1200 x 800)
    const WORLD_WIDTH = 1200;
    const WORLD_HEIGHT = 800;
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Sistema de físicas estáticas
    this.obstacles = this.physics.add.staticGroup();

    // Crear capas de la escena
    this.createEnvironment(WORLD_WIDTH, WORLD_HEIGHT);
    this.createPlayer();
    this.createCharacters();
    this.createInteractables();
    this.createInterface();

    // Configurar colisiones y cámara
    this.physics.add.collider(this.player, this.obstacles);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Controles y eventos
    this.setupControls();

    // Overlay de depuración
    this.overlay = new DebugOverlay(this);
    this.overlay.mount();
  }

  update(_time: number, delta: number) {
    this.updateMovement(delta);
    this.updateInteractionTarget();
    this.overlay.update(_time, delta);
  }

  // --- MÉTODOS DE CONSTRUCCIÓN DE ESCENA ---

  private createEnvironment(width: number, height: number) {
    // Placeholder futuro: tileset del piso de la estación Retiro
    this.add.rectangle(width / 2, height / 2, width, height, 0x3d2e24).setDepth(-10);

    // Floor de hall y andén
    // Placeholder futuro: textura de baldosa/concreto del hall de Retiro
    this.add.rectangle(600, 250, 1100, 360, 0x5a3d28).setDepth(-9);
    // Placeholder futuro: textura del andén de embarque
    this.add.rectangle(600, 480, 1100, 100, 0x6e523c).setDepth(-8);

    // Franja de vías no transitable
    // Placeholder futuro: sprite/tileset de vías ferreas y balasto
    this.add.rectangle(600, 670, 1200, 260, 0x1c1613).setDepth(-7);
    this.add.rectangle(600, 600, 1200, 8, 0x8b5a2b).setDepth(-6);
    this.add.rectangle(600, 630, 1200, 8, 0x8b5a2b).setDepth(-6);

    // Colisionador para impedir que el jugador pise la zona de vías inferior
    const tracksBarrier = this.add.rectangle(600, 660, 1200, 180, 0x000000, 0);
    this.obstacles.add(tracksBarrier);

    // Límites y Paredes externas de la estación
    // Placeholder futuro: estructuras de muros de ladrillo de Retiro
    const wallTop = this.add.rectangle(600, 35, 1200, 70, 0x2b1d16);
    const wallLeft = this.add.rectangle(25, 400, 50, 800, 0x2b1d16);
    const wallRight = this.add.rectangle(1175, 400, 50, 800, 0x2b1d16);
    this.obstacles.add(wallTop);
    this.obstacles.add(wallLeft);
    this.obstacles.add(wallRight);

    this.add.text(600, 35, 'ESTACIÓN RETIRO — LÍNEA MITRE / AFF', { fontSize: '20px', color: '#d97706' })
      .setOrigin(0.5);

    // Oficina de la AFF
    // Placeholder futuro: estructura modular/puesto turquesa de la AFF
    this.affOffice = this.add.rectangle(950, 210, 240, 180, 0x028090);
    this.obstacles.add(this.affOffice);
    this.add.text(950, 160, 'OFICINA AFF', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);

    // Tren al Sur detenido en el andén
    // Placeholder futuro: sprite del convoy/tren federal Tren al Sur
    this.trainBody = this.add.rectangle(550, 605, 780, 70, 0x80091b);
    this.obstacles.add(this.trainBody);
    this.add.text(550, 615, 'TREN AL SUR (CONVOY COOPERATIVO #01)', { fontSize: '16px', color: '#ffffff' })
      .setOrigin(0.5);

    // Puerta del Tren al Sur
    // Placeholder futuro: sprite de la escotilla/puerta de acceso al Tren
    this.trainDoor = this.add.rectangle(350, 565, 50, 15, 0x48cae4);
    this.add.text(350, 545, 'PUERTA', { fontSize: '12px', color: '#ffffff' }).setOrigin(0.5);

    // Bancos de la estación (2)
    // Placeholder futuro: sprites de bancos de madera/hierro
    const bench1 = this.add.rectangle(450, 330, 90, 30, 0x5a3d28);
    const bench2 = this.add.rectangle(670, 330, 90, 30, 0x5a3d28);
    this.obstacles.add(bench1);
    this.obstacles.add(bench2);
    this.add.text(450, 330, 'BANCO', { fontSize: '10px', color: '#bbb' }).setOrigin(0.5);
    this.add.text(670, 330, 'BANCO', { fontSize: '10px', color: '#bbb' }).setOrigin(0.5);

    // Cajas de carga
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
    // Placeholder futuro: sprite/animations del personaje jugable en top-down
    this.player = this.add.rectangle(this.initialPlayerPos.x, this.initialPlayerPos.y, 28, 28, 0x4cc9f0);
    this.physics.add.existing(this.player);
    this.playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    this.playerBody.setCollideWorldBounds(true);
    this.playerBody.setSize(28, 28);
  }

  private createCharacters() {
    // Capataz del Tren al Sur
    // Placeholder futuro: sprite del NPC Capataz de cuadrilla
    this.foreman = this.add.rectangle(240, 440, 32, 32, 0xb7094c);
    this.obstacles.add(this.foreman);
    this.add.text(240, 410, 'CAPATAZ', { fontSize: '13px', color: '#ffd54a' }).setOrigin(0.5);
  }

  private createInteractables() {
    // Tablero de slots AFF
    // Placeholder futuro: sprite de terminal interactiva de la AFF
    this.affBoard = this.add.rectangle(810, 240, 25, 40, 0x48cae4);
    this.add.text(810, 205, 'TABLERO DE SLOTS', { fontSize: '11px', color: '#00f5d4' }).setOrigin(0.5);

    // Registro de puntos interactuables
    this.interactables = [
      {
        id: 'foreman',
        name: 'Capataz',
        x: this.foreman.x,
        y: this.foreman.y,
        radius: 70,
      },
      {
        id: 'affBoard',
        name: 'Tablero AFF',
        x: this.affBoard.x,
        y: this.affBoard.y,
        radius: 75,
      },
      {
        id: 'trainDoor',
        name: 'Puerta del Tren',
        x: this.trainDoor.x,
        y: this.trainDoor.y,
        radius: 65,
      },
    ];
  }

  private createInterface() {
    // Header fijo a cámara
    this.add.text(16, 16, `Andén de Retiro — Día ${this.day}`, {
      fontSize: '22px',
      color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 8, y: 4 },
    }).setScrollFactor(0).setDepth(400);

    // Texto de objetivo activo
    this.objectiveText = this.add.text(16, 50, '', {
      fontSize: '16px',
      color: '#ffd54a',
      backgroundColor: 'rgba(0,0,0,0.6)',
      padding: { x: 8, y: 4 },
    }).setScrollFactor(0).setDepth(400);

    this.setObjective('Hablá con el capataz del Tren al Sur.');

    // Prompt de interacción ("E — Interactuar")
    this.interactionPromptText = this.add.text(400, 480, 'E — Interactuar', {
      fontSize: '18px',
      color: '#00f5d4',
      backgroundColor: '#111827',
      padding: { x: 12, y: 6 },
    })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(450)
      .setVisible(false);

    // Modal / Panel de Diálogo flotante inferior
    this.dialogueContainer = this.add.container(400, 520).setScrollFactor(0).setDepth(500).setVisible(false);

    const bg = this.add.rectangle(0, 0, 740, 110, 0x0f172a, 0.95);
    bg.setStrokeStyle(2, 0x38bdf8);

    this.dialogueText = this.add.text(-350, -42, '', {
      fontSize: '15px',
      color: '#f8fafc',
      wordWrap: { width: 700 },
    });

    const closeHint = this.add.text(340, 38, '[ Presioná E para cerrar ]', {
      fontSize: '12px',
      color: '#94a3b8',
    }).setOrigin(1, 1);

    this.dialogueContainer.add([bg, this.dialogueText, closeHint]);
  }

  // --- CONTROLES Y MOVIMIENTO ---

  private setupControls() {
    const kb = this.input.keyboard;
    if (!kb) return;

    this.cursors = kb.createCursorKeys();
    this.wasdKeys = {
      W: kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      E: kb.addKey(Phaser.Input.Keyboard.KeyCodes.E),
    };

    // Tecla ESC para volver al menú
    kb.on('keydown-ESC', () => {
      this.scene.start('MenuScene');
    });

    // Tecla S para guardar partida
    kb.on('keydown-S', async () => {
      if (this.isDialogueOpen) return;
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
      bus.emit('ui:toast', '💾 Partida guardada (slot-1)');
    });

    // Tecla E para interactuar
    kb.on('keydown-E', () => {
      this.interact();
    });
  }

  private updateMovement(_delta: number) {
    if (!this.playerBody) return;

    // Si el diálogo está abierto, congelar movimiento
    if (this.isDialogueOpen) {
      this.playerBody.setVelocity(0, 0);
      return;
    }

    const SPEED = 190;
    let vx = 0;
    let vy = 0;

    const left = this.cursors?.left.isDown || this.wasdKeys?.A.isDown;
    const right = this.cursors?.right.isDown || this.wasdKeys?.D.isDown;
    const up = this.cursors?.up.isDown || this.wasdKeys?.W.isDown;
    const down = this.cursors?.down.isDown || this.wasdKeys?.S.isDown;

    if (left) vx -= 1;
    if (right) vx += 1;
    if (up) vy -= 1;
    if (down) vy += 1;

    // Normalizar vector de movimiento diagonal
    if (vx !== 0 && vy !== 0) {
      vx *= Math.SQRT1_2;
      vy *= Math.SQRT1_2;
    }

    this.playerBody.setVelocity(vx * SPEED, vy * SPEED);
  }

  // --- DETECCIÓN E INTERACCIÓN ---

  private updateInteractionTarget() {
    if (this.isDialogueOpen) {
      this.interactionPromptText.setVisible(false);
      return;
    }

    let nearest: InteractableObject | null = null;
    let minDistance = Infinity;

    for (const obj of this.interactables) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, obj.x, obj.y);
      if (dist <= obj.radius && dist < minDistance) {
        minDistance = dist;
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
      this.hideDialogue();
      return;
    }

    if (!this.currentTarget) return;

    switch (this.currentTarget.id) {
      case 'foreman':
        if (this.tutorialStep === TutorialStep.TALK_TO_FOREMAN) {
          this.showDialogue(
            'Capataz:\n"Bienvenido a Retiro. Antes de partir tenemos que asegurar un lugar en la vía.\nRevisá el tablero de la AFF y reservá un slot hacia Rosario."'
          );
          this.tutorialStep = TutorialStep.CHECK_AFF_BOARD;
          this.setObjective('Consultá el tablero de la AFF.');
        } else {
          this.showDialogue('Capataz:\n"¿Ya revisaste el tablero de la AFF para asegurar nuestro slot?"');
        }
        break;

      case 'affBoard':
        if (this.tutorialStep === TutorialStep.CHECK_AFF_BOARD) {
          this.showDialogue(
            'Tablero de Slots AFF:\nPróximo slot disponible: Retiro → Rosario\nSalida: 08:40 | Peaje estimado: 12 SUR\n\n¡Slot reservado con éxito!'
          );
          this.tutorialStep = TutorialStep.RETURN_TO_TRAIN;
          this.setObjective('Volvé a la puerta del Tren al Sur.');
        } else if (this.tutorialStep === TutorialStep.TALK_TO_FOREMAN) {
          this.showDialogue('Tablero de Slots AFF:\nHablá primero con el capataz antes de operar la terminal.');
        } else {
          this.showDialogue(
            'Tablero de Slots AFF:\nSlot Retiro → Rosario ya reservado para las 08:40.'
          );
        }
        break;

      case 'trainDoor':
        if (this.tutorialStep === TutorialStep.RETURN_TO_TRAIN) {
          this.showDialogue(
            'Puerta del Tren al Sur:\nTutorial de Retiro completado.\nEl Tren al Sur está listo para partir.'
          );
          this.tutorialStep = TutorialStep.COMPLETED;
          this.setObjective('El Tren al Sur está listo para partir.');
        } else if (this.tutorialStep === TutorialStep.COMPLETED) {
          this.showDialogue('Puerta del Tren al Sur:\nTodo listo para la partida hacia Rosario.');
        } else {
          this.showDialogue(
            'Puerta del Tren al Sur:\nAún no podés abordar. Completá los preparativos de la estación.'
          );
        }
        break;
    }
  }

  private showDialogue(text: string) {
    this.dialogueText.setText(text);
    this.dialogueContainer.setVisible(true);
    this.isDialogueOpen = true;
    this.interactionPromptText.setVisible(false);
  }

  private hideDialogue() {
    this.dialogueContainer.setVisible(false);
    this.isDialogueOpen = false;
  }

  private setObjective(text: string) {
    this.objectiveText.setText(`Objetivo: ${text}`);
  }

  shutdown() {
    this.overlay?.destroy();
  }
}
