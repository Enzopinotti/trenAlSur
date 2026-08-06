import { ASSET_KEYS } from '@/game/assets/assetKeys';
import type { DialogueActorId } from './dialogue.types';

export interface DialogueActorPresentation {
  displayName: string;
  portraitKey?: string;
  nameColor: string;
  accentColor: number;
}

export const DIALOGUE_ACTORS: Record<DialogueActorId, DialogueActorPresentation> = {
  foreman: {
    displayName: 'Capataz',
    portraitKey: ASSET_KEYS.foremanPortrait,
    nameColor: '#ffd54a',
    accentColor: 0xb7094c,
  },
  aff: {
    displayName: 'AFF',
    nameColor: '#48cae4',
    accentColor: 0x028090,
  },
  affClerk: {
    displayName: 'Empleado AFF',
    nameColor: '#b6d8cc',
    accentColor: 0x477b78,
  },
  narrator: {
    displayName: 'Narrador',
    nameColor: '#e2e8f0',
    accentColor: 0x5a3d28,
  },
  system: {
    displayName: 'Sistema',
    nameColor: '#38bdf8',
    accentColor: 0x1e3a8a,
  },
  sofia: {
    displayName: 'Sofía',
    nameColor: '#f472b6',
    accentColor: 0x831843,
  },
};
