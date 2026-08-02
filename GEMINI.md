# Contexto persistente para Gemini / Antigravity

Antes de analizar, modificar, revisar o ejecutar acciones en este repositorio, leé y cumplí completamente [`AGENTS.md`](./AGENTS.md).

## Reglas críticas que nunca deben omitirse

- Trabajar en español y explicar causa, solución y validación.
- Mantener TypeScript estricto; no ocultar errores con `any`, `@ts-ignore` o cambios cosméticos.
- Preservar la arquitectura existente y hacer cambios pequeños, verificables y mantenibles.
- No crear abstracciones o dependencias sin necesidad actual.
- No mezclar responsabilidades de escena, entidad, UI, estado, assets y persistencia.
- Limpiar listeners, timers y suscripciones al cerrar escenas.
- Antes de finalizar ejecutar `npm run typecheck`, `npm run build` y las pruebas relacionadas.
- Para cambios jugables o visuales, realizar además una prueba manual del flujo afectado.
- No afirmar que algo funciona si no fue validado.
- No hacer commit ni push salvo pedido explícito.
- Los commits deben estar en español y usar exclusivamente `add:` o `fix:`.

## Formato obligatorio de respuesta final

1. Resultado.
2. Archivos modificados.
3. Decisiones técnicas.
4. Validaciones ejecutadas y resultado real.
5. Errores encontrados y solución.
6. Pendientes o riesgos.
7. Commit sugerido con `add:` o `fix:`.

Si una instrucción del usuario entra en conflicto con una buena práctica importante, explicá el riesgo antes de implementar. Para el resto de las reglas y ejemplos, prevalece `AGENTS.md`.
