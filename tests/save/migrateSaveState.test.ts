import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  isTutorialStep,
  migrateSaveState,
} from '../../src/game/save/migrateSaveState';
import { TutorialStep } from '../../src/game/tutorial/retiroTutorial.types';

describe('migrateSaveState', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

  beforeEach(() => {
    warn.mockClear();
  });

  afterEach(() => {
    warn.mockClear();
  });

  afterAll(() => {
    warn.mockRestore();
  });

  it('migra una partida v1 a v2 y preserva la posición', () => {
    const result = migrateSaveState({
      version: 1,
      day: 4,
      season: 'Otoño',
      player: { x: 420, y: 510, name: 'Dev' },
    });

    expect(result).toMatchObject({
      version: 2,
      day: 4,
      season: 'Otoño',
      player: { x: 420, y: 510 },
    });
  });

  it('asigna el paso inicial cuando una partida v1 no lo contiene', () => {
    const result = migrateSaveState({
      version: 1,
      day: 1,
      season: 'Primavera',
      player: { x: 360, y: 440 },
    });

    expect(result.tutorialStep).toBe(TutorialStep.TALK_TO_FOREMAN);
  });

  it('conserva una partida v2 válida', () => {
    const state = {
      version: 2,
      day: 7,
      season: 'Invierno',
      tutorialStep: TutorialStep.RETURN_TO_TRAIN,
      player: { x: 600, y: 540 },
    };

    expect(migrateSaveState(state)).toEqual(state);
  });

  it('restaura valores seguros y avisa ante datos inválidos', () => {
    const result = migrateSaveState({
      version: 2,
      day: 0,
      season: 'Monzón',
      tutorialStep: 'UNKNOWN',
      player: { x: -1, y: Number.NaN },
    });

    expect(result).toEqual({
      version: 2,
      day: 1,
      season: 'Primavera',
      tutorialStep: TutorialStep.TALK_TO_FOREMAN,
      player: { x: 360, y: 440 },
    });
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/^\[SaveMigration\]/));
  });

  it('no muta el objeto de entrada', () => {
    const input = {
      version: 1,
      day: 2,
      season: 'Verano',
      player: { x: 440, y: 520, name: 'Dev' },
    };
    const snapshot = structuredClone(input);

    migrateSaveState(input);

    expect(input).toEqual(snapshot);
  });

  it('produce una estructura serializable', () => {
    const result = migrateSaveState({
      version: 2,
      day: 3,
      season: 'Primavera',
      tutorialStep: TutorialStep.CHECK_AFF_BOARD,
      player: { x: 390, y: 470 },
    });

    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });

  it('valida los pasos de tutorial mediante un type guard', () => {
    expect(isTutorialStep(TutorialStep.COMPLETED)).toBe(true);
    expect(isTutorialStep('COMPLETED')).toBe(true);
    expect(isTutorialStep('INVALID')).toBe(false);
  });
});
