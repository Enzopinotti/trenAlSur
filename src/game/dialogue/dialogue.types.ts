export type DialogueSpeaker = 'Capataz' | 'AFF' | 'Narrador' | 'Sistema';

export interface DialogueLine {
  speaker: DialogueSpeaker;
  text: string;
}

export type DialogueSequence = readonly DialogueLine[];
