import {
  TutorialStep,
  InteractableId,
  TutorialTransitionResult,
} from './retiroTutorial.types';

import {
  FOREMAN_INTRO,
  FOREMAN_REMINDER,
  BOARD_LOCKED,
  BOARD_SUCCESS,
  BOARD_ALREADY_RESERVED,
  DOOR_LOCKED,
  DOOR_SUCCESS,
  DOOR_COMPLETED,
} from '@/game/dialogue/retiro.dialogues';

const OBJECTIVES: Record<TutorialStep, string> = {
  [TutorialStep.TALK_TO_FOREMAN]: 'Hablá con el capataz del Tren al Sur.',
  [TutorialStep.CHECK_AFF_BOARD]: 'Consultá la oficina de la AFF.',
  [TutorialStep.RETURN_TO_TRAIN]: 'Volvé a la puerta del Tren al Sur.',
  [TutorialStep.COMPLETED]: 'El Tren al Sur está listo para partir.',
};

export function getRetiroObjective(step: TutorialStep): string {
  return OBJECTIVES[step];
}

export function transitionRetiroTutorial(
  currentStep: TutorialStep,
  interaction: InteractableId
): TutorialTransitionResult {
  switch (currentStep) {
    case TutorialStep.TALK_TO_FOREMAN:
      if (interaction === 'foreman') {
        const nextStep = TutorialStep.CHECK_AFF_BOARD;
        return {
          step: nextStep,
          objectiveText: getRetiroObjective(nextStep),
          dialogue: FOREMAN_INTRO,
          stepChanged: true,
        };
      }
      if (interaction === 'affBoard') {
        return {
          step: currentStep,
          objectiveText: getRetiroObjective(currentStep),
          dialogue: BOARD_LOCKED,
          stepChanged: false,
        };
      }
      if (interaction === 'trainDoor') {
        return {
          step: currentStep,
          objectiveText: getRetiroObjective(currentStep),
          dialogue: DOOR_LOCKED,
          stepChanged: false,
        };
      }
      return assertNever(interaction);

    case TutorialStep.CHECK_AFF_BOARD:
      if (interaction === 'foreman') {
        return {
          step: currentStep,
          objectiveText: getRetiroObjective(currentStep),
          dialogue: FOREMAN_REMINDER,
          stepChanged: false,
        };
      }
      if (interaction === 'affBoard') {
        const nextStep = TutorialStep.RETURN_TO_TRAIN;
        return {
          step: nextStep,
          objectiveText: getRetiroObjective(nextStep),
          dialogue: BOARD_SUCCESS,
          stepChanged: true,
        };
      }
      if (interaction === 'trainDoor') {
        return {
          step: currentStep,
          objectiveText: getRetiroObjective(currentStep),
          dialogue: DOOR_LOCKED,
          stepChanged: false,
        };
      }
      return assertNever(interaction);

    case TutorialStep.RETURN_TO_TRAIN:
      if (interaction === 'foreman') {
        return {
          step: currentStep,
          objectiveText: getRetiroObjective(currentStep),
          dialogue: FOREMAN_REMINDER,
          stepChanged: false,
        };
      }
      if (interaction === 'affBoard') {
        return {
          step: currentStep,
          objectiveText: getRetiroObjective(currentStep),
          dialogue: BOARD_ALREADY_RESERVED,
          stepChanged: false,
        };
      }
      if (interaction === 'trainDoor') {
        const nextStep = TutorialStep.COMPLETED;
        return {
          step: nextStep,
          objectiveText: getRetiroObjective(nextStep),
          dialogue: DOOR_SUCCESS,
          stepChanged: true,
        };
      }
      return assertNever(interaction);

    case TutorialStep.COMPLETED:
      if (interaction === 'foreman') {
        return {
          step: currentStep,
          objectiveText: getRetiroObjective(currentStep),
          dialogue: DOOR_COMPLETED,
          stepChanged: false,
        };
      }
      if (interaction === 'affBoard') {
        return {
          step: currentStep,
          objectiveText: getRetiroObjective(currentStep),
          dialogue: BOARD_ALREADY_RESERVED,
          stepChanged: false,
        };
      }
      if (interaction === 'trainDoor') {
        return {
          step: currentStep,
          objectiveText: getRetiroObjective(currentStep),
          dialogue: DOOR_COMPLETED,
          stepChanged: false,
        };
      }
      return assertNever(interaction);

    default:
      return assertNever(currentStep);
  }
}

function assertNever(value: never): never {
  throw new Error(`[RetiroTutorial] Caso no manejado: ${JSON.stringify(value)}`);
}
