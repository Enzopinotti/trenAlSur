import type { DialogueSequence } from './dialogue.types';

export const FOREMAN_INTRO: DialogueSequence = [
  {
    actorId: 'foreman',
    text: 'Llegaste justo. Retiro parece puro ruido, pero escuchá bien: cada silbato es alguien esperando que cumplamos.',
  },
  {
    actorId: 'foreman',
    text: 'Este tren no lleva solamente carga. Lleva remedios, herramientas, cartas y canciones. Donde se detiene, algo empieza a moverse.',
  },
  {
    actorId: 'foreman',
    text: 'Mi abuela decía que San Martín abrió caminos cruzando montañas. A nosotros nos toca cuidarlos, riel por riel.',
  },
  {
    actorId: 'foreman',
    text: 'Hoy empezamos simple. Andá al tablero de la AFF y reservá el slot de las 08:40 a Rosario.',
  },
];

export const FOREMAN_REMINDER: DialogueSequence = [
  {
    actorId: 'foreman',
    text: 'No hace falta conocer todo el camino el primer día. Rosario primero. Después, el tren te va enseñando el resto.',
  },
];

export const BOARD_LOCKED: DialogueSequence = [
  {
    actorId: 'aff',
    text: 'La terminal solicita autorización de la tripulación.',
  },
  {
    actorId: 'narrator',
    text: 'Será mejor hablar primero con el capataz.',
  },
];

export const BOARD_SUCCESS: DialogueSequence = [
  {
    actorId: 'aff',
    text: 'Retiro → Rosario. Salida: 08:40. Peaje estimado: 12 SUR.',
  },
  {
    actorId: 'narrator',
    text: 'Una línea turquesa cruza el mapa. El nombre del Tren al Sur queda encendido entre decenas de rutas.',
  },
  {
    actorId: 'aff',
    text: 'Slot confirmado. Prioridad cooperativa registrada.',
  },
  {
    actorId: 'narrator',
    text: 'En Rosario todavía no lo saben, pero ya hay gente esperando lo que llevamos.',
  },
];

export const BOARD_ALREADY_RESERVED: DialogueSequence = [
  {
    actorId: 'aff',
    text: 'Slot Retiro → Rosario confirmado para las 08:40.',
  },
  {
    actorId: 'narrator',
    text: 'En el tablero, la línea turquesa sigue encendida.',
  },
];

export const DOOR_LOCKED: DialogueSequence = [
  {
    actorId: 'narrator',
    text: 'La puerta está lista, pero el tren todavía no tiene una vía asignada.',
  },
];

export const DOOR_SUCCESS: DialogueSequence = [
  {
    actorId: 'narrator',
    text: 'La chapa vibra bajo tu mano. Del otro lado se oyen válvulas, pasos y una máquina que parece despertar.',
  },
  {
    actorId: 'foreman',
    text: 'Listo. La vía es nuestra por un rato.',
  },
  {
    actorId: 'foreman',
    text: 'Un slot solamente dice cuándo salimos. Lo que dejamos en cada estación dice quiénes somos.',
  },
  {
    actorId: 'system',
    text: 'Tutorial completado. Próximo destino: Rosario.',
  },
];

export const DOOR_COMPLETED: DialogueSequence = [
  {
    actorId: 'foreman',
    text: 'Todo listo. Cuando subas, el camino deja de ser un mapa y empieza a ser una historia.',
  },
];
