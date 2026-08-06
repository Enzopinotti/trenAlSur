import Phaser from 'phaser';
import { TRAIN_INTERIOR_CONFIG } from '@/game/levels/trainInterior/trainInterior.config';
import { createTrainInteriorEnvironment, type TrainInteriorEnvironment } from '@/game/levels/trainInterior/createTrainInteriorEnvironment';
import { isTrainInteriorEntryData, type TrainInteriorEntryData } from '@/game/levels/trainInterior/trainInterior.types';
import { Player, registerPlayerAnimations } from '@/game/entities/Player';
import { WorldControls } from '@/game/input/WorldControls';
import { DialoguePanel } from '@/game/ui/DialoguePanel';
import { WorldHud } from '@/game/ui/WorldHud';
import { InteractionSystem } from '@/game/interactions/InteractionSystem';
import type { Interactable } from '@/game/interactions/interaction.types';
import { WorldDebugRenderer } from '@/game/debug/WorldDebugRenderer';
import { NpcRegistry } from '@/game/npcs/npcRegistry';
import { createNpc } from '@/game/npcs/createNpc';
import { toNpcInteractable } from '@/game/npcs/npcInteractionAdapter';
import { TRAIN_INTERIOR_NPCS } from '@/game/levels/trainInterior/trainInterior.npcs';
import { CREW_INTRO, CREW_ALREADY_MET } from '@/game/dialogue/trainInterior/trainInterior.dialogues';

const PLAYER_SPEED = 190;
type TrainInteractable = Interactable<'crew' | 'trainExit'>;

export default class TrainInteriorScene extends Phaser.Scene {
  private entry!: TrainInteriorEntryData;
  private player!: Player;
  private controls?: WorldControls;
  private dialogue?: DialoguePanel;
  private hud?: WorldHud;
  private debug?: WorldDebugRenderer;
  private environment?: TrainInteriorEnvironment;
  private colliders: Phaser.Physics.Arcade.Collider[] = [];
  private readonly interactions = new InteractionSystem<TrainInteractable>();
  private interactables: TrainInteractable[] = [];
  private readonly npcs = new NpcRegistry();
  private crewFirstInteraction = true;

  constructor() {
    super('TrainInteriorScene');
  }

  init(data: unknown): void {
    if (!isTrainInteriorEntryData(data)) {
      throw new Error('[TrainInteriorScene] Datos de entrada inválidos.');
    }
    this.entry = data;
    this.crewFirstInteraction = true;
    this.interactions.clear();
  }

  create(): void {
    const config = TRAIN_INTERIOR_CONFIG;
    this.physics.world.setBounds(0, 0, config.world.width, config.world.height);
    registerPlayerAnimations(this);
    this.environment = createTrainInteriorEnvironment(this, config);
    this.player = new Player(this, config.playerSpawn.x, config.playerSpawn.y);
    this.player.face(config.playerSpawn.facing);

    const crew = createNpc(this, {
      id: TRAIN_INTERIOR_NPCS.crew,
      x: config.crew.x,
      y: config.crew.y,
    });
    const crewVisual = this.add.rectangle(0, 0, 38, 60, 0x8b4513).setOrigin(0.5, 1);
    crew.add(crewVisual);
    this.npcs.add(crew);

    this.colliders = [this.physics.add.collider(this.player, this.environment.collisionGroup)];

    this.interactables = [
      toNpcInteractable(
        crew,
        'crew',
        'Hablar con Tripulación',
        config.crew.interactionRadius,
        () => ({ x: config.crew.interactionX, y: config.crew.interactionY }),
      ),
      {
        id: 'trainExit',
        interactionLabel: config.exit.interactionLabel,
        radius: config.exit.interactionRadius,
        getPosition: () => ({ x: config.exit.x, y: config.exit.y }),
      },
    ];

    if (!this.input.keyboard) {
      throw new Error('[TrainInteriorScene] No se encontró el teclado.');
    }
    this.controls = new WorldControls(this.input.keyboard);
    this.dialogue = new DialoguePanel(this);
    this.hud = new WorldHud(this);
    this.hud.setObjective('Explorá el interior del tren.');
    this.debug = new WorldDebugRenderer(this);
    this.cameras.main
      .setBounds(0, 0, config.world.width, config.world.height)
      .setRoundPixels(true);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
  }

  update(): void {
    if (this.controls?.justPressedToggleDebug()) {
      this.debug?.toggle();
    }
    if (this.controls?.justPressedMenu()) {
      if (!this.dialogue?.isOpen) {
        this.returnToRetiro();
      }
      return;
    }
    if (this.controls?.justPressedInteract()) {
      this.interact();
    }

    if (!this.dialogue?.isOpen) {
      const input = this.controls?.getMovement() ?? { x: 0, y: 0 };
      if (input.x || input.y) {
        this.player.move(input, PLAYER_SPEED);
      } else {
        this.player.freeze();
      }
      const previous = this.interactions.currentTarget?.id;
      const target = this.interactions.update(this.player, this.interactables);
      if (previous !== target?.id) {
        target ? this.hud?.showInteractionPrompt(target.interactionLabel) : this.hud?.hideInteractionPrompt();
      }
    } else {
      this.player.freeze();
      this.hud?.hideInteractionPrompt();
    }

    this.debug?.render({
      bodies: [{ label: 'Player', body: this.player.body }],
      interactables: this.interactables,
      currentTarget: this.interactions.currentTarget,
      walkableAreas: TRAIN_INTERIOR_CONFIG.walkableAreas,
    });
  }

  private interact(): void {
    const dialogue = this.dialogue;
    if (!dialogue) return;

    if (dialogue.isOpen) {
      dialogue.advance();
      return;
    }

    const target = this.interactions.currentTarget;
    if (!target) return;

    if (target.id === 'trainExit') {
      this.returnToRetiro();
      return;
    }

    if (target.id === 'crew') {
      const sequence = this.crewFirstInteraction ? CREW_INTRO : CREW_ALREADY_MET;
      if (this.crewFirstInteraction) {
        this.crewFirstInteraction = false;
      }
      dialogue.open(sequence);
    }
  }

  private returnToRetiro(): void {
    this.scene.start('WorldScene', {
      kind: 'returnedFromTrain',
      day: this.entry.day,
      season: this.entry.season,
      tutorialStep: this.entry.tutorialStep,
      player: this.entry.returnPosition,
    });
  }

  private shutdown(): void {
    this.colliders.forEach((collider) => collider.destroy());
    this.colliders = [];
    this.environment?.ambientTweens.forEach((tween) => {
      tween.stop();
      this.tweens.remove(tween);
    });
    this.environment = undefined;
    this.controls?.destroy();
    this.dialogue?.destroy();
    this.hud?.destroy();
    this.debug?.destroy();
    this.npcs.destroy();
    this.interactions.clear();
    this.interactables = [];
  }
}
