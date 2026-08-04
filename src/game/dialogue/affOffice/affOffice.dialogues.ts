import type { DialogueSequence } from '../dialogue.types';

export const AFF_CLERK_PERMISSION: DialogueSequence = [
  { actorId: 'affClerk', text: 'Buenas. Ya dejé asentado tu permiso ferroviario para el Tren al Sur.' },
  { actorId: 'narrator', text: 'El sello de la AFF confirma tu salida.' },
];

export const AFF_CLERK_CONFIRMED: DialogueSequence = [
  { actorId: 'affClerk', text: 'Tu permiso ya está aprobado. Podés volver al andén.' },
];
