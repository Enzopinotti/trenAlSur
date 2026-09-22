import { describe, expect, it } from 'vitest';
import { transitionRetiroTutorial } from '../../src/game/tutorial/RetiroTutorial';
import { TutorialStep } from '../../src/game/tutorial/retiroTutorial.types';

describe('transición al vagón-taller', () => {
  it('en RETURN_TO_TRAIN al interactuar con trainDoor avanza a COMPLETED', () => {
    const result = transitionRetiroTutorial(TutorialStep.RETURN_TO_TRAIN, 'trainDoor');
    expect(result.step).toBe(TutorialStep.COMPLETED);
    expect(result.stepChanged).toBe(true);
  });

  it('en RETURN_TO_TRAIN al interactuar con trainDoor muestra diálogo DOOR_SUCCESS', () => {
    const result = transitionRetiroTutorial(TutorialStep.RETURN_TO_TRAIN, 'trainDoor');
    expect(result.dialogue).toBeDefined();
    expect(result.dialogue.length).toBeGreaterThan(0);
  });

  it('en COMPLETED ya no avanza más al interactuar con trainDoor', () => {
    const result = transitionRetiroTutorial(TutorialStep.COMPLETED, 'trainDoor');
    expect(result.step).toBe(TutorialStep.COMPLETED);
    expect(result.stepChanged).toBe(false);
  });

  it('en COMPLETED muestra diálogo DOOR_COMPLETED', () => {
    const result = transitionRetiroTutorial(TutorialStep.COMPLETED, 'trainDoor');
    expect(result.dialogue).toBeDefined();
    expect(result.dialogue.length).toBeGreaterThan(0);
  });

  it('en TALK_TO_FOREMAN no permite entrar al tren', () => {
    const result = transitionRetiroTutorial(TutorialStep.TALK_TO_FOREMAN, 'trainDoor');
    expect(result.step).toBe(TutorialStep.TALK_TO_FOREMAN);
    expect(result.stepChanged).toBe(false);
  });

  it('en CHECK_AFF_BOARD no permite entrar al tren', () => {
    const result = transitionRetiroTutorial(TutorialStep.CHECK_AFF_BOARD, 'trainDoor');
    expect(result.step).toBe(TutorialStep.CHECK_AFF_BOARD);
    expect(result.stepChanged).toBe(false);
  });
});
