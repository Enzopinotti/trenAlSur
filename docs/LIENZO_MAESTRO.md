# Lienzo maestro de desarrollo — Tren al Sur

> Fuente de verdad operativa para planificar, programar, validar y registrar el desarrollo de **Tren al Sur**.
>
> Última actualización: **6 de agosto de 2026**.
>
> Estado: **activo — versión operativa 2**.
>
> Canon activo: **Sudamérica alternativa, año 1930**.

---

## 1. Cómo usamos este lienzo

El GDD define qué juego queremos construir. Este lienzo convierte esa visión en unidades pequeñas, ordenadas y verificables.

Cada sesión de trabajo debe seguir este orden:

1. Leer `AGENTS.md`.
2. Leer la unidad activa de este lienzo.
3. Confirmar el estado real de `main`, issues, ramas y PR.
4. Elegir **una sola unidad de trabajo**.
5. Definir qué archivos pueden cambiar.
6. Implementar el cambio mínimo que complete la unidad.
7. Ejecutar typecheck, tests y build.
8. Realizar o solicitar la prueba manual correspondiente.
9. Actualizar este lienzo.
10. Recién entonces preparar commit, push, PR o merge.

### Regla de enfoque

No empezamos un sistema grande cuando todavía existe una unidad pequeña sin validar.

### Regla de evidencia

Una tarea sólo puede marcarse `[x]` cuando:

- el código está en la rama objetivo;
- las validaciones automáticas pasaron;
- la prueba manual requerida fue realizada;
- el cambio fue revisado;
- el PR fue fusionado cuando corresponda.

Un cambio existente sólo en una rama o PR se marca `[~]`.

---

## 2. Estados

- `[x]` terminado, validado y fusionado.
- `[~]` implementado o en progreso, todavía sin cierre completo.
- `[ ]` pendiente.
- `[!]` bloqueado o necesita una decisión.
- `[?]` requiere investigación o prueba de diseño.

---

## 3. Fuentes de verdad

Orden de prioridad:

1. Estado real del repositorio.
2. `AGENTS.md`.
3. Este lienzo.
4. `docs/GUIA_ASSETS_Y_AMBIENTACION.md`.
5. GDD maestro coherente con el canon de 1930.
6. Issues y decisiones registradas.
7. Documentos antiguos de 2025, sólo como biblioteca de ideas adaptables.

Cuando dos documentos se contradicen, no se mezclan silenciosamente. Se registra una decisión.

---

## 4. Visión del producto

### Fantasía central

Ser maquinista de un tren en una Sudamérica alternativa de 1930, recorriendo comunidades, culturas y paisajes conectados por la Unión Ferroviaria de Estados del Sur.

### Tono

- cálido;
- esperanzador;
- aventurero;
- nostálgico;
- culturalmente respetuoso;
- con humor ligero;
- con realismo mágico sutil;
- sin convertir el juego en una simulación ferroviaria opresiva.

### Pilares

1. Exploración cultural y aventura en tren.
2. Gestión relajada con progreso visible.
3. Narrativa ramificada y personajes memorables.
4. Comunidad, relaciones y cultura local.
5. Descubrimiento y progresión abierta.

### Regla de producto

Cada sistema o escena nueva debe fortalecer por lo menos un pilar. Si no lo hace, queda fuera del alcance inmediato.

---

## 5. Canon activo

### Mundo

- Año: 1930.
- UFES: alianza ferroviaria supranacional fundada en 1888.
- Ruta narrativa principal: Buenos Aires → Arequipa.
- Misión inicial: transportar el cargamento del **Proyecto Aurora**.
- Tecnología: vapor, electricidad temprana, telégrafo, instrumentos analógicos, papel, herramientas mecánicas.
- Moneda y organismos reales se reemplazan por elementos ficticios cuando sea necesario.

### Personajes iniciales

- Protagonista: maquinista personalizable.
- Sofía Pereyra: mecánica acompañante, 27 años, responsable del vagón-taller.
- Guillermo Bustos: jefe de seguridad, presentación posterior.
- Martín Santacruz: periodista paraguayo, presentación posterior.
- Renato Córdoba: antagonista económico, presentación posterior.

### Elementos prohibidos salvo reescritura de época

- celulares;
- pantallas digitales;
- trenes bala;
- apps o interfaces futuristas;
- lenguaje corporativo contemporáneo;
- marcas reales;
- instituciones reales usadas como antagonistas directos.

---

