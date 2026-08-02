# Calibración física provisional — Retiro

## Coche del Tren al Sur

El PNG de 640 × 192 px se inspeccionó durante desarrollo para excluir márgenes transparentes, halo y sombra del cuerpo de Arcade Physics. Esa inspección no ocurre durante la ejecución del juego.

| Elemento | Valor provisional en `RETIRO_CONFIG` | Estado |
| --- | --- | --- |
| Cuerpo | `offsetX: 32`, `offsetY: 112`, `width: 576`, `height: 42` | Pendiente de calibración humana |
| Puerta | `localX: -230`, `localY: -105`, `radius: 56` | Pendiente de calibración humana |

Los offsets de la puerta se miden desde el origen lógico `(0.5, 1)`. `TrainCoach.getDoorInteractionPoint()` aplica únicamente posición y escala.

## Checklist de calibración humana

- Activar F2 y comprobar que el cuerpo no cubra transparencia, halo ni sombra.
- Confirmar que el jugador pueda acercarse a la puerta desde el andén.
- Confirmar que la puerta visual y su radio estén alineados.
- Confirmar que el jugador se vea delante del lateral del coche.
- Reemplazar los valores provisionales de esta tabla y de `RETIRO_CONFIG` sólo después de la prueba manual.
