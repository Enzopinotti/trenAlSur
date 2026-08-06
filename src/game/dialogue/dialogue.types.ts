export type DialogueActorId = 'foreman' | 'aff' | 'affClerk' | 'narrator' | 'system' | 'crew';

export interface DialogueLine {
  actorId: DialogueActorId;
  text: string;
}

export type DialogueSequence = readonly DialogueLine[];
