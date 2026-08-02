export type AffTerminalState = 'idle' | 'active' | 'confirmed';

export function resolveAffTerminalState(
  slotConfirmed: boolean,
  playerInRange: boolean,
): AffTerminalState {
  if (slotConfirmed) return 'confirmed';
  return playerInRange ? 'active' : 'idle';
}
