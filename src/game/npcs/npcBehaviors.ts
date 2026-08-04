import type { Npc } from './Npc';

export interface NpcBehavior {
  update(npc: Npc, delta: number): void;
}

export const stationaryBehavior: NpcBehavior = {
  update(): void {
    // La primera versión no mueve al NPC; la interfaz evita timers por escena.
  },
};

export function updateNpcBehavior(npc: Npc, behavior: NpcBehavior, delta: number): void {
  behavior.update(npc, delta);
}
