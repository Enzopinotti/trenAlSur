export enum TutorialStep {
  TALK_TO_FOREMAN = 'TALK_TO_FOREMAN',
  CHECK_AFF_BOARD = 'CHECK_AFF_BOARD',
  RETURN_TO_TRAIN = 'RETURN_TO_TRAIN',
  COMPLETED = 'COMPLETED',
}

export function isTutorialStep(value: unknown): value is TutorialStep {
  return typeof value === 'string'
    && Object.values(TutorialStep).some((step) => step === value);
}

export type InteractableId = 'foreman' | 'affBoard' | 'trainDoor';

import type { DialogueSequence } from '@/game/dialogue/dialogue.types';

export interface TutorialTransitionResult {
  step: TutorialStep;
  objectiveText: string;
  dialogue: DialogueSequence;
  stepChanged: boolean;
}
