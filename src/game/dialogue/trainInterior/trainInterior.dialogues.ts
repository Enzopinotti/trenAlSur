import type { DialogueSequence } from '../dialogue.types';

export const SOFIA_INTRO: DialogueSequence = [
  { actorId: 'sofia', text: 'Buenas. Soy Sofía, me encargo de que todo esto siga andando.' },
  { actorId: 'sofia', text: 'Este vagón es mi taller. Acá reviso los ejes, engranajes y todo lo que necesita la ruta.' },
  { actorId: 'sofia', text: 'Todavía recién llegás, ¿no? El tren se siente. Hay que acostumbrarse al movimiento.' },
  { actorId: 'sofia', text: 'Tenemos un viaje largo hasta Arequipa. El cargamento del Proyecto Aurora va en el vagón de atrás.' },
  { actorId: 'sofia', text: 'Más tarde quiero que revises la presión de los frenos conmigo. Por ahora, conocé el lugar.' },
];

export const SOFIA_ALREADY_MET: DialogueSequence = [
  { actorId: 'sofia', text: 'Cuando quieras practicar con los frenos, avisame. Es mejor aprenderlos antes de llegar a las alturas.' },
];