## 6. Regla obligatoria para assets

Todo elemento visual agregado al proyecto debe incluir dimensiones antes de ser generado por otra IA.

La ficha mínima debe indicar:

- asset ID;
- escena;
- función narrativa;
- función jugable;
- perspectiva;
- canvas maestro;
- canvas final;
- tamaño visible;
- posición sugerida;
- origen o ancla;
- hitbox;
- offset de hitbox;
- punto de interacción;
- radio de interacción;
- capa o profundidad;
- frames o variantes;
- formato;
- nombre de archivo;
- prompt;
- negative prompt;
- estado de calibración.

Referencia completa: `docs/GUIA_ASSETS_Y_AMBIENTACION.md`.

### Escala base actual

- Canvas lógico: `800 × 600 px`.
- Personaje humano: frame `64 × 96 px`.
- Spritesheet humano: `192 × 384 px`.
- Tamaño visible aproximado: `46 × 69 px`.
- Hitbox del jugador: `22 × 18 px`.
- Retrato maestro: `512 × 512 px`.
- Retrato visible: `104 × 104 px`.
- Exterior del coche existente: `640 × 192 px`.

### Estados de calibración

- `propuesto`;
- `provisional`;
- `validado`;
- `reemplazar`.

Ninguna medida provisional debe presentarse como medida final antes de probarla en escena.

---

## 7. Niveles de producto

### Nivel A — Base técnica

El juego abre, carga, guarda, muestra escenas y permite mover e interactuar al jugador.

### Nivel B — Prólogo jugable

Retiro funciona como introducción completa: capataz, oficina AFF, permiso, entrada al tren, Sofía, preparación y salida.

### Nivel C — Vertical slice

El jugador puede:

- preparar el tren;
- iniciar una jornada;
- viajar un tramo;
- resolver un evento;
- llegar a una estación;
- completar una entrega o comercio;
- descansar;
- guardar y continuar.

### Nivel D — Capítulo argentino

Buenos Aires, Pampa, Córdoba, Tucumán y frontera forman un capítulo coherente.

### Nivel E — MVP narrativo

Buenos Aires–Arequipa, sistemas principales estabilizados, trama UFES, personajes y finales principales.

No se construye el Nivel E directamente.

---

## 8. Estado real del repositorio

### Tecnología estable en `main`

- [x] Phaser 3.
- [x] TypeScript estricto.
- [x] Vite.
- [x] Arcade Physics.
- [x] Vitest.
- [x] IndexedDB.
- [x] Eventos tipados.
- [x] Reglas de trabajo en `AGENTS.md`.

### Flujo estable en `main`

- [x] Boot.
- [x] Preload.
- [x] Menú.
- [x] Retiro exterior.
- [x] Movimiento y animaciones.
- [x] Colisiones.
- [x] HUD.
- [x] Diálogos.
- [x] Interacciones.
- [x] Capataz.
- [x] Tutorial tipado.
- [x] Oficina AFF exterior e interior.
- [x] Retorno desde AFF.
- [x] Guardado y migración.
- [x] Arquitectura base de NPCs.
- [ ] Interior del tren fusionado.
- [ ] Primera salida ferroviaria.
- [ ] Jornada.
- [ ] Inventario y carga.
- [ ] Comercio.
- [ ] Viaje entre estaciones.

### Trabajo documental

- [~] PR #2 — `add: crear lienzo maestro de desarrollo`.
- [~] `docs/LIENZO_MAESTRO.md`.
- [~] `docs/GUIA_ASSETS_Y_AMBIENTACION.md`.
- [ ] Revisar PR #2.
- [ ] Fusionar PR #2.

### Trabajo jugable

- [~] Issue #1 — primera escena interior.
- [~] PR #4 — `add: crear primera escena interior del tren`.
- [~] Rama `feature/train-interior-scene`.
- [~] Dos commits por encima de `main`.
- [~] Sofía reemplaza al NPC genérico.
- [~] Layout placeholder del vagón-taller.
- [~] Dimensiones centralizadas.
- [~] Datos de entrada discriminados.
- [~] Transición corregida desde `RETURN_TO_TRAIN`.
- [~] Retorno tipado a Retiro.
- [~] Pruebas nuevas agregadas.
- [~] Typecheck, tests y build informados como correctos por la implementación.
- [ ] Reproducir validaciones en una revisión independiente.
- [ ] Realizar prueba manual completa.
- [ ] Revisar código final.
- [ ] Resolver errores encontrados.
- [ ] Confirmar estado de merge del PR.
- [ ] Fusionar PR #4.
- [ ] Cerrar Issue #1.

