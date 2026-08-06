# Guía de assets, dimensiones y ambientación — Tren al Sur

> Contrato de producción visual para que cualquier persona o IA pueda generar assets compatibles con el juego sin adivinar escala, encuadre, colisiones ni uso narrativo.
>
> Estado: activo.
>
> Primera aplicación: interior del Tren al Sur en Retiro.

---

## 1. Regla obligatoria

Toda tarea que agregue o reemplace un elemento visual debe incluir una ficha de producción con dimensiones.

Esto aplica a:

- personajes;
- retratos;
- edificios;
- fondos;
- interiores;
- muebles;
- objetos pequeños;
- vehículos;
- señalética;
- iconos;
- elementos de interfaz;
- efectos visuales;
- sprites animados.

No se debe pedir “un banco”, “una puerta” o “un personaje” sin indicar cómo entra en la escala real del juego.

---

## 2. Jerarquía de canon

Para evitar mezclar versiones incompatibles, se usa este orden:

1. Estado real del repositorio y decisiones escritas en `AGENTS.md`.
2. GDD maestro ambientado en 1930.
3. Documentos específicos coherentes con 1930.
4. Documentos modulares de 2025 sólo como biblioteca de ideas reutilizables.

### Canon activo

- Año: 1930.
- Tecnología: vapor, electricidad temprana, telégrafo, lámparas, instrumentos analógicos y documentación en papel.
- Institución principal: UFES.
- AFF: organismo ferroviario operativo dentro del mundo, representado con estética administrativa de época.
- Ruta narrativa: Buenos Aires hacia Arequipa.
- Tono: cálido, esperanzador, aventurero, comunitario y culturalmente respetuoso.

### Elementos que no entran en el canon activo

Salvo que se reescriban para la época, no deben aparecer:

- celulares;
- pantallas digitales;
- trenes bala;
- interfaces futuristas;
- electrificación contemporánea masiva;
- lenguaje corporativo moderno;
- estética de aplicación móvil;
- año 2025 visible dentro del juego.

Ideas como reputación regional, cooperativas, peajes, ferias y tensiones entre servicio público e intereses privados pueden reutilizarse si se adaptan a 1930.

---

## 3. Escala técnica base

### Resolución del juego

- Canvas lógico: `800 × 600 px`.
- Relación: `4:3`.
- La composición principal debe ser legible en esta resolución.

### Personajes

El jugador actual establece la escala de referencia:

- frame individual: `64 × 96 px`;
- spritesheet de 12 frames: `192 × 384 px`;
- distribución: 3 columnas × 4 filas;
- orden de filas: abajo, izquierda, derecha, arriba;
- tamaño visible aproximado: `46 × 69 px`;
- escala en Phaser: `0.72`;
- origen lógico: `(0.5, 1)` en los pies;
- hitbox: `22 × 18 px`;
- offset de hitbox dentro del frame: `x 21 px`, `y 74 px`;
- formato: PNG con transparencia;
- filtrado: nearest-neighbor, sin suavizado.

Todo NPC humano caminable debe usar esta misma grilla, salvo una excepción documentada.

### Retratos de diálogo

- archivo maestro recomendado: `512 × 512 px`;
- relación: 1:1;
- área segura del rostro: centro `360 × 400 px`;
- fondo: transparente;
- tamaño visible en UI: `104 × 104 px`;
- evitar detalles esenciales en los 48 px exteriores;
- exportación: PNG RGBA.

### Exterior del coche actual

- archivo existente: `640 × 192 px`;
- escala de escena: `1`;
- cuerpo físico aproximado actual: `576 × 42 px`;
- cualquier variante exterior debe conservar el mismo canvas y alineación de puerta salvo cambio de código planificado.

---

## 4. Ficha obligatoria de cada asset

Cada asset debe documentarse con este formato:

