import { describe, expect, it } from 'vitest';
import { RETIRO_CONFIG } from '../../src/game/levels/retiro/retiro.config';

const { trainCoach, world } = RETIRO_CONFIG;

describe('configuración de TrainCoach', () => {
  it('mantiene el coche dentro de los límites del mundo', () => {
    expect(trainCoach.x).toBeGreaterThanOrEqual(0);
    expect(trainCoach.x).toBeLessThanOrEqual(world.width);
    expect(trainCoach.y).toBeGreaterThanOrEqual(0);
    expect(trainCoach.y).toBeLessThanOrEqual(world.height);
  });

  it('conserva la posición y escala acordadas para Retiro', () => {
    expect(trainCoach).toMatchObject({ x: 600, y: 650, scale: 1 });
  });

  it('usa una escala positiva', () => {
    expect(trainCoach.scale).toBeGreaterThan(0);
  });

  it('define un cuerpo físico válido sin usar todo el lienzo', () => {
    expect(trainCoach.body.width).toBeGreaterThan(0);
    expect(trainCoach.body.height).toBeGreaterThan(0);
    expect(trainCoach.body.width).toBeLessThan(640);
    expect(trainCoach.body.height).toBeLessThan(192);
  });

  it('guarda la puerta como offsets locales sin coordenadas mundiales duplicadas', () => {
    expect(trainCoach.door).toHaveProperty('localX');
    expect(trainCoach.door).toHaveProperty('localY');
    expect(trainCoach.door).not.toHaveProperty('x');
    expect(trainCoach.door).not.toHaveProperty('y');
  });

  it('mantiene la puerta en el lateral visible y con radio positivo', () => {
    expect(Math.abs(trainCoach.door.localX)).toBeLessThan(320);
    expect(Math.abs(trainCoach.door.localY)).toBeLessThan(192);
    expect(trainCoach.door.interactionRadius).toBeGreaterThan(0);
  });

  it('ubica el punto de puerta dentro de la zona transitable del andén', () => {
    const door = {
      x: trainCoach.x + trainCoach.door.localX * trainCoach.scale,
      y: trainCoach.y + trainCoach.door.localY * trainCoach.scale,
    };
    const isInWalkableArea = RETIRO_CONFIG.environment.walkableAreas.some((area) => (
      door.x >= area.x - area.width / 2
      && door.x <= area.x + area.width / 2
      && door.y >= area.y - area.height / 2
      && door.y <= area.y + area.height / 2
    ));

    expect(isInWalkableArea).toBe(true);
  });

  it('marca la calibración como provisoria hasta la prueba humana', () => {
    expect(trainCoach.calibrationStatus).toBe('provisional');
  });
});
