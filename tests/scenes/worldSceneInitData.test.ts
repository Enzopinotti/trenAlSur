import { describe, expect, it } from 'vitest';
import { isWorldSceneInitData } from '../../src/game/scenes/worldScene.types';
import { TutorialStep } from '../../src/game/tutorial/retiroTutorial.types';

describe('datos de inicio de WorldScene', () => {
  it('distingue Nuevo Juego', () => expect(isWorldSceneInitData({ kind: 'newGame' })).toBe(true));
  it('acepta una carga tipada', () => expect(isWorldSceneInitData({ kind: 'loadedGame', day: 1, season: 'Primavera', tutorialStep: 'TALK_TO_FOREMAN', player: { x: 1, y: 1 } })).toBe(true));
  it('acepta retorno desde la oficina AFF', () => {
    const data = {
      kind: 'returnedFromAffOffice' as const,
      day: 1,
      season: 'Primavera',
      tutorialStep: TutorialStep.RETURN_TO_TRAIN,
      player: { x: 954, y: 301, facing: 'down' as const },
    };
    expect(isWorldSceneInitData(data)).toBe(true);
  });
  it('acepta retorno desde el vagón-taller', () => {
    const data = {
      kind: 'returnedFromTrain' as const,
      day: 1,
      season: 'Primavera',
      tutorialStep: TutorialStep.COMPLETED,
      player: { x: 370, y: 545, facing: 'down' as const },
    };
    expect(isWorldSceneInitData(data)).toBe(true);
  });
  it('rechaza objetos ambiguos', () => expect(isWorldSceneInitData({ day: 1 })).toBe(false));
});
