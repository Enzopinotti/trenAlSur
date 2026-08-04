import { describe, expect, it } from 'vitest';
import { isAffOfficeEntryData } from '../../src/game/levels/affOffice/affOffice.types';

describe('transición de Oficina AFF', () => {
  it('valida datos serializables de entrada y retorno', () => {
    expect(isAffOfficeEntryData({ day: 1, season: 'Primavera', tutorialStep: 'CHECK_AFF_BOARD', returnPosition: { x: 992, y: 380, facing: 'down' } })).toBe(true);
  });
  it('rechaza retornos sin orientación', () => expect(isAffOfficeEntryData({ day: 1, season: 'Primavera', tutorialStep: 'CHECK_AFF_BOARD', returnPosition: { x: 1, y: 1 } })).toBe(false));
});
