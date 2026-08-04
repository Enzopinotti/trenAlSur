import { describe, expect, it } from 'vitest';
import { npcId } from '../../src/game/npcs/npcId';

describe('NPCs de Oficina AFF', () => {
  it('identifica al empleado de la AFF', () => expect(npcId('aff-clerk')).toBe('aff-clerk'));
  it('rechaza identificadores vacíos', () => expect(() => npcId('  ')).toThrow());
});
