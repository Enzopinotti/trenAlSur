# M0 — Baseline técnico y CI

## Autoridad de partida

M0 parte de `main` en:

`da0c28713984148679a32baffc03b0d2e46e5787`

Este baseline ya incluye:

- primera escena del vagón-taller integrada;
- lienzo maestro y guía de assets publicados;
- Issue #1 abierta únicamente por prueba manual jugable.

## Stack observado

- Phaser: `^3.80.0`;
- TypeScript: `^5.4.0`;
- Vite: `^5.2.0`;
- Vitest: `^1.5.0`;
- Node previamente sin pin de repositorio;
- TypeScript strict habilitado.

## Evidencia reproducida antes de M0

Sobre la misma base de producto se reprodujo con Node 24.20.0:

- `npm ci`: verde;
- `npm run typecheck`: verde;
- `npm test -- --run`: 15/15 archivos, 89/89 tests;
- `npm run build`: verde;
- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilidades;
- audit completo: 7 vulnerabilidades de tooling/dev:
  - 2 moderate;
  - 4 high;
  - 1 critical.

El audit completo se mide pero no bloquea M0 porque su limpieza corresponde a M2. Producción sí queda como gate bloqueante desde el primer workflow permanente.

## Dependencias revisadas

No se asume que un paquete está muerto por nombre o antigüedad.

Consumidores verificados:

- `mitt` → `src/core/events/bus.ts`;
- `idb` → `src/core/save/SaveService.ts`;
- `clipboardy` → `src/dev/dump-project.ts`;
- `tsx` se conserva como runtime de tooling TypeScript mientras exista `dump-project.ts`.

`src/core/pool/Pool.ts` queda registrado como candidato a código muerto, pero M0 no lo elimina.

## CI permanente

`.github/workflows/quality.yml` ejecuta en pushes de `main` y ramas `modernize/**`, y en PRs hacia `main`:

1. checkout exacto;
2. Node 24.20.0;
3. `npm ci`;
4. typecheck;
5. tests;
6. build;
7. audit de producción bloqueante;
8. audit completo medido.

## No objetivos de M0

- no cambiar versiones;
- no regenerar el lockfile;
- no cambiar gameplay;
- no modificar save schema;
- no cerrar Issue #1;
- no borrar código o dependencias.

## Salida esperada

M0 termina cuando GitHub Actions reproduce el baseline actual de forma permanente y el workflow queda publicado en `main`.
