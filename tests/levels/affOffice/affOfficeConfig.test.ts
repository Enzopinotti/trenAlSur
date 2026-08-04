import { describe, expect, it } from 'vitest';
import { AFF_OFFICE_CONFIG } from '../../../src/game/levels/affOffice/affOffice.config';

describe('configuración de Oficina AFF', () => {
  it('usa un interior fijo de 640×480', () => expect(AFF_OFFICE_CONFIG.world).toEqual({ width: 640, height: 480 }));
  it('mantiene al empleado y la salida en áreas transitables', () => {
    const area = AFF_OFFICE_CONFIG.walkableAreas[0];
    expect(AFF_OFFICE_CONFIG.clerk.interactionX).toBeGreaterThan(area.x - area.width / 2);
    expect(AFF_OFFICE_CONFIG.exit.y).toBeLessThan(area.y + area.height / 2);
  });
});
