import Phaser from 'phaser';
import { Npc } from './Npc';
import type { NpcConfig } from './npc.types';
export function createNpc(scene: Phaser.Scene, config: NpcConfig): Npc { return new Npc(scene, config); }