```md
### Nombre visible

- Asset ID:
- Escena:
- Función narrativa:
- Función jugable:
- Año y tecnología:
- Perspectiva:
- Canvas maestro:
- Canvas final en juego:
- Tamaño visible en juego:
- Posición o zona sugerida:
- Origen/ancla:
- Hitbox:
- Offset de hitbox:
- Punto de interacción:
- Radio de interacción:
- Profundidad/capa:
- Frames o variantes:
- Paleta y materiales:
- Iluminación:
- Formato de exportación:
- Nombre de archivo:
- Prompt de generación:
- Negative prompt:
- Estado de calibración:
```

### Estados de calibración

- `propuesto`: todavía no fue probado en escena;
- `provisional`: integrado, requiere ajuste visual o físico;
- `validado`: probado manualmente y aceptado;
- `reemplazar`: placeholder que no debe considerarse arte final.

---

## 5. Criterios para prompts de IA

Todo prompt de generación debe incluir:

1. objeto exacto;
2. época;
3. función dentro de la escena;
4. perspectiva;
5. dimensiones exactas;
6. fondo transparente o fondo completo;
7. dirección de luz;
8. escala respecto de un personaje de `46 × 69 px` visible;
9. materiales;
10. nivel de desgaste;
11. restricciones negativas;
12. formato final.

### Negative prompt general

```text
sin elementos modernos, sin pantallas digitales, sin plástico contemporáneo,
sin luces LED, sin estética futurista, sin texto ilegible, sin logos reales,
sin perspectiva isométrica si el asset es top-down, sin sombras cortadas,
sin fondo opaco cuando se solicita transparencia, sin marco, sin watermark
```

---

## 6. Primera escena final: vagón-taller de Sofía

### Decisión narrativa

El primer interior no debe sentirse como un coche de pasajeros genérico.

Será el **vagón-taller de Sofía Pereyra**, mecánica de la UFES y primera compañera estable del jugador.

La escena debe presentar:

- el tren como hogar y herramienta de trabajo;
- la tecnología ferroviaria de 1930;
- la misión continental sin explicarla con una pared de texto;
- la personalidad técnica e idealista de Sofía;
- un primer indicio del cargamento especial rumbo a Arequipa;
- calidez, carbón, madera, metal y vida cotidiana.

### Texto ambiental base

> El interior huele a madera aceitada, carbón y tela húmeda. Afuera, Retiro sigue vibrando.

### Objetivo inicial

`Recorré el vagón taller y hablá con Sofía.`

### Función del primer diálogo

Sofía debe:

- presentarse;
- explicar que estará a cargo del mantenimiento;
- transmitir cariño por el tren;
- señalar un próximo chequeo concreto;
- evitar explicar de golpe toda la UFES.

---

## 7. Dimensiones generales del vagón-taller

### Escena completa

- canvas lógico final: `800 × 600 px`;
- canvas maestro recomendado para generación: `1600 × 1200 px`;
- reducción final: 50% con nearest-neighbor;
- perspectiva: top-down con leve lectura frontal de paredes y muebles;
- cámara: fija en la primera versión;
- margen técnico exterior: 24 px por lado;
- área interior visual: `704 × 480 px`;
- área caminable objetivo: `640 × 260 px`;
- pasillo mínimo libre: `72 px`;
- puerta de salida: centrada en zona inferior;
- luz principal: cálida desde lámparas interiores;
- luz secundaria: azul grisácea desde ventanas del andén.

### Capas recomendadas

1. fondo exterior visible por ventanas;
2. piso y estructura del vagón;
3. muebles inferiores;
4. jugador y NPCs;
5. muebles altos y elementos de oclusión;
6. reflejos, humo, polvo y luz;
7. UI.

---

## 8. Lista inicial de assets del vagón-taller

### 8.1 Fondo estructural del vagón

