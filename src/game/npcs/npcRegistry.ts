import type { Npc } from './Npc';
export class NpcRegistry { private readonly entries = new Map<string, Npc>(); add(npc: Npc): void { this.entries.set(npc.id, npc); } get(id: string): Npc | undefined { return this.entries.get(id); } destroy(): void { this.entries.forEach((npc) => npc.destroy()); this.entries.clear(); } }
