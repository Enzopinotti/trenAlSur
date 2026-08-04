import { describe, expect, it } from 'vitest';
import { isWorldSceneInitData } from '../../src/game/scenes/worldScene.types';

describe('datos de inicio de WorldScene', () => {
  it('distingue Nuevo Juego', () => expect(isWorldSceneInitData({ kind: 'newGame' })).toBe(true));
  it('acepta una carga tipada', () => expect(isWorldSceneInitData({ kind: 'loadedGame', day: 1, season: 'Primavera', tutorialStep: 'TALK_TO_FOREMAN', player: { x: 1, y: 1 } })).toBe(true));
  it('rechaza objetos ambiguos', () => expect(isWorldSceneInitData({ day: 1 })).toBe(false));
});