### Advertencias conocidas

- El PR #4 sigue en borrador.
- La prueba manual fue explícitamente postergada.
- Las geometrías son placeholders, no arte final.
- Las dimensiones del vagón-taller son provisionales.
- El informe de implementación no reemplaza nuestra revisión.
- El bundle genera una advertencia de tamaño; no bloquea este hito.
- No cambiar la versión del save dentro de este hito.

---

# 9. UNIDAD ACTIVA

## U0.1 — Validar y cerrar el primer interior

### Resultado esperado

El flujo completo funciona sin doble interacción, sin reiniciar el prólogo y sin perder estado:

`Menú → Retiro → capataz → AFF → permiso → Retiro → puerta → diálogo → vagón-taller → Sofía → salida → Retiro`

### Rama y PR

- Rama: `feature/train-interior-scene`.
- PR: #4.
- Issue: #1.
- Commit más reciente revisado: `7d81eaf`.

### Implementado en la rama

- [~] `TrainInteriorScene`.
- [~] Registro en `main.ts`.
- [~] Entrada discriminada con `kind: 'enterTrain'`.
- [~] Transición después de cerrar `DOOR_SUCCESS`.
- [~] Fade de entrada.
- [~] Fade de salida.
- [~] Objetivo: `Recorré el vagón taller y hablá con Sofía.`
- [~] Sofía como NPC.
- [~] Diálogo inicial y reinteracción.
- [~] Banco de trabajo.
- [~] Armario de herramientas.
- [~] Mesa.
- [~] Mapa Buenos Aires–Arequipa.
- [~] Telégrafo.
- [~] Ventanas.
- [~] Lámpara.
- [~] Cajón del Proyecto Aurora.
- [~] Mate.
- [~] Dimensiones configuradas.
- [~] Pruebas de configuración.
- [~] Pruebas de entrada.
- [~] Pruebas de retorno.
- [~] Pruebas de transición.

### Pendiente para cerrar la unidad

- [ ] Revisar el diff completo del PR #4.
- [ ] Confirmar que los tests prueban comportamiento real y no sólo objetos construidos manualmente.
- [ ] Revisar validadores de `Season` y `TutorialStep`.
- [ ] Revisar orden de dibujo y colisiones del entorno.
- [ ] Revisar legibilidad de `WorldScene`.
- [ ] Confirmar limpieza de todos los recursos en `SHUTDOWN`.
- [ ] Reproducir:
  - `npm run typecheck`;
  - `npm test -- --run`;
  - `npm run build`.
- [ ] Probar manualmente el recorrido completo.
- [ ] Registrar errores con pasos de reproducción.
- [ ] Corregir errores en la misma rama.
- [ ] Volver a ejecutar validaciones.
- [ ] Marcar PR listo para revisión.
- [ ] Fusionar.
- [ ] Cerrar Issue #1.
- [ ] Actualizar registro de progreso.

### Prueba manual

1. Abrir el juego desde cero.
2. Hablar con el capataz.
3. Entrar a la oficina AFF.
4. Completar el trámite.
5. Volver al andén.
6. Interactuar una sola vez con la puerta.
7. Cerrar `DOOR_SUCCESS`.
8. Confirmar entrada automática al vagón.
9. Caminar por toda el área.
10. Confirmar colisiones.
11. Hablar con Sofía.
12. Volver a hablar con Sofía.
13. Salir a Retiro.
14. Confirmar posición y orientación.
15. Confirmar que no reaparece la introducción.
16. Volver a entrar al tren.
17. Confirmar que no quedan teclas, prompts o diálogos duplicados.

### Evidencia a registrar

- resultado por paso;
- capturas si hay problemas visuales;
- error de consola;
- coordenadas aproximadas;
- comportamiento esperado;
- comportamiento observado.

### Criterio de cierre

No cerrar por compilar. Sólo cerrar cuando:

- todas las validaciones pasan;
- el recorrido manual pasa;
- no hay doble interacción;
- no hay bloqueo de movimiento;
- no hay listeners duplicados;
- Sofía puede interactuarse;
- el retorno conserva estado;
- PR #4 está fusionado.

---

## 10. Cola inmediata después de U0.1

No comenzar una unidad posterior hasta cerrar U0.1.

### U0.2 — Calibrar el vagón-taller

