import { describe, expect, it } from 'vitest';
import { TRAIN_INTERIOR_CONFIG } from '../../../src/game/levels/trainInterior/trainInterior.config';

describe('configuración del vagón-taller', () => {
  it('tiene dimensiones de mundo válidas', () => {
    expect(TRAIN_INTERIOR_CONFIG.world.width).toBeGreaterThan(0);
    expect(TRAIN_INTERIOR_CONFIG.world.height).toBeGreaterThan(0);
  });

  it('tiene punto de spawn del jugador dentro del mundo', () => {
    const { world, playerSpawn } = TRAIN_INTERIOR_CONFIG;
    expect(playerSpawn.x).toBeGreaterThanOrEqual(0);
    expect(playerSpawn.x).toBeLessThanOrEqual(world.width);
    expect(playerSpawn.y).toBeGreaterThanOrEqual(0);
    expect(playerSpawn.y).toBeLessThanOrEqual(world.height);
  });

  it('tiene áreas caminables definidas', () => {
    expect(TRAIN_INTERIOR_CONFIG.walkableAreas.length).toBeGreaterThan(0);
  });

  it('tiene estructuras de colisión definidas', () => {
    expect(TRAIN_INTERIOR_CONFIG.collisionStructures.length).toBeGreaterThan(0);
  });

  it('tiene posición de Sofía definida', () => {
    expect(TRAIN_INTERIOR_CONFIG.sofia.x).toBeDefined();
    expect(TRAIN_INTERIOR_CONFIG.sofia.y).toBeDefined();
    expect(TRAIN_INTERIOR_CONFIG.sofia.interactionRadius).toBeGreaterThan(0);
  });

  it('tiene salida definida', () => {
    expect(TRAIN_INTERIOR_CONFIG.exit.x).toBeDefined();
    expect(TRAIN_INTERIOR_CONFIG.exit.y).toBeDefined();
    expect(TRAIN_INTERIOR_CONFIG.exit.interactionRadius).toBeGreaterThan(0);
    expect(TRAIN_INTERIOR_CONFIG.exit.interactionLabel).toBeTruthy();
  });

  it('tiene elementos del vagón-taller definidos', () => {
    const { elements, dimensions } = TRAIN_INTERIOR_CONFIG;
    
    expect(elements.workbench).toBeDefined();
    expect(elements.toolCabinet).toBeDefined();
    expect(elements.smallTable).toBeDefined();
    expect(elements.map).toBeDefined();
    expect(elements.telegraph).toBeDefined();
    expect(elements.windows.length).toBeGreaterThan(0);
    expect(elements.lamp).toBeDefined();
    expect(elements.cargoCrate).toBeDefined();
    expect(elements.mate).toBeDefined();

    expect(dimensions.workbench.width).toBeGreaterThan(0);
    expect(dimensions.workbench.height).toBeGreaterThan(0);
    expect(dimensions.toolCabinet.width).toBeGreaterThan(0);
    expect(dimensions.toolCabinet.height).toBeGreaterThan(0);
  });
});
