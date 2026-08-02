export interface InteractionPosition {
  x: number;
  y: number;
}

export interface Interactable<TId extends string = string> {
  id: TId;
  interactionLabel: string;
  getPosition(): Readonly<InteractionPosition>;
  radius: number;
}