- [ ] Revisar layout en pantalla.
- [ ] Ajustar área caminable.
- [ ] Ajustar hitboxes.
- [ ] Evitar superposición de mapa, mesa y mate.
- [ ] Definir capas de oclusión.
- [ ] Marcar cada medida como `provisional` o `validada`.
- [ ] Actualizar la guía de assets.
- [ ] No generar arte final hasta validar geometría.

### U0.3 — Manifest de assets del vagón-taller

- [ ] Crear un manifest data-driven.
- [ ] Asignar asset ID a cada elemento.
- [ ] Definir ruta de archivo.
- [ ] Definir canvas maestro y final.
- [ ] Definir ancla e hitbox.
- [ ] Definir prompt y negative prompt.
- [ ] Definir variantes.
- [ ] Definir estado de producción.
- [ ] Crear tests del manifest.

### U0.4 — Generar e integrar primer asset

Primer candidato recomendado: **fondo estructural del vagón**.

- [ ] Generar usando la ficha aprobada.
- [ ] Exportar PNG.
- [ ] Integrar en preload.
- [ ] Mantener geometría de colisión separada.
- [ ] Comparar escala con el jugador.
- [ ] Validar legibilidad a `800 × 600`.
- [ ] Documentar calibración.

### U0.5 — Preparación interactiva del tren

- [ ] Revisar caldera.
- [ ] Verificar carga Aurora.
- [ ] Confirmar señal.
- [ ] Crear estado tipado del checklist.
- [ ] Mostrar progreso en HUD.
- [ ] Dar feedback de Sofía.
- [ ] Bloquear salida hasta completar.

### U0.6 — Cierre de Misión 0

- [ ] Presentar propósito del viaje.
- [ ] Introducir UFES sin exposición excesiva.
- [ ] Sembrar telegrama de sabotaje.
- [ ] Crear salida visual de Retiro.
- [ ] Guardar progreso.
- [ ] Desbloquear primer tramo.

---

# 11. Roadmap general

## FASE 0 — Documentación y disciplina

- [x] `AGENTS.md`.
- [x] Prefijos `add:` y `fix:`.
- [x] Validaciones obligatorias.
- [~] Lienzo maestro.
- [~] Guía de assets.
- [ ] README real.
- [ ] Plantilla de issue.
- [ ] Plantilla de PR.
- [ ] CI.
- [ ] Protección de `main`.
- [ ] Registro separado de decisiones cuando sea necesario.

## FASE 1 — Prólogo de Retiro

- [~] Interior del vagón-taller.
- [~] Sofía.
- [ ] Calibración visual.
- [ ] Assets iniciales.
- [ ] Checklist de preparación.
- [ ] Presentación de misión.
- [ ] Telegrama.
- [ ] Primera partida.

## FASE 2 — Tren como hogar persistente

- [ ] `TrainCarId`.
- [ ] Contrato de vagón.
- [ ] Orden de vagones.
- [ ] Entradas entre vagones.
- [ ] `TrainState`.
- [ ] Persistencia.
- [ ] Locomotora.
- [ ] Vagón-taller.
- [ ] Carga oficial.
- [ ] Pasajeros.
- [ ] Dos vagones recorribles como prueba.

## FASE 3 — Navegación y estado global

- [ ] `LocationId`.
- [ ] Tipos discriminados de ubicación.
- [ ] Retornos tipados.
- [ ] Fallback seguro.
- [ ] Coordinación de fades.
- [ ] Prevención de dobles transiciones.
- [ ] Estado de sesión.
- [ ] Separación entre sesión y save.

## FASE 4 — Narrativa data-driven

- [ ] IDs de diálogo.
- [ ] Contenido fuera de escenas.
- [ ] Condiciones.
- [ ] Flags.
- [ ] Decisiones.
- [ ] Misiones data-driven.
- [ ] Diario.
- [ ] Localización.
- [ ] Barks regionales.

## FASE 5 — Tiempo y descanso

- [ ] Hora del día.
- [ ] Fases de jornada.
- [ ] Pausa durante diálogos.
- [ ] Reloj UI.
- [ ] Descanso.
- [ ] Guardado al dormir.
- [ ] Calendario.
- [ ] Estaciones.
- [ ] Festivales.

## FASE 6 — Estado y mantenimiento del tren

- [ ] Integridad.
- [ ] Agua.
- [ ] Carbón.
- [ ] Presión.
- [ ] Frenos.
- [ ] Averías.
- [ ] Reparaciones.
- [ ] Mejoras.
- [ ] Feedback no opresivo.