- Asset ID: `trainWorkshopBackground`;
- función: piso, paredes, marcos de ventanas y estructura base;
- canvas maestro: `1600 × 1200 px`;
- canvas final: `800 × 600 px`;
- tamaño visible: pantalla completa;
- fondo: opaco;
- perspectiva: top-down 2D pixel art;
- materiales: madera oscura aceitada, hierro remachado, latón envejecido;
- paleta: marrones cálidos, carbón, óxido, latón y acentos turquesa AFF;
- iluminación: lámparas ámbar + luz fría exterior;
- formato: PNG;
- nombre: `workshop-background.png`;
- estado: propuesto.

### 8.2 Sofía Pereyra — spritesheet

- Asset ID: `sofiaSprite`;
- función: NPC tutorial y mecánica del tren;
- canvas final: `192 × 384 px`;
- frames: 12;
- frame: `64 × 96 px`;
- visible en juego: `46 × 69 px`;
- origen: `(0.5, 1)`;
- hitbox: `22 × 18 px`;
- offset: `21, 74`;
- vestuario: pantalón de trabajo, camisa arremangada, chaleco o delantal técnico, botas, pañuelo discreto;
- accesorios: llave o paño en variantes, sin herramienta ocupando el hitbox;
- época: 1930;
- formato: PNG RGBA;
- nombre: `sofia.png`;
- estado: propuesto.

### 8.3 Sofía Pereyra — retrato

- Asset ID: `sofiaPortrait`;
- canvas maestro/final: `512 × 512 px`;
- visible en diálogo: `104 × 104 px`;
- encuadre: busto corto, mirada levemente hacia el centro del panel;
- fondo: transparente;
- expresiones iniciales: neutral cálida, entusiasmo, preocupación;
- primera entrega mínima: neutral cálida;
- formato: PNG RGBA;
- nombre: `sofia-neutral.png`;
- estado: propuesto.

### 8.4 Banco de trabajo

- Asset ID: `workshopWorkbench`;
- canvas maestro: `384 × 192 px`;
- canvas final: `192 × 96 px`;
- tamaño visible recomendado: `176 × 80 px`;
- origen: `(0.5, 1)`;
- hitbox: `168 × 34 px`;
- offset visual: alineado a las patas inferiores;
- interacción: punto frontal central;
- radio: `54 px`;
- props integrados: tornillos, llave inglesa, paño, pequeño mate, planos enrollados;
- formato: PNG RGBA;
- nombre: `workbench.png`;
- estado: propuesto.

### 8.5 Armario de herramientas

- Asset ID: `toolCabinet`;
- canvas maestro: `192 × 256 px`;
- canvas final: `96 × 128 px`;
- tamaño visible: `88 × 116 px`;
- origen: `(0.5, 1)`;
- hitbox: `76 × 28 px`;
- ubicación: pared superior izquierda;
- formato: PNG RGBA;
- nombre: `tool-cabinet.png`;
- estado: propuesto.

### 8.6 Mapa ferroviario UFES

- Asset ID: `ufesRouteMap`;
- canvas maestro: `320 × 192 px`;
- canvas final: `160 × 96 px`;
- tamaño visible: `144 × 80 px`;
- origen: `(0.5, 0.5)`;
- hitbox: sin colisión física;
- interacción: punto a 42 px por debajo;
- radio: `48 px`;
- contenido legible: recorrido general Buenos Aires–Arequipa, sin texto diminuto generado por IA;
- los rótulos finales se agregan en código o edición manual;
- nombre: `ufes-route-map.png`;
- estado: propuesto.

### 8.7 Cajón sellado del proyecto Aurora

- Asset ID: `auroraSealedCrate`;
- función narrativa: anticipar el cargamento especial sin revelarlo;
- canvas maestro: `256 × 160 px`;
- canvas final: `128 × 80 px`;
- tamaño visible: `112 × 68 px`;
- origen: `(0.5, 1)`;
- hitbox: `104 × 38 px`;
- interacción: frente del cajón;
- radio: `48 px`;
- placa: debe dejar un área limpia para agregar manualmente `AURORA — UFES — AREQUIPA`;
- cierre: flejes metálicos, sello de lacre o precinto ferroviario de época;
- nombre: `aurora-crate.png`;
- estado: propuesto.

