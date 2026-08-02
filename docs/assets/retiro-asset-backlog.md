# Backlog de assets — Retiro

Estado permitido: **pendiente**, **generado**, **normalizado**, **integrado** o **validado**. Las dimensiones visibles son estimaciones de composición, no pedidos de escalado automático.

## Fase A — Estructuras principales

| Asset | Ruta prevista | Lienzo | Visible | Perspectiva | Estado |
| --- | --- | --- | --- | --- | --- |
| Coche del Tren al Sur | `public/assets/trains/tren-al-sur/coach-exterior.png` | 640×192 | 600×140 aprox. | lateral 2D | integrado; calibración física pendiente |
| Oficina AFF de época | `public/assets/stations/retiro/aff-office.png` | 256×192 | 240×180 | frontal superior | pendiente |
| Marquesina del andén | `public/assets/stations/retiro/platform-canopy.png` | 1200×160 | 1100×140 | frontal superior | pendiente |
| Columnas de hierro | `public/assets/stations/retiro/iron-column.png` | 48×240 | 32×220 | frontal | pendiente |
| Piso modular del hall | `public/assets/stations/retiro/hall-floor.png` | 48×40 | 48×40 | superior | pendiente |
| Piso modular del andén | `public/assets/stations/retiro/platform-floor.png` | 48×40 | 48×40 | superior | pendiente |
| Vías y durmientes | `public/assets/stations/retiro/tracks.png` | 256×128 | 256×128 | superior | pendiente |

## Fase B — Props grandes

| Asset | Ruta prevista | Lienzo | Visible | Perspectiva | Estado |
| --- | --- | --- | --- | --- | --- |
| Banco ferroviario | `public/assets/stations/retiro/bench.png` | 112×48 | 96×30 | frontal superior | pendiente |
| Carro de equipaje | `public/assets/stations/retiro/luggage-cart.png` | 80×64 | 60×48 | frontal superior | pendiente |
| Balanza de carga | `public/assets/stations/retiro/cargo-scale.png` | 64×64 | 40×42 | frontal | pendiente |
| Puesto telegráfico | `public/assets/stations/retiro/telegraph-desk.png` | 96×64 | 60×38 | frontal superior | pendiente |
| Reloj de estación | `public/assets/stations/retiro/station-clock.png` | 48×48 | 36×36 | frontal | pendiente |
| Señal mecánica | `public/assets/stations/retiro/track-signal.png` | 48×128 | 32×84 | lateral | pendiente |
| Farol colgante | `public/assets/stations/retiro/hanging-lamp.png` | 48×80 | 32×52 | frontal | pendiente |

## Fase C — Props pequeños

| Asset | Ruta prevista | Lienzo | Visible | Perspectiva | Estado |
| --- | --- | --- | --- | --- | --- |
| Valijas | `public/assets/stations/retiro/luggage.png` | 64×48 | 48×34 | frontal superior | pendiente |
| Sacos de correspondencia | `public/assets/stations/retiro/mail-sacks.png` | 64×48 | 48×34 | frontal superior | pendiente |
| Cajones | `public/assets/stations/retiro/crates.png` | 64×64 | 48×48 | frontal superior | pendiente |
| Herramientas | `public/assets/stations/retiro/tools.png` | 48×48 | 36×30 | superior | pendiente |
| Termo y mate | `public/assets/stations/retiro/mate-set.png` | 48×48 | 30×30 | superior | pendiente |
| Periódicos | `public/assets/stations/retiro/newspapers.png` | 48×32 | 32×22 | superior | pendiente |
| Tickets | `public/assets/stations/retiro/tickets.png` | 32×32 | 20×16 | superior | pendiente |
| Carteles esmaltados | `public/assets/stations/retiro/enamel-signs.png` | 96×48 | 72×28 | frontal | pendiente |

## Fase D — Ambiente

| Asset | Ruta prevista | Lienzo | Visible | Perspectiva | Estado |
| --- | --- | --- | --- | --- | --- |
| Vapor | `public/assets/stations/retiro/steam.png` | 128×96 | 96×70 | lateral | pendiente |
| Luces | `public/assets/stations/retiro/light-glow.png` | 64×64 | 48×48 | frontal | pendiente |
| Señales de partida | `public/assets/stations/retiro/departure-signals.png` | 96×64 | 72×42 | frontal | pendiente |
| Sonidos | `public/assets/audio/retiro/` | — | — | audio | pendiente |
| Música | `public/assets/audio/music/retiro.ogg` | — | — | audio | pendiente |
| NPCs ambientales | `public/assets/characters/retiro/` | 64×96 | 46×69 | frontal superior | pendiente |

## No implementar todavía

| Sistema | Objetivo | Dependencia | Orden recomendado | Primer prototipo mínimo |
| --- | --- | --- | --- | --- |
| Reloj y ciclo diario | Dar ritmo al viaje | guardado v2 | 1 | reloj detenido con cambio manual de día |
| Diario de misiones | Mostrar objetivos y progreso | tutorial persistente | 2 | lista del objetivo actual |
| Mapa ferroviario | Elegir y leer rutas | diario de misiones | 3 | mapa estático Buenos Aires–Arequipa |
| Inventario | Transportar objetos | guardado v2 | 4 | tres espacios con items tipados |
| Comercio | Comprar y vender carga | inventario, mapa | 5 | un vendedor con dos productos |
| Reputación | Reflejar ayuda regional | misiones y comercio | 6 | un valor UFES con una recompensa |
| Relaciones | Registrar vínculos con NPC | diálogos y guardado | 7 | afinidad con un personaje |
| Clima | Variar viaje y ambiente | ciclo diario | 8 | modificador visual sin impacto |
| Boletín AFF | Comunicar contexto y eventos | ciclo diario | 9 | una nota informativa por día |
| Codex cultural | Guardar hallazgos respetuosos | diario de misiones | 10 | una entrada desbloqueable |
| Calendario | Programar festividades | ciclo diario y clima | 11 | estación del año y fecha |
| Economía | Dar progresión relajada | comercio y guardado | 12 | precios fijos y saldo único |
| Conducción del tren | Resolver tramos de viaje | mapa, economía | 13 | salida y llegada en una ruta |
| Interior del tren | Crear espacio propio | inventario y conducción | 14 | un vagón navegable sin gestión |
| Selección de origen y motivación | Personalizar inicio | relaciones y guardado | 15 | dos opciones narrativas sin bonus |
