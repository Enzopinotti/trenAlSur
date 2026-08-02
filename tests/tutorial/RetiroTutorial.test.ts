import { describe, it, expect } from 'vitest';
import { TutorialStep } from '../../src/game/tutorial/retiroTutorial.types';
import { getRetiroObjective, transitionRetiroTutorial } from '../../src/game/tutorial/RetiroTutorial';
import { DIALOGUE_ACTORS } from '../../src/game/dialogue/dialogueActors';
import {
  FOREMAN_INTRO,
  BOARD_SUCCESS,
  DOOR_SUCCESS,
} from '../../src/game/dialogue/retiro.dialogues';

describe('RetiroTutorial (Lógica Pura)', () => {
  it('1. Todos los actorId usados en retiro.dialogues.ts existen en DIALOGUE_ACTORS', () => {
    const sequences = [FOREMAN_INTRO, BOARD_SUCCESS, DOOR_SUCCESS];
    for (const seq of sequences) {
      for (const line of seq) {
        expect(DIALOGUE_ACTORS[line.actorId]).toBeDefined();
      }
    }
  });

  it('2. FOREMAN_INTRO usa actorId foreman', () => {
    for (const line of FOREMAN_INTRO) {
      expect(line.actorId).toBe('foreman');
    }
  });

  it('3. BOARD_SUCCESS incluye aff y narrator', () => {
    const actors = BOARD_SUCCESS.map((l) => l.actorId);
    expect(actors).toContain('aff');
    expect(actors).toContain('narrator');
  });

  it('4. DOOR_SUCCESS termina con system', () => {
    expect(DOOR_SUCCESS[DOOR_SUCCESS.length - 1].actorId).toBe('system');
  });

  it('5. Ninguna secuencia está vacía', () => {
    const sequences = [FOREMAN_INTRO, BOARD_SUCCESS, DOOR_SUCCESS];
    for (const seq of sequences) {
      expect(seq.length).toBeGreaterThan(0);
    }
  });

  it('6. El tutorial sigue respetando el flujo: foreman → affBoard → trainDoor', () => {
    const s1 = transitionRetiroTutorial(TutorialStep.TALK_TO_FOREMAN, 'foreman');
    expect(s1.step).toBe(TutorialStep.CHECK_AFF_BOARD);
    expect(s1.stepChanged).toBe(true);

    const s2 = transitionRetiroTutorial(s1.step, 'affBoard');
    expect(s2.step).toBe(TutorialStep.RETURN_TO_TRAIN);
    expect(s2.stepChanged).toBe(true);

    const s3 = transitionRetiroTutorial(s2.step, 'trainDoor');
    expect(s3.step).toBe(TutorialStep.COMPLETED);
    expect(s3.stepChanged).toBe(true);
    expect(s3.objectiveText).toBe('El Tren al Sur está listo para partir.');
  });

  it('7. Las interacciones inválidas no avanzan estado', () => {
    const res = transitionRetiroTutorial(TutorialStep.CHECK_AFF_BOARD, 'foreman');
    expect(res.step).toBe(TutorialStep.CHECK_AFF_BOARD);
    expect(res.stepChanged).toBe(false);
  });

  it('8. COMPLETED no retrocede ante ninguna interacción', () => {
    const ids = ['foreman', 'affBoard', 'trainDoor'] as const;
    for (const id of ids) {
      const res = transitionRetiroTutorial(TutorialStep.COMPLETED, id);
      expect(res.step).toBe(TutorialStep.COMPLETED);
      expect(res.stepChanged).toBe(false);
    }
  });
});
