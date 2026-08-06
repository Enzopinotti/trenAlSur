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

## Oficina AFF exterior

El PNG final tiene lienzo de 288 × 192 px y transparencia fuera de la oficina. Los valores iniciales en `RETIRO_CONFIG.affOfficeExterior` excluyen los márgenes transparentes: cuerpo `150 × 26` con offset `(69, 130)`, y puerta local `(4, -62)` con radio `28`. El retorno aparece 38 px delante de ese punto. Son **provisorios** hasta inspección humana con F2.

- Confirmar que el cuerpo se limita al zócalo visible.
- Confirmar alineación visual del radio de puerta y el punto de retorno.
