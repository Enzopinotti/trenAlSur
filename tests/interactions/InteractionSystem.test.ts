import { describe, expect, it } from 'vitest';
import { InteractionSystem } from '../../src/game/interactions/InteractionSystem';
import type { Interactable } from '../../src/game/interactions/interaction.types';

function createInteractable(
  id: string,
  x: number,
  y: number,
  radius = 20,
): Interactable {
  return {
    id,
    interactionLabel: id,
    getPosition: () => ({ x, y }),
    radius,
  };
}

describe('InteractionSystem', () => {
  it('devuelve null sin objetos', () => {
    const system = new InteractionSystem();
    expect(system.update({ x: 0, y: 0 }, [])).toBeNull();
  });

  it('ignora objetos lejanos', () => {
    const system = new InteractionSystem();
    const farAway = createInteractable('far', 100, 0);
    expect(system.update({ x: 0, y: 0 }, [farAway])).toBeNull();
  });

  it('selecciona el objeto más cercano dentro de rango', () => {
    const system = new InteractionSystem();
    const farther = createInteractable('farther', 18, 0);
    const nearest = createInteractable('nearest', 8, 0);
    expect(system.update({ x: 0, y: 0 }, [farther, nearest])?.id).toBe('nearest');
  });

  it('respeta el radio de entrada', () => {
    const system = new InteractionSystem();
    const interactable = createInteractable('edge', 21, 0, 20);
    expect(system.update({ x: 0, y: 0 }, [interactable])).toBeNull();
  });

  it('conserva el objetivo dentro de la tolerancia de salida', () => {
    const system = new InteractionSystem();
    const interactable = createInteractable('target', 20, 0, 20);
    system.update({ x: 0, y: 0 }, [interactable]);
    expect(system.update({ x: -8, y: 0 }, [interactable])?.id).toBe('target');
  });

  it('libera el objetivo fuera de la tolerancia de salida', () => {
    const system = new InteractionSystem();
    const interactable = createInteractable('target', 20, 0, 20);
    system.update({ x: 0, y: 0 }, [interactable]);
    expect(system.update({ x: -9, y: 0 }, [interactable])).toBeNull();
  });

  it('consulta posiciones dinámicas en cada actualización', () => {
    let x = 100;
    const dynamic: Interactable = {
      id: 'dynamic',
      interactionLabel: 'dynamic',
      getPosition: () => ({ x, y: 0 }),
      radius: 20,
    };
    const system = new InteractionSystem();

    expect(system.update({ x: 0, y: 0 }, [dynamic])).toBeNull();
    x = 10;
    expect(system.update({ x: 0, y: 0 }, [dynamic])?.id).toBe('dynamic');
  });

  it('funciona sin depender de Phaser', () => {
    const system = new InteractionSystem();
    const interactable = createInteractable('plain-object', 0, 0);
    expect(system.update({ x: 0, y: 0 }, [interactable])?.id).toBe('plain-object');
  });
});
