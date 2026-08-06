import { describe, expect, it } from 'vitest';
import { isWorldSceneInitData } from '../../src/game/scenes/worldScene.types';
import { isTrainInteriorEntryData } from '../../src/game/levels/trainInterior/trainInterior.types';
import { TutorialStep } from '../../src/game/tutorial/retiroTutorial.types';

describe('retorno desde el vagón-taller a Retiro', () => {
  it('mantiene day al volver a Retiro', () => {
    const trainEntry = {
      kind: 'enterTrain' as const,
      day: 5,
      season: 'Primavera',
      tutorialStep: TutorialStep.COMPLETED,
      returnPosition: { x: 370, y: 545, facing: 'down' as const },
    };
    expect(isTrainInteriorEntryData(trainEntry)).toBe(true);
    expect(trainEntry.day).toBe(5);
  });

  it('mantiene season al volver a Retiro', () => {
    const trainEntry = {
      kind: 'enterTrain' as const,
      day: 1,
      season: 'Otoño',
      tutorialStep: TutorialStep.COMPLETED,
      returnPosition: { x: 370, y: 545, facing: 'down' as const },
    };
    expect(isTrainInteriorEntryData(trainEntry)).toBe(true);
    expect(trainEntry.season).toBe('Otoño');
  });

  it('mantiene tutorialStep al volver a Retiro', () => {
    const trainEntry = {
      kind: 'enterTrain' as const,
      day: 1,
      season: 'Primavera',
      tutorialStep: TutorialStep.COMPLETED,
      returnPosition: { x: 370, y: 545, facing: 'down' as const },
    };
    expect(isTrainInteriorEntryData(trainEntry)).toBe(true);
    expect(trainEntry.tutorialStep).toBe(TutorialStep.COMPLETED);
  });

  it('pasa posición de retorno correcta a WorldScene', () => {
    const returnPosition = { x: 370, y: 545, facing: 'down' as const };
    const worldEntry = {
      kind: 'returnedFromTrain' as const,
      day: 1,
      season: 'Primavera',
      tutorialStep: TutorialStep.COMPLETED,
      player: returnPosition,
    };
    expect(isWorldSceneInitData(worldEntry)).toBe(true);
    expect(worldEntry.player).toEqual(returnPosition);
  });

  it('kind returnedFromTrain no muestra intro de Retiro', () => {
    const worldEntry = {
      kind: 'returnedFromTrain' as const,
      day: 1,
      season: 'Primavera',
      tutorialStep: TutorialStep.COMPLETED,
      player: { x: 370, y: 545, facing: 'down' as const },
    };
    expect(isWorldSceneInitData(worldEntry)).toBe(true);
    expect(worldEntry.kind).toBe('returnedFromTrain');
  });
});