## FASE 7 — Inventario, carga y comercio

- [ ] IDs de ítems.
- [ ] Inventario.
- [ ] Slots.
- [ ] Carga.
- [ ] Precios.
- [ ] Compra.
- [ ] Venta.
- [ ] Entregas.
- [ ] Productos culturales.
- [ ] Integración con guardado.

## FASE 8 — Viaje Buenos Aires–Córdoba

- [ ] Mapa de ruta.
- [ ] Primer segmento.
- [ ] Inicio de viaje.
- [ ] Microgestión.
- [ ] Evento en ruta.
- [ ] Llegada.
- [ ] Primera estación reutilizable.
- [ ] Gaucho polizón.
- [ ] Abastecimiento en Córdoba.

## FASE 9 — Vertical slice

- [ ] Preparar.
- [ ] Partir.
- [ ] Viajar.
- [ ] Resolver evento.
- [ ] Llegar.
- [ ] Comerciar o entregar.
- [ ] Socializar.
- [ ] Descansar.
- [ ] Guardar.
- [ ] Continuar.

## FASE 10 — Relaciones

- [ ] Afinidad.
- [ ] Confianza.
- [ ] Regalos.
- [ ] Favores.
- [ ] Escenas.
- [ ] Arcos.
- [ ] Variaciones por origen.
- [ ] Sofía completa.
- [ ] Guillermo.
- [ ] Martín.
- [ ] Elena.
- [ ] Renato.

## FASE 11 — Capítulo argentino

- [ ] Retiro completo.
- [ ] Pampa.
- [ ] Córdoba.
- [ ] Tucumán.
- [ ] Puente de los Suspiros.
- [ ] Salta/Jujuy.
- [ ] Bandoleros.
- [ ] Frontera.

## FASE 12 — Regiones internacionales

- [ ] Paraguay.
- [ ] Chile.
- [ ] Bolivia.
- [ ] Perú.
- [ ] Climas.
- [ ] Controles.
- [ ] Ferias.
- [ ] Festivales.
- [ ] Consultoría cultural.
- [ ] Arequipa.

## FASE 13 — Presentación

- [ ] Dirección visual.
- [ ] Pipeline de assets.
- [ ] Música dinámica.
- [ ] Ambientes.
- [ ] Cinemáticas.
- [ ] Retratos.
- [ ] UI final.
- [ ] Créditos culturales.

## FASE 14 — Accesibilidad

- [ ] Remapeo.
- [ ] Tamaño de texto.
- [ ] Contraste.
- [ ] Slang ON/OFF.
- [ ] Modo Historia.
- [ ] Pausa.
- [ ] Reducción de efectos.
- [ ] Ayudas de interacción.

## FASE 15 — Calidad y lanzamiento

- [ ] CI.
- [ ] Tests de migración.
- [ ] Pruebas de rendimiento.
- [ ] Guardados corruptos.
- [ ] Logs seguros.
- [ ] Builds.
- [ ] Licencias.
- [ ] Política de mods.
- [ ] Demo.
- [ ] Lanzamiento.

---

## 12. Fuera de alcance inmediato

No implementar todavía:

- combate completo;
- romance;
- economía continental;
- mods;
- Brasil, Uruguay, Ecuador, Colombia o Venezuela;
- conducción compleja;
- clima global;
- calendario completo;
- finales;
- multijugador;
- doblaje;
- arte final de todo el tren.

Se pueden documentar, pero no deben desviar U0.1.

---

## 13. Definición de terminado

Una unidad está terminada cuando:

### Código

- TypeScript estricto.
- Sin `any`.
- Sin `@ts-ignore`.
- Responsabilidades claras.
- Valores mágicos evitados.
- Recursos limpiados.

### Pruebas

- Typecheck correcto.
- Tests relevantes correctos.
- Build correcto.
- Prueba manual ejecutada.

### Juego

- Flujo alcanzable.
- Objetivo comprensible.
- Sin bloqueo.
- Sin interacción doble accidental.
- Sin pérdida de estado.
- Sin duplicación de listeners.

### Narrativa

- Canon 1930.
- Texto natural.
- Exposición breve.
- Personajes coherentes.
- Cultura respetuosa.

### Assets

- Dimensiones documentadas.
- Escala comparada con el jugador.
- Hitbox separada del arte.
- Licencia conocida.
- Estado de calibración registrado.

