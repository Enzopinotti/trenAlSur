import { describe, expect, it } from 'vitest';
import {
  resolveAffTerminalState,
  type AffTerminalState,
} from '../../src/game/entities/affTerminal.types';

describe('resolveAffTerminalState', () => {
  it('usa idle cuando el slot no está confirmado y el jugador está lejos', () => {
    expect(resolveAffTerminalState(false, false)).toBe('idle');
  });

  it('usa active cuando el jugador está en rango y el slot no está confirmado', () => {
    expect(resolveAffTerminalState(false, true)).toBe('active');
  });

  it('usa confirmed cuando el slot está confirmado', () => {
    expect(resolveAffTerminalState(true, false)).toBe('confirmed');
  });

  it('prioriza confirmed aunque el jugador siga en rango', () => {
    expect(resolveAffTerminalState(true, true)).toBe('confirmed');
  });

  it('siempre devuelve un estado de la unión tipada', () => {
    const states: readonly AffTerminalState[] = ['idle', 'active', 'confirmed'];

    for (const slotConfirmed of [false, true]) {
      for (const playerInRange of [false, true]) {
        expect(states).toContain(resolveAffTerminalState(slotConfirmed, playerInRange));
      }
    }
  });
});
