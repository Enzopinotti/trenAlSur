# Phaser + Vite + TypeScript Starter (con contratos)

Starter listo para **subir a un repo** y comenzar un juego grande en navegador con **Phaser 3**, **Vite** y **TypeScript**. 
Incluye contratos (interfaces), escenas base, overlay de debug y un servicio de guardado con **IndexedDB**.

## Quick Start
```bash
npm i
npm run dev
```
Abrí la URL que muestra Vite. Verás **Boot → Preload (barra) → Menú → Mundo**.

## Scripts
- `npm run dev` — servidor de desarrollo (Vite)
- `npm run build` — build de producción
- `npm run preview` — servir build
- `npm run typecheck` — TypeScript
- `npm test` — Vitest (para lógica pura)

## Estructura
```
src/
  main.ts
  game/
    scenes/BootScene.ts
    scenes/PreloadScene.ts
    scenes/MenuScene.ts
    scenes/WorldScene.ts
    systems/DebugOverlay.ts
    config.ts
  core/
    events/bus.ts
    pool/Pool.ts
    save/SaveService.ts
  types/contracts.ts
  utils/math.ts
index.html
```

## Contratos (resumen)
- `GameState` — estado serializable del juego (día, estación, etc.).
- `SaveSlot`, `SaveService` — interfaz para persistencia; implementación con IndexedDB.
- `AssetManifest` — contrato para describir assets por escena (expandible).
- `AudioBus` — interfaz de ruteo de audio (stub).
- `GameEvents` — catálogo de eventos del juego (type-safe).

## Notas
- Por simplicidad no hay assets binarios; el Preload dibuja una barra y simula carga.
- Si agregás imágenes/sonidos, ponelos en `public/assets/...` y cargalos en `PreloadScene`.
