import { describe, it, expect } from 'vitest';
import { TutorialStep } from '../../src/game/tutorial/retiroTutorial.types';
import { getRetiroObjective, transitionRetiroTutorial } from '../../src/game/tutorial/RetiroTutorial';
import {
  FOREMAN_INTRO,
  BOARD_SUCCESS,
  DOOR_SUCCESS,
} from '../../src/game/dialogue/retiro.dialogues';

describe('RetiroTutorial (Lógica Pura)', () => {
  it('1. Objetivo inicial correcto para TALK_TO_FOREMAN', () => {
    expect(getRetiroObjective(TutorialStep.TALK_TO_FOREMAN)).toBe('Hablá con el capataz del Tren al Sur.');
  });

  it('2. Capataz desde TALK_TO_FOREMAN avanza a CHECK_AFF_BOARD', () => {
    const res = transitionRetiroTutorial(TutorialStep.TALK_TO_FOREMAN, 'foreman');
    expect(res.step).toBe(TutorialStep.CHECK_AFF_BOARD);
    expect(res.stepChanged).toBe(true);
    expect(res.objectiveText).toBe('Consultá el tablero de la AFF.');
  });

  it('3. Tablero antes del capataz no avanza', () => {
    const res = transitionRetiroTutorial(TutorialStep.TALK_TO_FOREMAN, 'affBoard');
    expect(res.step).toBe(TutorialStep.TALK_TO_FOREMAN);
    expect(res.stepChanged).toBe(false);
    expect(res.objectiveText).toBe('Hablá con el capataz del Tren al Sur.');
  });

  it('4. Puerta antes de completar los pasos no avanza', () => {
    const res = transitionRetiroTutorial(TutorialStep.TALK_TO_FOREMAN, 'trainDoor');
    expect(res.step).toBe(TutorialStep.TALK_TO_FOREMAN);
    expect(res.stepChanged).toBe(false);
  });

  it('5. Secuencia completa llega a COMPLETED', () => {
    const s1 = transitionRetiroTutorial(TutorialStep.TALK_TO_FOREMAN, 'foreman');
    expect(s1.step).toBe(TutorialStep.CHECK_AFF_BOARD);
    const s2 = transitionRetiroTutorial(s1.step, 'affBoard');
    expect(s2.step).toBe(TutorialStep.RETURN_TO_TRAIN);
    const s3 = transitionRetiroTutorial(s2.step, 'trainDoor');
    expect(s3.step).toBe(TutorialStep.COMPLETED);
    expect(s3.stepChanged).toBe(true);
    expect(s3.objectiveText).toBe('El Tren al Sur está listo para partir.');
  });

  it('6. Interacción inválida conserva el estado', () => {
    const res = transitionRetiroTutorial(TutorialStep.CHECK_AFF_BOARD, 'foreman');
    expect(res.step).toBe(TutorialStep.CHECK_AFF_BOARD);
    expect(res.stepChanged).toBe(false);
  });

  it('7. COMPLETED no retrocede ante ninguna interacción', () => {
    const ids = ['foreman', 'affBoard', 'trainDoor'] as const;
    for (const id of ids) {
      const res = transitionRetiroTutorial(TutorialStep.COMPLETED, id);
      expect(res.step).toBe(TutorialStep.COMPLETED);
      expect(res.stepChanged).toBe(false);
    }
  });

  it('8. objectiveText corresponde al step devuelto', () => {
    const res = transitionRetiroTutorial(TutorialStep.CHECK_AFF_BOARD, 'affBoard');
    expect(res.objectiveText).toBe(getRetiroObjective(res.step));
  });

  it('9. stepChanged es true solo cuando cambia el estado', () => {
    const changed = transitionRetiroTutorial(TutorialStep.TALK_TO_FOREMAN, 'foreman');
    expect(changed.stepChanged).toBe(true);
    const unchanged = transitionRetiroTutorial(TutorialStep.TALK_TO_FOREMAN, 'affBoard');
    expect(unchanged.stepChanged).toBe(false);
  });

  // ── Nuevas pruebas narrativas ────────────────────────────────────────────

  it('10. FOREMAN_INTRO devuelve cuatro líneas', () => {
    expect(FOREMAN_INTRO.length).toBe(4);
  });

  it('11. La primera línea de FOREMAN_INTRO pertenece al Capataz', () => {
    expect(FOREMAN_INTRO[0].speaker).toBe('Capataz');
  });

  it('12. BOARD_SUCCESS incluye speakers AFF y Narrador', () => {
    const speakers = BOARD_SUCCESS.map(l => l.speaker);
    expect(speakers).toContain('AFF');
    expect(speakers).toContain('Narrador');
  });

  it('13. DOOR_SUCCESS termina con speaker Sistema', () => {
    expect(DOOR_SUCCESS[DOOR_SUCCESS.length - 1].speaker).toBe('Sistema');
  });

  it('14. Cada resultado devuelve un diálogo no vacío', () => {
    const interactions: Array<[TutorialStep, typeof import('../../src/game/tutorial/retiroTutorial.types').InteractableId]> = [
      [TutorialStep.TALK_TO_FOREMAN, 'foreman'],
      [TutorialStep.TALK_TO_FOREMAN, 'affBoard'],
      [TutorialStep.TALK_TO_FOREMAN, 'trainDoor'],
      [TutorialStep.CHECK_AFF_BOARD, 'foreman'],
      [TutorialStep.CHECK_AFF_BOARD, 'affBoard'],
      [TutorialStep.CHECK_AFF_BOARD, 'trainDoor'],
      [TutorialStep.RETURN_TO_TRAIN, 'foreman'],
      [TutorialStep.RETURN_TO_TRAIN, 'affBoard'],
      [TutorialStep.RETURN_TO_TRAIN, 'trainDoor'],
      [TutorialStep.COMPLETED, 'foreman'],
      [TutorialStep.COMPLETED, 'affBoard'],
      [TutorialStep.COMPLETED, 'trainDoor'],
    ];
    for (const [step, id] of interactions) {
      const res = transitionRetiroTutorial(step, id);
      expect(res.dialogue.length).toBeGreaterThan(0);
    }
  });
});
