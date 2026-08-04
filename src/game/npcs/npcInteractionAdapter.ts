import type { Interactable } from '@/game/interactions/interaction.types';
import type { Npc } from './Npc';

export function toNpcInteractable<TId extends string>(
  npc: Npc,
  id: TId,
  label: string,
  radius: number,
  getPosition: () => Readonly<{ x: number; y: number }>,
): Interactable<TId> {
  void npc;
  return { id, interactionLabel: label, radius, getPosition };
}
