import type { DialogueSequence } from './dialogue.types';

export const FOREMAN_INTRO: DialogueSequence = [
  {
    speaker: 'Capataz',
    text: 'Llegaste justo. Retiro parece puro ruido, pero escuchá bien: cada silbato es alguien esperando que cumplamos.',
  },
  {
    speaker: 'Capataz',
    text: 'Este tren no lleva solamente carga. Lleva remedios, herramientas, cartas y canciones. Donde se detiene, algo empieza a moverse.',
  },
  {
    speaker: 'Capataz',
    text: 'Mi abuela decía que San Martín abrió caminos cruzando montañas. A nosotros nos toca cuidarlos, riel por riel.',
  },
  {
    speaker: 'Capataz',
    text: 'Hoy empezamos simple. Andá al tablero de la AFF y reservá el slot de las 08:40 a Rosario.',
  },
];

export const FOREMAN_REMINDER: DialogueSequence = [
  {
    speaker: 'Capataz',
    text: 'No hace falta conocer todo el camino el primer día. Rosario primero. Después, el tren te va enseñando el resto.',
  },
];

export const BOARD_LOCKED: DialogueSequence = [
  {
    speaker: 'AFF',
    text: 'La terminal solicita autorización de la tripulación.',
  },
  {
    speaker: 'Narrador',
    text: 'Será mejor hablar primero con el capataz.',
  },
];

export const BOARD_SUCCESS: DialogueSequence = [
  {
    speaker: 'AFF',
    text: 'Retiro → Rosario. Salida: 08:40. Peaje estimado: 12 SUR.',
  },
  {
    speaker: 'Narrador',
    text: 'Una línea turquesa cruza el mapa. El nombre del Tren al Sur queda encendido entre decenas de rutas.',
  },
  {
    speaker: 'AFF',
    text: 'Slot confirmado. Prioridad cooperativa registrada.',
  },
  {
    speaker: 'Narrador',
    text: 'En Rosario todavía no lo saben, pero ya hay gente esperando lo que llevamos.',
  },
];

export const BOARD_ALREADY_RESERVED: DialogueSequence = [
  {
    speaker: 'AFF',
    text: 'Slot Retiro → Rosario confirmado para las 08:40.',
  },
  {
    speaker: 'Narrador',
    text: 'En el tablero, la línea turquesa sigue encendida.',
  },
];

export const DOOR_LOCKED: DialogueSequence = [
  {
    speaker: 'Narrador',
    text: 'La puerta está lista, pero el tren todavía no tiene una vía asignada.',
  },
];

export const DOOR_SUCCESS: DialogueSequence = [
  {
    speaker: 'Narrador',
    text: 'La chapa vibra bajo tu mano. Del otro lado se oyen válvulas, pasos y una máquina que parece despertar.',
  },
  {
    speaker: 'Capataz',
    text: 'Listo. La vía es nuestra por un rato.',
  },
  {
    speaker: 'Capataz',
    text: 'Un slot solamente dice cuándo salimos. Lo que dejamos en cada estación dice quiénes somos.',
  },
  {
    speaker: 'Sistema',
    text: 'Tutorial completado. Próximo destino: Rosario.',
  },
];

export const DOOR_COMPLETED: DialogueSequence = [
  {
    speaker: 'Capataz',
    text: 'Todo listo. Cuando subas, el camino deja de ser un mapa y empieza a ser una historia.',
  },
];
