import { RETIRO_CONFIG } from '@/game/levels/retiro/retiro.config';
import type { Season } from '@/game/config';
import type { GameStateV2, PlayerSavePosition } from '@/types/contracts';
import { TutorialStep } from '@/game/tutorial/retiroTutorial.types';

const SEASONS: readonly Season[] = ['Primavera', 'Verano', 'Otoño', 'Invierno'];

const DEFAULT_STATE: GameStateV2 = {
  version: 2,
  day: 1,
  season: RETIRO_CONFIG.defaultSeason,
  tutorialStep: TutorialStep.TALK_TO_FOREMAN,
  player: {
    x: RETIRO_CONFIG.playerSpawn.x,
    y: RETIRO_CONFIG.playerSpawn.y,
  },
};

export function migrateSaveState(input: unknown): GameStateV2 {
  const candidate = asRecord(input);
  if (!candidate) {
    warnFallback('La partida no contiene un objeto de estado válido.');
    return copyDefaultState();
  }

  const day = readDay(candidate.day);
  const season = readSeason(candidate.season);
  const player = readPlayer(candidate.player);
  const hasValidTutorialStep = isTutorialStep(candidate.tutorialStep);
  const tutorialStep = readTutorialStep(candidate.tutorialStep);

  if (candidate.version === 1 && !hasValidTutorialStep) {
    warnFallback('La partida v1 no contiene un tutorialStep válido.');
  } else if (!hasValidTutorialStep) {
    warnFallback('El tutorialStep es inválido; se restauró TALK_TO_FOREMAN.');
  }
  if (candidate.version !== 1 && candidate.version !== 2) {
    warnFallback('La versión de guardado es inválida; se migró al formato v2.');
  }

  return {
    version: 2,
    day,
    season,
    tutorialStep,
    player,
  };
}

export function isTutorialStep(value: unknown): value is TutorialStep {
  switch (value) {
    case TutorialStep.TALK_TO_FOREMAN:
    case TutorialStep.CHECK_AFF_BOARD:
    case TutorialStep.RETURN_TO_TRAIN:
    case TutorialStep.COMPLETED:
      return true;
    default:
      return false;
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object'
    ? value as Record<string, unknown>
    : null;
}

function readDay(value: unknown): number {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 1) {
    return value;
  }

  warnFallback('El día es inválido; se restauró el día 1.');
  return DEFAULT_STATE.day;
}

function readSeason(value: unknown): Season {
  if (isSeason(value)) return value;

  warnFallback('La season es inválida; se restauró Primavera.');
  return DEFAULT_STATE.season;
}

function readPlayer(value: unknown): PlayerSavePosition {
  const player = asRecord(value);
  const x = player?.x;
  const y = player?.y;
  if (isWorldCoordinate(x, RETIRO_CONFIG.world.width)
    && isWorldCoordinate(y, RETIRO_CONFIG.world.height)) {
    return { x, y };
  }

  warnFallback('La posición del jugador es inválida; se restauró el spawn de Retiro.');
  return { ...DEFAULT_STATE.player };
}

function readTutorialStep(value: unknown): TutorialStep {
  if (isTutorialStep(value)) return value;
  return DEFAULT_STATE.tutorialStep;
}

function isSeason(value: unknown): value is Season {
  return value === SEASONS[0]
    || value === SEASONS[1]
    || value === SEASONS[2]
    || value === SEASONS[3];
}

function isWorldCoordinate(value: unknown, maximum: number): value is number {
  return typeof value === 'number'
    && Number.isFinite(value)
    && value >= 0
    && value <= maximum;
}

function copyDefaultState(): GameStateV2 {
  return {
    ...DEFAULT_STATE,
    player: { ...DEFAULT_STATE.player },
  };
}

function warnFallback(message: string): void {
  console.warn(`[SaveMigration] ${message}`);
}
