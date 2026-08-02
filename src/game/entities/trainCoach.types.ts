export interface TrainCoachBodyConfig {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

export interface TrainCoachDoorConfig {
  localX: number;
  localY: number;
  interactionRadius: number;
  interactionLabel: string;
}

export interface TrainCoachConfig {
  x: number;
  y: number;
  scale: number;
  body: TrainCoachBodyConfig;
  door: TrainCoachDoorConfig;
  calibrationStatus: 'provisional' | 'validated';
}
