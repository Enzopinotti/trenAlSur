export const RETIRO_CONFIG = {
  world: {
    width: 1200,
    height: 800,
  },
  playerSpawn: {
    x: 360,
    y: 440,
    facing: 'left',
  },
  foreman: {
    x: 240,
    y: 440,
    interactionRadius: 70,
    interactionLabel: 'Hablar con Capataz',
  },
  affBoard: {
    x: 870,
    y: 340,
    interactionRadius: 75,
    interactionLabel: 'Consultar terminal AFF',
  },
  trainDoor: {
    x: 350,
    y: 565,
    interactionRadius: 65,
    interactionLabel: 'Revisar puerta del tren',
  },
} as const;