### 8.8 Telégrafo de a bordo

- Asset ID: `trainTelegraphDesk`;
- canvas maestro: `224 × 160 px`;
- canvas final: `112 × 80 px`;
- tamaño visible: `96 × 68 px`;
- origen: `(0.5, 1)`;
- hitbox: `88 × 30 px`;
- interacción: frontal;
- radio: `46 px`;
- materiales: madera, latón, cable textil;
- sin pantallas ni indicadores digitales;
- nombre: `telegraph-desk.png`;
- estado: propuesto.

### 8.9 Ventana modular

- Asset ID: `workshopWindow`;
- canvas maestro: `224 × 144 px`;
- canvas final: `112 × 72 px`;
- tamaño visible: `96 × 64 px`;
- variantes: andén de Retiro, paisaje en movimiento, noche;
- primera variante: andén de Retiro detenido;
- animación opcional futura: reflejo o vapor en 4 frames;
- nombre: `window-retiro.png`;
- estado: propuesto.

### 8.10 Lámpara colgante

- Asset ID: `workshopLamp`;
- canvas maestro: `128 × 192 px`;
- canvas final: `64 × 96 px`;
- tamaño visible: `46 × 72 px`;
- origen: `(0.5, 0)`;
- hitbox: ninguna;
- variante encendida y apagada;
- halo de luz en asset separado;
- nombre: `hanging-lamp.png`;
- estado: propuesto.

### 8.11 Halo de luz

- Asset ID: `workshopLampGlow`;
- canvas final: `256 × 192 px`;
- gradiente radial transparente;
- centro cálido ámbar;
- sin bordes duros;
- modo de mezcla sugerido: ADD o SCREEN;
- nombre: `lamp-glow.png`;
- estado: propuesto.

### 8.12 Mate de taller

- Asset ID: `workshopMateSet`;
- canvas maestro: `96 × 96 px`;
- canvas final: `48 × 48 px`;
- tamaño visible: `34 × 34 px`;
- incluye mate, bombilla y pequeño termo o pava de época;
- fondo transparente;
- no interactuable en primera versión;
- nombre: `mate-set.png`;
- estado: propuesto.

### 8.13 Foto familiar ferroviaria

- Asset ID: `sofiaFamilyPhoto`;
- canvas maestro: `160 × 128 px`;
- canvas final: `80 × 64 px`;
- tamaño visible: `64 × 48 px`;
- estilo: fotografía sepia de tres generaciones ferroviarias;
- ubicación: sobre banco de trabajo o pared;
- interacción futura: lore personal de Sofía;
- nombre: `sofia-family-photo.png`;
- estado: propuesto.

### 8.14 Puerta de salida / fuelle

- Asset ID: `workshopExitDoor`;
- canvas maestro: `256 × 224 px`;
- canvas final: `128 × 112 px`;
- tamaño visible: `112 × 96 px`;
- origen: `(0.5, 1)`;
- hitbox lateral, dejando libre un paso mínimo de `56 px`;
- punto de interacción: centro inferior;
- radio: `48 px`;
- nombre: `exit-door.png`;
- estado: propuesto.

---

## 9. Distribución sugerida en 800 × 600

Las coordenadas son iniciales y se deben calibrar manualmente:

- Sofía: `(400, 205)`;
- banco de trabajo: `(400, 180)`;
- armario: `(150, 190)`;
- mapa UFES: `(620, 150)`;
- cajón Aurora: `(645, 330)`;
- telégrafo: `(170, 330)`;
- puerta de salida: `(400, 540)`;
- jugador al entrar: `(400, 480)`;
- ventanas: centros aproximados en `x 160, 320, 480, 640`, `y 96`.

