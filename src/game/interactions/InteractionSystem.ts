import type { Interactable, InteractionPosition } from './interaction.types';

const DEFAULT_EXIT_TOLERANCE = 8;

export class InteractionSystem<TInteractable extends Interactable = Interactable> {
  private target: TInteractable | null = null;

  constructor(private readonly exitTolerance = DEFAULT_EXIT_TOLERANCE) {}

  get currentTarget(): TInteractable | null {
    return this.target;
  }

  update(
    playerPosition: Readonly<InteractionPosition>,
    interactables: readonly TInteractable[],
  ): TInteractable | null {
    if (this.shouldKeepCurrentTarget(playerPosition, interactables)) {
      return this.target;
    }

    this.target = this.findNearestTarget(playerPosition, interactables);
    return this.target;
  }

  clear(): void {
    this.target = null;
  }

  private shouldKeepCurrentTarget(
    playerPosition: Readonly<InteractionPosition>,
    interactables: readonly TInteractable[],
  ): boolean {
    const currentTarget = this.target;
    if (!currentTarget || !interactables.includes(currentTarget)) return false;

    return distanceBetween(playerPosition, currentTarget.getPosition())
      <= currentTarget.radius + this.exitTolerance;
  }

  private findNearestTarget(
    playerPosition: Readonly<InteractionPosition>,
    interactables: readonly TInteractable[],
  ): TInteractable | null {
    let nearest: TInteractable | null = null;
    let nearestDistance = Infinity;

    for (const interactable of interactables) {
      const distance = distanceBetween(playerPosition, interactable.getPosition());
      if (distance <= interactable.radius && distance < nearestDistance) {
        nearest = interactable;
        nearestDistance = distance;
      }
    }

    return nearest;
  }
}

function distanceBetween(
  first: Readonly<InteractionPosition>,
  second: Readonly<InteractionPosition>,
): number {
  return Math.hypot(first.x - second.x, first.y - second.y);
}
