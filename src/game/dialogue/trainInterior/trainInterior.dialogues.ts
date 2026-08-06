import type { DialogueSequence } from '../dialogue.types';

export const CREW_INTRO: DialogueSequence = [
  { actorId: 'crew', text: 'Bienvenido a bordo. Soy el encargado de este vagón.' },
  { actorId: 'crew', text: 'El Tren al Sur no es solo un medio de transporte. Es un puente entre comunidades.' },
  { actorId: 'crew', text: 'Cuando estés listo, podés volver al andén. El capataz te estará esperando.' },
];

export const CREW_ALREADY_MET: DialogueSequence = [
  { actorId: 'crew', text: 'El tren está listo para partir cuando lo decidas.' },
];