### Área caminable

- rectángulo principal: centro `(400, 350)`, tamaño `640 × 260 px`;
- corredor a salida: centro `(400, 475)`, tamaño `112 × 170 px`;
- ningún objeto puede reducir un paso principal por debajo de `56 px`;
- pasillo recomendado: `72 px`.

---

## 10. Sonido de la escena

Aunque no son assets gráficos, deben especificarse también.

### Ambiente de Retiro desde el interior

- formato maestro: WAV;
- sample rate: 44.1 kHz;
- profundidad: 16 o 24 bits;
- loop limpio: 30–60 segundos;
- exportación runtime: OGG;
- capas: murmullo de estación, vapor distante, ruedas, silbato lejano, madera crujiendo;
- sin tránsito moderno, celulares, motores diesel contemporáneos ni anuncios electrónicos.

### Telégrafo

- clip corto mono;
- 0.5–2 segundos;
- varias variantes para evitar repetición;
- volumen bajo y diegético.

### Lámpara y taller

- zumbido eléctrico muy leve o crepitar de lámpara según tecnología definida;
- herramientas metálicas ocasionales;
- no convertir la escena en un taller ruidoso constante.

---

## 11. Revisión del prototipo técnico actual

La rama `feature/train-interior-scene` es una base útil, pero no está lista para fusionar.

### Correcto

- escena separada;
- uso de `Player` y `WorldControls`;
- `InteractionSystem`;
- `NpcRegistry`;
- retorno tipado a Retiro;
- limpieza en `SHUTDOWN`;
- sin dependencias ni assets externos.

### Bloqueos antes de aprobar

1. La puerta del tren activa la entrada en `COMPLETED`, no durante la transición desde `RETURN_TO_TRAIN`.
2. El jugador debe interactuar una segunda vez para entrar.
3. No se agregaron los tests solicitados por el issue.
4. `TrainInteriorEntryData` no tiene discriminante `kind`.
5. La validación acepta cualquier string como `season` y `tutorialStep`.
6. El NPC genérico `crew` debe reemplazarse por Sofía o justificarse narrativamente.
7. El objetivo visible no coincide con el objetivo definido en la tarea.
8. Las dimensiones visuales de asientos y ventanas están hardcodeadas fuera de la configuración.
9. El placeholder representa un coche de pasajeros y no el vagón-taller definido por la narrativa.
10. La salida a Retiro necesita transición visual y bloqueo contra llamadas repetidas.

---

## 12. Próxima unidad recomendada

**Corregir y ambientar el primer interior sin incorporar todavía arte final.**

Alcance:

1. corregir la transición Retiro → tren;
2. agregar las pruebas faltantes;
3. fortalecer validaciones y discriminantes;
4. reemplazar `crew` por `sofia`;
5. reescribir diálogos;
6. convertir la geometría placeholder en layout de vagón-taller usando las dimensiones de esta guía;
7. definir hotspots de mapa, banco y cajón Aurora;
8. mantener los hotspots no funcionales o con texto breve si la tarea debe seguir pequeña;
9. generar después los assets uno por uno con esta guía.

No se deben producir los assets definitivos antes de validar manualmente el layout placeholder.

---

## 13. Checklist antes de aceptar un asset

- [ ] Respeta la época.
- [ ] Tiene dimensiones maestras y finales.
- [ ] Coincide con la escala del jugador.
- [ ] Incluye origen y hitbox.
- [ ] Tiene transparencia correcta.
- [ ] No contiene marcas reales.
- [ ] No contiene texto generado ilegible.
- [ ] Tiene nombre de archivo definitivo.
- [ ] Fue probado en el canvas `800 × 600`.
- [ ] Fue revisado con debug de colisiones.
- [ ] Su función narrativa está documentada.
- [ ] Su estado pasó a `validado` sólo después de una prueba manual.
