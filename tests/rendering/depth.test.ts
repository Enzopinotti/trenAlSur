import { describe, expect, it } from 'vitest';
import { RETIRO_CONFIG } from '../../src/game/levels/retiro/retiro.config';
import { DEPTH, depthFromFeet } from '../../src/game/rendering/depth';

describe('depthFromFeet', () => {
  it('asigna menor profundidad a unos pies más arriba', () => {
    expect(depthFromFeet(320)).toBeLessThan(depthFromFeet(440));
  });

  it('asigna mayor profundidad a unos pies más abajo', () => {
    expect(depthFromFeet(560)).toBeGreaterThan(depthFromFeet(440));
  });

  it('aplica el offset a la profundidad calculada', () => {
    expect(depthFromFeet(440, 12)).toBe(depthFromFeet(440) + 12);
  });

  it('mantiene la profundidad máxima esperada del mundo debajo de las etiquetas', () => {
    expect(depthFromFeet(RETIRO_CONFIG.world.height)).toBeLessThan(DEPTH.worldLabels);
  });
});

describe('bandas de profundidad', () => {
  it('ubica el HUD sobre las etiquetas del mundo', () => {
    expect(DEPTH.hud).toBeGreaterThan(DEPTH.worldLabels);
  });

  it('ubica el diálogo sobre el HUD', () => {
    expect(DEPTH.dialogue).toBeGreaterThan(DEPTH.hud);
  });

  it('ubica el debug sobre el diálogo', () => {
    expect(DEPTH.debug).toBeGreaterThan(DEPTH.dialogue);
  });
});
