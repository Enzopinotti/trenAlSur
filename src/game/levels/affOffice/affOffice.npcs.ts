import { npcId } from '@/game/npcs/npcId';

export const AFF_OFFICE_NPCS = {
  clerk: { id: npcId('aff-clerk'), role: 'clerk' },
  scribe: { id: npcId('aff-scribe'), role: 'scribe' },
  messenger: { id: npcId('aff-messenger'), role: 'messenger' },
} as const;
