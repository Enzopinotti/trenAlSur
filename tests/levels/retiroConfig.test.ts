import { describe, expect, it } from 'vitest';
import { RETIRO_CONFIG } from '../../src/game/levels/retiro/retiro.config';

const PLAYER_DIRECTIONS = ['down', 'left', 'right', 'up'] as const;

function isInsideWorld(position: { x: number; y: number }): boolean {
  return position.x >= 0
    && position.x <= RETIRO_CONFIG.world.width
    && position.y >= 0
    && position.y <= RETIRO_CONFIG.world.height;
}

describe('RETIRO_CONFIG', () => {
  it('mantiene el spawn dentro de los límites del mundo', () => {
    expect(isInsideWorld(RETIRO_CONFIG.playerSpawn)).toBe(true);
  });

  it('mantiene al capataz dentro de los límites del mundo', () => {
    expect(isInsideWorld(RETIRO_CONFIG.foreman)).toBe(true);
  });

  it('separa el spawn de la posición del capataz', () => {
    expect(RETIRO_CONFIG.playerSpawn).not.toMatchObject({
      x: RETIRO_CONFIG.foreman.x,
      y: RETIRO_CONFIG.foreman.y,
    });
  });

  it('ubica el spawn fuera del radio de interacción del capataz', () => {
    const distance = Math.hypot(
      RETIRO_CONFIG.playerSpawn.x - RETIRO_CONFIG.foreman.x,
      RETIRO_CONFIG.playerSpawn.y - RETIRO_CONFIG.foreman.y,
    );

    expect(distance).toBeGreaterThan(RETIRO_CONFIG.foreman.interactionRadius);
  });

  it('define una dirección inicial válida', () => {
    expect(PLAYER_DIRECTIONS).toContain(RETIRO_CONFIG.playerSpawn.facing);
  });

  it('mantiene la oficina AFF y el coche dentro de los límites', () => {
    expect(isInsideWorld(RETIRO_CONFIG.affOfficeExterior)).toBe(true);
    expect(isInsideWorld(RETIRO_CONFIG.trainCoach)).toBe(true);
  });
});
