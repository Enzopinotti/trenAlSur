import { describe, expect, it } from 'vitest';
import { isTrainInteriorEntryData } from '../../src/game/levels/trainInterior/trainInterior.types';
import { TutorialStep } from '../../src/game/tutorial/retiroTutorial.types';

describe('datos de entrada de TrainInteriorScene', () => {
  it('acepta datos válidos con kind enterTrain', () => {
    const validData = {
      kind: 'enterTrain' as const,
      day: 1,
      season: 'Primavera',
      tutorialStep: TutorialStep.COMPLETED,
      returnPosition: { x: 400, y: 480, facing: 'down' as const },
    };
    expect(isTrainInteriorEntryData(validData)).toBe(true);
  });

  it('rechaza datos sin kind', () => {
    const invalidData = {
      day: 1,
      season: 'Primavera',
      tutorialStep: TutorialStep.COMPLETED,
      returnPosition: { x: 400, y: 480, facing: 'down' as const },
    };
    expect(isTrainInteriorEntryData(invalidData)).toBe(false);
  });

  it('rechaza datos con kind incorrecto', () => {
    const invalidData = {
      kind: 'invalidKind',
      day: 1,
      season: 'Primavera',
      tutorialStep: TutorialStep.COMPLETED,
      returnPosition: { x: 400, y: 480, facing: 'down' as const },
    };
    expect(isTrainInteriorEntryData(invalidData)).toBe(false);
  });

  it('rechaza datos sin returnPosition', () => {
    const invalidData = {
      kind: 'enterTrain' as const,
      day: 1,
      season: 'Primavera',
      tutorialStep: TutorialStep.COMPLETED,
    };
    expect(isTrainInteriorEntryData(invalidData)).toBe(false);
  });

  it('rechaza datos con facing inválido', () => {
    const invalidData = {
      kind: 'enterTrain' as const,
      day: 1,
      season: 'Primavera',
      tutorialStep: TutorialStep.COMPLETED,
      returnPosition: { x: 400, y: 480, facing: 'invalid' as const },
    };
    expect(isTrainInteriorEntryData(invalidData)).toBe(false);
  });

  it('acepta todos los facings válidos', () => {
    const validFacings = ['up', 'down', 'left', 'right'] as const;
    validFacings.forEach((facing) => {
      const data = {
        kind: 'enterTrain' as const,
        day: 1,
        season: 'Primavera',
        tutorialStep: TutorialStep.COMPLETED,
        returnPosition: { x: 400, y: 480, facing },
      };
      expect(isTrainInteriorEntryData(data)).toBe(true);
    });
  });
});
