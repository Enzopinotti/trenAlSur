import { describe, expect, it } from 'vitest';
import { RETIRO_CONFIG } from '../../src/game/levels/retiro/retiro.config';

describe('configuración exterior de la oficina AFF', () => {
  const office = RETIRO_CONFIG.affOfficeExterior;
  it('usa un cuerpo lógico menor que el lienzo de 288×192', () => {
    expect(office.body.width).toBeGreaterThan(0);
    expect(office.body.width).toBeLessThan(288);
    expect(office.body.height).toBeGreaterThan(0);
    expect(office.body.height).toBeLessThan(192);
  });
  it('deriva la puerta desde offsets locales sin coordenadas duplicadas', () => {
    expect(office.door).not.toHaveProperty('x');
    expect(office.door).not.toHaveProperty('y');
    const point = { x: office.x + office.door.localX * office.scale + office.door.interactionOffsetX, y: office.y + office.door.localY * office.scale + office.door.interactionOffsetY };
    expect(point.x).toBeGreaterThan(0);
    expect(point.y).toBeGreaterThan(0);
  });
  it('mantiene la calibración exterior como provisoria', () => expect(office.calibrationStatus).toBe('provisional'));
});