### GitHub

- Issue enlazado.
- Commit válido.
- PR claro.
- Riesgos escritos.
- Lienzo actualizado.

---

## 14. Tarjeta de unidad

Copiar esta plantilla al iniciar una tarea:

```md
# Ux.x — Nombre

## Resultado esperado

## Estado actual

## Rama / issue / PR

## Archivos permitidos

## Fuera de alcance

## Pasos

- [ ] ...

## Validaciones

- [ ] typecheck
- [ ] tests
- [ ] build
- [ ] prueba manual

## Assets

- [ ] no aplica
- [ ] ficha de dimensiones
- [ ] calibración

## Riesgos

## Resultado

## Próxima unidad
```

---

## 15. Protocolo para trabajar desde ChatGPT

Cuando el usuario diga **“sigamos con el lienzo”**:

1. Leer este archivo.
2. Consultar estado real de GitHub.
3. Comparar `main` con la rama activa.
4. Elegir la primera tarea pendiente de la unidad activa.
5. Explicar el cambio concreto.
6. Inspeccionar archivos antes de editarlos.
7. Trabajar en la rama correspondiente.
8. Validar.
9. Actualizar el lienzo.
10. Informar:
   - qué cambió;
   - qué pasó;
   - qué falta;
   - cuál es el próximo paso.

### Regla de commits

Sólo usar:

- `add: ...`
- `fix: ...`

Mensajes en español.

### Regla de push

No hacer commit, push, merge o cierre de issue sin autorización explícita del usuario, salvo que la instrucción activa ya lo autorice de forma clara.

---

## 16. Decisiones registradas

### D-001 — Canon temporal

El canon activo se ambienta en 1930. Los documentos de 2025 se usan sólo como biblioteca adaptable.

### D-002 — Primera tripulante

Sofía Pereyra reemplaza al NPC genérico del primer interior.

### D-003 — Primer interior

El primer interior es el vagón-taller de Sofía.

### D-004 — Cargamento

El Proyecto Aurora se insinúa desde el prólogo mediante un cajón o elemento de carga.

### D-005 — Assets

Toda solicitud de asset debe incluir dimensiones, ancla, hitbox y formato.

### D-006 — Validación

Un cambio en PR no se considera terminado hasta pasar prueba manual y merge.

### D-007 — Ritmo

Se ataca una unidad por vez.

### D-008 — Arte

La geometría se valida antes de generar arte final.

---

## 17. Riesgos

### R-001 — Mezcla de canon

Mitigación: jerarquía documental y revisión de época.

### R-002 — Scope creep

Mitigación: unidad activa y fuera de alcance.

### R-003 — Assets incompatibles

Mitigación: ficha obligatoria de dimensiones.

### R-004 — Tests que no prueban integración

Mitigación: revisar propósito de cada test y complementar con prueba manual.

### R-005 — Escenas compactadas

Mitigación: priorizar legibilidad cuando se toque el archivo.

### R-006 — Saves incompatibles

Mitigación: no cambiar schema sin plan de migración.

### R-007 — Cerrar PR prematuramente

Mitigación: mantener PR en borrador hasta validación independiente.

---

## 18. Registro de progreso

### 6 de agosto de 2026 — Base documental

- Creado el lienzo maestro.
- Creada la guía de assets y ambientación.
- Abierto PR #2.
- Creada Epic #3.
- Creada Issue #1.

### 6 de agosto de 2026 — Primera escena interior

- Creada rama `feature/train-interior-scene`.
- Abierto PR #4 en borrador.
- Agregada `TrainInteriorScene`.
- Corregida la transición desde `RETURN_TO_TRAIN`.
- Reemplazado NPC genérico por Sofía.
- Creado layout placeholder de vagón-taller.
- Centralizadas dimensiones.
- Agregadas pruebas de entrada, retorno, transición y configuración.
- Informados typecheck, tests y build correctos.
- Prueba manual pendiente.
- Revisión independiente pendiente.
- PR sin fusionar.
- Issue #1 abierta.

---

## 19. Próxima acción exacta

**No generar assets todavía.**

La próxima acción es ejecutar la tarjeta **U0.1 — Validar y cerrar el primer interior**.

Primer paso:

> Probar manualmente el flujo completo del PR #4 y registrar cualquier diferencia entre lo esperado y lo observado.

Después de esa prueba, la siguiente sesión debe corregir únicamente los errores encontrados.
