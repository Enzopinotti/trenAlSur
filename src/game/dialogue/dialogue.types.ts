export type DialogueActorId = 'foreman' | 'aff' | 'narrator' | 'system';

export interface DialogueLine {
  actorId: DialogueActorId;
  text: string;
}

export type DialogueSequence = readonly DialogueLine[];
