# Lienzo maestro de desarrollo — Tren al Sur

> Documento vivo para planificar, programar, validar y registrar el desarrollo de **Tren al Sur**.
>
> Última actualización inicial: 6 de agosto de 2026.
>
> Estado del documento: **activo**.

---

## 1. Para qué existe este lienzo

Este archivo es la fuente de verdad operativa del desarrollo. El GDD define la visión del juego; este lienzo transforma esa visión en pasos pequeños, ordenados y verificables.

Cada vez que trabajemos desde ChatGPT, Antigravity, Devin, Windsurf u otro agente:

1. Leer `AGENTS.md`.
2. Leer este lienzo.
3. Confirmar el estado real del código.
4. Elegir **una sola unidad de trabajo**.
5. Implementar el cambio más pequeño que complete esa unidad.
6. Ejecutar validaciones.
7. Actualizar este lienzo.
8. Recién entonces preparar commit o PR.

Este documento no reemplaza:

- el GDD;
- los contratos TypeScript;
- las pruebas;
- los issues detallados;
- la revisión manual del juego.

Los conecta.

---

## 2. Leyenda de estados

- [x] Terminado y validado.
- [ ] Pendiente.
- [~] En progreso.
- [!] Bloqueado o requiere decisión.
- [?] Requiere investigación o prueba de diseño.

GitHub no renderiza `[~]`, `[!]` y `[?]` como casillas interactivas. Se usan como marcas visuales. Cuando una tarea se termina, debe transformarse en `[x]`.

---

## 3. Visión que no debe perderse

### Fantasía central

Ser maquinista de un tren en una Sudamérica alternativa de 1930, recorriendo culturas, paisajes y comunidades unidas por la UFES.

### Tono

- cálido;
- esperanzador;
- aventurero;
- nostálgico;
- culturalmente respetuoso;
- con realismo mágico sutil;
- sin convertir la experiencia en una simulación ferroviaria opresiva.

### Pilares

1. Exploración cultural y aventura en tren.
2. Gestión relajada con progreso visible.
3. Narrativa ramificada y personajes memorables.
4. Comunidad, relaciones y cultura local.
5. Descubrimiento y progresión abierta.

### Regla de producto

Cada sistema nuevo debe fortalecer al menos uno de estos pilares. Si no fortalece ninguno, no entra todavía.

---

## 4. Alcance por niveles

El GDD describe una campaña amplia Buenos Aires–Arequipa. Para poder construirla, se divide en niveles de producto.

### Nivel A — Base técnica

El juego abre, carga, guarda, muestra escenas y permite mover e interactuar al jugador.

### Nivel B — Prólogo jugable

Retiro funciona como una introducción completa: capataz, oficina AFF, permiso, entrada al tren, presentación de la tripulación y cierre del prólogo.

### Nivel C — Primera experiencia vertical

El jugador puede:

- preparar el tren;
- iniciar una jornada;
- viajar por un primer tramo;
- resolver un evento;
- detenerse en una estación;
- comerciar o completar una entrega;
- descansar;
- guardar y continuar.

Este nivel debe demostrar el juego completo en pequeño.

### Nivel D — Capítulo argentino

Buenos Aires, Pampa, Córdoba, Tucumán y frontera forman un capítulo coherente con la Misión 0, Misión 1 y una versión acotada de la Misión 2.

### Nivel E — MVP narrativo del GDD

Ruta Buenos Aires–Arequipa, sistemas principales estabilizados, trama UFES completa, personajes centrales y finales principales.

No se debe construir el Nivel E directamente. Cada nivel anterior debe ser jugable y validado.

---

## 5. Estado real inicial del repositorio

### Tecnología

- [x] Phaser 3.
- [x] TypeScript estricto.
- [x] Vite.
- [x] Arcade Physics.
- [x] Vitest para lógica pura.
- [x] IndexedDB para guardado.
- [x] Eventos tipados.
- [x] Reglas de agentes documentadas en `AGENTS.md`.

### Flujo jugable actual

- [x] Boot.
- [x] Preload.
- [x] Menú.
- [x] Escena exterior de Retiro.
- [x] Movimiento del jugador.
- [x] Animaciones del jugador.
- [x] Colisiones básicas.
- [x] HUD de objetivo.
- [x] Sistema de diálogo.
- [x] Sistema de interacción.
- [x] Capataz interactivo.
- [x] Tutorial con pasos tipados.
- [x] Exterior de la oficina AFF.
- [x] Interior de la oficina AFF.
- [x] Retorno desde la oficina a Retiro.
- [x] Guardado con migración.
- [x] Arquitectura base de NPCs.
- [ ] Interior jugable del tren.
- [ ] Transición completa Retiro → tren.
- [ ] Tripulación principal presentada.
- [ ] Primera salida ferroviaria.
- [ ] Loop diario.
- [ ] Inventario, carga y comercio.
- [ ] Viaje entre estaciones.

### Deuda visible

- [ ] Actualizar `README.md`, que todavía describe principalmente el starter.
- [ ] Mantener las escenas legibles y evitar archivos excesivamente compactados.
- [ ] Confirmar que toda escena limpia listeners, colliders, controles, HUD, tweens y suscripciones en `SHUTDOWN`.
- [ ] Agregar CI cuando el flujo local esté estable.
- [ ] Crear una convención para datos de escena y retornos tipados.
- [ ] Crear una convención para contenido narrativo externo al código.

---

## 6. Hito activo

# HITO 0.1 — Cerrar el prólogo de Retiro

**Resultado esperado:** el jugador completa el trámite AFF, entra al tren, recorre un primer coche, habla con una persona de la tripulación y puede volver a Retiro.

Issue relacionado: `#1 Crear primera escena jugable dentro del Tren al Sur`.

### Checklist

- [~] Implementar `TrainInteriorScene`.
- [~] Registrar la escena.
- [~] Validar los datos de entrada.
- [~] Encadenar diálogo de cierre y transición.
- [~] Bloquear interacción durante el cambio de escena.
- [~] Crear interior placeholder navegable.
- [~] Agregar un NPC de tripulación mediante la arquitectura existente.
- [~] Mostrar objetivo interior.
- [~] Volver a Retiro sin reiniciar el prólogo.
- [~] Agregar pruebas de lógica.
- [~] Ejecutar typecheck, tests y build.
- [~] Probar manualmente el flujo completo.
- [ ] Revisar PR.
- [ ] Fusionar.
- [ ] Actualizar este lienzo con archivos, commit y decisiones.

### Criterio de terminado

No alcanza con que compile. Debe poder jugarse:

`Menú → Retiro → capataz → AFF → permiso → Retiro → puerta del tren → diálogo → interior → tripulación → salida → Retiro`

---

## 7. Mapa general de dependencias

```text
Base técnica
  └── Navegación entre escenas
        ├── Prólogo de Retiro
        ├── Tren como espacio persistente
        └── Estaciones reutilizables
              └── Sistema de jornada
                    ├── Estado del tren
                    ├── Inventario y carga
                    ├── Comercio
                    ├── Misiones
                    └── Relaciones
                          └── Viaje y eventos
                                └── Capítulos regionales
```

No implementar un sistema ubicado abajo del árbol sin antes definir el contrato mínimo de sus dependencias.

---

# 8. Roadmap técnico y jugable

## FASE 0 — Disciplina de proyecto y documentación

### Objetivo

Tener una forma consistente de trabajar, revisar y continuar el desarrollo entre personas y agentes.

### Tareas

- [x] Crear `AGENTS.md`.
- [x] Definir prefijos de commits `add:` y `fix:`.
- [x] Definir validaciones obligatorias.
- [x] Crear este lienzo maestro.
- [ ] Actualizar `README.md` con:
  - visión breve;
  - estado actual;
  - controles;
  - instalación;
  - estructura real;
  - scripts;
  - enlace al lienzo;
  - enlace al GDD o ubicación de la documentación.
- [ ] Crear `docs/DECISIONES.md` cuando el registro de decisiones de este archivo supere diez entradas.
- [ ] Crear plantilla de issue para tareas jugables.
- [ ] Crear plantilla de PR con validaciones y prueba manual.
- [ ] Crear GitHub Actions para:
  - instalar;
  - ejecutar typecheck;
  - ejecutar tests;
  - ejecutar build.
- [ ] Configurar protección de `main` cuando CI exista.
- [ ] Definir política de assets y licencias.

### Criterio de terminado

Una persona nueva puede abrir el repositorio, entender qué es el juego, ejecutar el proyecto y elegir la siguiente tarea sin depender de una explicación oral.

---

## FASE 1 — Prólogo jugable de Retiro

### Objetivo

Convertir la introducción existente en una secuencia completa y agradable.

### 1.1 Interior del tren

- [~] Crear escena interior inicial.
- [~] Crear entrada y salida tipadas.
- [~] Usar placeholders sin assets nuevos.
- [~] Integrar NPC de tripulación.
- [~] Integrar diálogo y objetivo.
- [~] Limpiar recursos al cerrar escena.

### 1.2 Presentación de personajes del prólogo

Después de estabilizar la primera escena interior:

- [ ] Reemplazar el NPC genérico por **Sofía Pereyra** como primera tripulante.
- [ ] Definir su `npcId`.
- [ ] Crear diálogo introductorio breve.
- [ ] Presentar su rol de mecánica sin explicar todavía todos los sistemas.
- [ ] Agregar una interacción opcional posterior.
- [ ] Decidir cuándo presentar a Guillermo Bustos.
- [ ] Decidir si el Embajador aparece físicamente o mediante diálogo/cinemática.

### 1.3 Checklist de preparación del tren

- [ ] Diseñar una misión corta de tres acciones:
  - revisar caldera;
  - verificar carga oficial;
  - confirmar señal de salida.
- [ ] Representar cada acción mediante una interacción simple.
- [ ] Crear una máquina de estados tipada para el checklist.
- [ ] Mostrar progreso en HUD.
- [ ] Impedir salida antes de completar los chequeos.
- [ ] Agregar feedback de Sofía.
- [ ] Probar reinicio de escena y carga de partida.

### 1.4 Cierre del prólogo

- [ ] Crear conversación final antes de partir.
- [ ] Mostrar el propósito del viaje a Arequipa.
- [ ] Introducir la UFES sin una exposición excesiva.
- [ ] Introducir la existencia de la carga importante.
- [ ] Sembrar el telegrama o rumor de sabotaje.
- [ ] Mostrar silbato, humo y transición de salida.
- [ ] Marcar Misión 0 como completada.
- [ ] Guardar el progreso.
- [ ] Desbloquear el siguiente hito.

### Criterio de terminado de la fase

Una persona que no conoce el proyecto entiende:

- quién es;
- dónde está;
- qué es la UFES;
- por qué debe viajar;
- quién es Sofía;
- cómo moverse e interactuar;
- cuál es su objetivo inmediato.

---

## FASE 2 — Tren como hogar persistente

### Objetivo

Que el tren sea una estructura reutilizable y ampliable, no una única escena descartable.

### 2.1 Modelo de composición

- [ ] Definir `TrainCarId`.
- [ ] Definir contrato de vagón.
- [ ] Definir orden de vagones.
- [ ] Definir entradas y salidas entre vagones.
- [ ] Crear registro de vagones disponibles.
- [ ] Decidir si cada vagón es una escena o si varios comparten una escena.
- [?] Prototipar ambas opciones con dos vagones antes de cerrar la decisión.
- [ ] Documentar la decisión.

### 2.2 Vagones mínimos

- [ ] Coche de tripulación.
- [ ] Locomotora/cabina.
- [ ] Vagón-taller de Sofía.
- [ ] Vagón de carga oficial.
- [ ] Vagón de pasajeros básico.
- [ ] Puertas entre vagones.
- [ ] Señalización clara.
- [ ] Colisiones coherentes.

### 2.3 Estado persistente del tren

- [ ] Definir `TrainState`.
- [ ] Separar estado lógico de objetos visuales.
- [ ] Persistir:
  - composición;
  - integridad;
  - combustible;
  - agua;
  - carga;
  - mejoras;
  - posición narrativa.
- [ ] Crear valores iniciales seguros.
- [ ] Diseñar migración de save antes de cambiar su versión.
- [ ] Probar carga de saves anteriores.

### 2.4 Interacciones ambientales

- [ ] Puntos inspeccionables.
- [ ] Descripciones narrativas.
- [ ] Objetos que cambian según la misión.
- [ ] Feedback visual para objetos interactivos.
- [ ] Bloqueo correcto durante diálogos.
- [ ] Sonidos placeholder o definitivos según disponibilidad.

### Criterio de terminado

El jugador puede recorrer al menos dos vagones y el juego conserva cambios lógicos del tren al salir y volver a entrar.

---

## FASE 3 — Navegación, ubicación y estado global

### Objetivo

Mover al jugador entre Retiro, tren, estaciones y tramos de viaje sin perder información.

### 3.1 Ubicaciones tipadas

- [ ] Definir `LocationId`.
- [ ] Definir clases de ubicación:
  - estación exterior;
  - edificio;
  - interior de tren;
  - viaje;
  - evento.
- [ ] Definir datos de entrada discriminados.
- [ ] Definir retorno tipado.
- [ ] Validar datos desconocidos en runtime.
- [ ] Crear fallback seguro.

### 3.2 Coordinación de escenas

- [ ] Evaluar un `SceneFlowService` o coordinador mínimo.
- [ ] Evitar que cada escena conozca detalles internos de todas las demás.
- [ ] Centralizar fades y bloqueos de transición cuando exista repetición real.
- [ ] Probar transiciones rápidas y dobles interacciones.
- [ ] Probar `SHUTDOWN` y reentrada.

### 3.3 Estado de sesión

- [ ] Definir qué vive en el save.
- [ ] Definir qué vive sólo durante la sesión.
- [ ] Definir qué se reconstruye desde datos.
- [ ] Evitar duplicar estado en escena, HUD y servicio.
- [ ] Crear selectores o funciones puras para objetivos activos.

### Criterio de terminado

Agregar una nueva ubicación no requiere copiar lógica insegura de transición y retorno.

---

## FASE 4 — Contenido narrativo basado en datos

### Objetivo

Evitar que todos los diálogos, objetivos y misiones queden escritos directamente dentro de escenas.

### 4.1 Diálogos

- [ ] Definir formato de diálogo.
- [ ] Soportar:
  - hablante;
  - texto;
  - narrador;
  - secuencia;
  - opciones;
  - condiciones;
  - efectos.
- [ ] Mantener español rioplatense visible.
- [ ] Mantener identificadores en inglés.
- [ ] Validar IDs y referencias.
- [ ] Separar contenido y ejecución.
- [ ] Crear pruebas para condiciones y efectos.

### 4.2 Misiones

- [ ] Definir `QuestId`.
- [ ] Definir estados:
  - locked;
  - available;
  - active;
  - completed;
  - failed, sólo cuando el diseño lo requiera.
- [ ] Definir objetivos tipados.
- [ ] Crear funciones puras para progreso.
- [ ] Crear journal mínimo.
- [ ] Registrar Misión 0.
- [ ] Registrar Misión 1 en versión acotada.
- [ ] Guardar progreso.

### 4.3 Eventos narrativos

- [ ] Definir `NarrativeEventId`.
- [ ] Definir condiciones de disparo.
- [ ] Evitar repetir eventos únicos.
- [ ] Permitir eventos por:
  - ubicación;
  - hora;
  - misión;
  - relación;
  - inventario;
  - estado del tren.
- [ ] Registrar resultados.
- [ ] Probar prioridad entre eventos.

### 4.4 Glosario y codex

- [ ] Definir entradas culturales.
- [ ] Desbloquear entradas al descubrir términos.
- [ ] Separar glosario de diálogo.
- [ ] Agregar fuentes internas de revisión cultural.
- [ ] Evitar que el glosario interrumpa el ritmo.

### Criterio de terminado

Se puede agregar una conversación y una misión corta modificando principalmente datos y lógica pura, sin reescribir una escena completa.

---

## FASE 5 — Tiempo, jornada y descanso

### Objetivo

Implementar el ciclo cómodo que estructura cada día.

### 5.1 Modelo temporal

- [ ] Confirmar unidad de tiempo.
- [ ] Definir:
  - día;
  - franja horaria;
  - estación;
  - calendario;
  - eventos especiales.
- [ ] Mantener el tiempo pausado durante diálogos y menús modales cuando corresponda.
- [ ] Evitar depender de tiempo real.

### 5.2 Fases de la jornada

- [ ] Amanecer y parte diario.
- [ ] Preparación.
- [ ] Viaje.
- [ ] Llegada.
- [ ] Tarde libre.
- [ ] Noche y descanso.
- [ ] Resumen del día.
- [ ] Autoguardado seguro.

### 5.3 Clima mínimo

- [ ] Definir estados simples.
- [ ] Asociar clima a región y estación.
- [ ] Mostrar clima en HUD o parte diario.
- [ ] Aplicar sólo un efecto jugable inicialmente.
- [ ] No implementar simulación meteorológica compleja.

### Criterio de terminado

El jugador puede completar una jornada, descansar, avanzar al día siguiente y continuar con estado persistido.

---

## FASE 6 — Estado y mantenimiento del tren

### Objetivo

Agregar gestión relajada que genere decisiones, no castigo constante.

### 6.1 Recursos básicos

- [ ] Combustible.
- [ ] Agua.
- [ ] Integridad.
- [ ] Capacidad de carga.
- [ ] Moral de tripulación, sólo si aporta al primer slice.

### 6.2 Consumo

- [ ] Definir consumo por tramo.
- [ ] Mostrar estimación antes de partir.
- [ ] Alertar sin sorprender injustamente.
- [ ] Evitar estados irrecuperables en el tutorial.
- [ ] Permitir reabastecimiento.

### 6.3 Mantenimiento

- [ ] Inspección.
- [ ] Avería menor.
- [ ] Reparación con Sofía.
- [ ] Repuestos.
- [ ] Coste y beneficio comprensibles.
- [ ] Bonificaciones futuras por origen o amistad.

### 6.4 Mejoras

- [ ] Definir slots o categorías.
- [ ] Crear una mejora demostrativa.
- [ ] Mostrar comparación antes/después.
- [ ] Persistir mejora.
- [ ] Evitar árbol de upgrades grande antes del vertical slice.

### Criterio de terminado

El tren consume recursos durante un trayecto y el jugador puede prepararlo, detectar un problema y resolver una avería simple.

---

## FASE 7 — Inventario, carga y comercio

### Objetivo

Crear el primer loop económico de comprar, transportar, entregar y vender.

### 7.1 Inventario

- [ ] Definir `ItemId`.
- [ ] Definir categorías.
- [ ] Definir stack.
- [ ] Definir peso o volumen.
- [ ] Definir cantidad.
- [ ] Definir items de misión no vendibles.
- [ ] Persistir inventario.
- [ ] Probar inventario vacío, lleno y datos desconocidos.

### 7.2 Carga ferroviaria

- [ ] Definir capacidad por vagón.
- [ ] Diferenciar carga oficial y comercial.
- [ ] Bloquear descarte accidental de carga crítica.
- [ ] Mostrar espacio usado.
- [ ] Crear reorganización simple.
- [ ] Dejar animales y cargas frágiles para una fase posterior.

### 7.3 Mercado

- [ ] Definir precios base por estación.
- [ ] Crear compra.
- [ ] Crear venta.
- [ ] Mostrar margen de forma comprensible.
- [ ] Agregar pistas de demanda.
- [ ] Evitar mercado dinámico complejo inicialmente.
- [ ] Persistir dinero y cambios necesarios.

### 7.4 Primera entrega

- [ ] Correspondencia Buenos Aires → Córdoba o Córdoba → Tucumán.
- [ ] Aceptar encargo.
- [ ] Cargar item de misión.
- [ ] Viajar.
- [ ] Entregar.
- [ ] Recibir dinero, reputación y diálogo.
- [ ] Actualizar journal.

### Criterio de terminado

El jugador puede aceptar una carga, transportarla y entregarla en otra estación con recompensa y persistencia.

---

## FASE 8 — Viaje ferroviario y primer tramo

### Objetivo

Representar el viaje sin intentar construir todavía una simulación ferroviaria completa.

### 8.1 Forma de viaje

- [?] Decidir entre:
  - conducción lateral;
  - cabina simplificada;
  - mapa con eventos;
  - combinación.
- [ ] Crear prototipo de baja fidelidad.
- [ ] Evaluar diversión, claridad y coste técnico.
- [ ] Documentar decisión.
- [ ] Eliminar prototipos descartados.

### 8.2 Tramo Buenos Aires → Córdoba

- [ ] Selección de destino.
- [ ] Resumen de distancia y recursos.
- [ ] Confirmación de salida.
- [ ] Consumo de recursos.
- [ ] Progreso visual del viaje.
- [ ] Evento menor.
- [ ] Llegada.
- [ ] Guardado.
- [ ] Retorno al tren y estación.

### 8.3 Eventos de ruta

- [ ] Crear motor mínimo de eventos.
- [ ] Un evento ambiental.
- [ ] Un evento técnico.
- [ ] Un evento narrativo.
- [ ] Opciones y consecuencias.
- [ ] Protección contra repetición inmediata.
- [ ] Pruebas deterministas con semilla o RNG inyectable.

### Criterio de terminado

El jugador sale de Buenos Aires y llega a Córdoba mediante un trayecto con consumo, al menos una decisión y una consecuencia visible.

---

## FASE 9 — Primera vertical slice completa

### Objetivo

Demostrar en treinta a cuarenta y cinco minutos la identidad completa del juego.

### Flujo objetivo

1. Comenzar o cargar.
2. Preparar el tren en Retiro.
3. Hablar con Sofía.
4. Revisar recursos.
5. Aceptar una entrega.
6. Partir.
7. Resolver un evento de viaje.
8. Llegar a Córdoba.
9. Explorar una estación pequeña.
10. Entregar carga.
11. Comerciar.
12. Tener una escena personal.
13. Descansar.
14. Guardar.
15. Ver el objetivo del día siguiente.

### Tareas

- [ ] Integrar todos los sistemas previos.
- [ ] Crear una estación de Córdoba de alcance controlado.
- [ ] Crear jefe de estación.
- [ ] Crear comerciante.
- [ ] Crear una misión secundaria.
- [ ] Crear un diálogo cultural revisable.
- [ ] Crear una recompensa.
- [ ] Crear resumen de jornada.
- [ ] Balancear tiempos.
- [ ] Quitar bloqueos y bugs de secuencia.
- [ ] Probar partida nueva.
- [ ] Probar carga.
- [ ] Probar teclado y gamepad si ya está soportado.
- [ ] Validar rendimiento en una PC modesta.

### Criterio de terminado

Una persona externa puede jugar sin asistencia, comprender la propuesta y describir por qué Tren al Sur no es solamente “un juego de caminar por estaciones”.

---

## FASE 10 — Relaciones y personajes

### Objetivo

Convertir a la tripulación en el centro emocional del juego.

### 10.1 Relación base

- [ ] Definir `RelationshipState`.
- [ ] Definir rango.
- [ ] Ganar relación por:
  - conversación;
  - misión;
  - elección;
  - regalo, más adelante.
- [ ] Evitar farmeo infinito de la misma conversación.
- [ ] Persistir relación.
- [ ] Mostrar feedback sutil.

### 10.2 Sofía Pereyra

- [ ] Presentación.
- [ ] Conversación cotidiana.
- [ ] Primera misión personal.
- [ ] Escena de reparación.
- [ ] Beneficio mecánico pequeño.
- [ ] Primer evento de relación.

### 10.3 Guillermo Bustos

- [ ] Presentación.
- [ ] Conflicto inicial.
- [ ] Misión de seguridad.
- [ ] Consecuencia en un evento de ruta.
- [ ] Evolución de trato formal a confianza.

### 10.4 Martín Santacruz

- [ ] Presentación.
- [ ] Función de contexto y glosario.
- [ ] Investigación pequeña.
- [ ] Impacto reputacional.
- [ ] Decisión sobre revelar información.

### 10.5 Elena Quispe y Renato Córdoba

- [ ] Mantener fuera del primer vertical slice salvo cameo justificado.
- [ ] Diseñar su entrada en los capítulos correspondientes.
- [ ] Revisar representación cultural antes de producción final.

### Criterio de terminado

Al menos dos personajes recuerdan acciones del jugador, cambian sus diálogos y aportan una consecuencia jugable.

---

## FASE 11 — Capítulo argentino

### Objetivo

Completar una versión coherente de las primeras misiones del GDD.

### Misión 0 — Partida de Buenos Aires

- [ ] Prólogo completo.
- [ ] Preparativos.
- [ ] Ceremonia o escena de salida.
- [ ] Carga oficial.
- [ ] Advertencia de sabotaje.

### Misión 1 — Tras los Pasos del Gaucho

- [ ] Primer trayecto.
- [ ] Polizón.
- [ ] Elección.
- [ ] Consecuencia con Sofía y Bustos.
- [ ] Abastecimiento en Córdoba.
- [ ] Correspondencia a Tucumán.

### Misión 2 — Sendero al Norte, versión acotada

- [ ] Puente dañado.
- [ ] Dos opciones viables inicialmente.
- [ ] Coste en tiempo o recursos.
- [ ] Resolución.
- [ ] Consecuencia registrada.

### Mundo

- [ ] Retiro/Buenos Aires.
- [ ] Córdoba.
- [ ] Tucumán.
- [ ] Un tramo de Pampa.
- [ ] Un tramo de transición al NOA.
- [ ] NPCs regionales.
- [ ] Bienes y precios propios.
- [ ] Música y ambiente diferenciados.

### Criterio de terminado

El capítulo tiene inicio, conflicto, decisiones, progreso de sistemas y cierre que invita a continuar hacia la frontera.

---

## FASE 12 — Regiones internacionales

Esta fase pertenece al MVP narrativo amplio y debe abordarse después del capítulo argentino estable.

### Paraguay

- [ ] Definir integración exacta de la ruta con el trazado principal.
- [ ] Asunción o estación representativa.
- [ ] Cultura guaraní revisada.
- [ ] Tereré, sopa paraguaya y comercio regional.
- [ ] Martín como vínculo narrativo.

### Chile

- [ ] Desierto de Atacama.
- [ ] Gestión de agua.
- [ ] Camanchaca o evento climático.
- [ ] Cobre/nitrato.
- [ ] Misión de la flor del desierto.

### Bolivia

- [ ] Altiplano.
- [ ] Uyuni.
- [ ] Oruro.
- [ ] La Paz/El Alto.
- [ ] Altura y mate de coca.
- [ ] Elena Quispe.
- [ ] Carnaval e intriga.
- [ ] Sabotaje principal.

### Perú

- [ ] Entrada final.
- [ ] Arequipa.
- [ ] Exposición UFES.
- [ ] Resolución de la carga.
- [ ] Consecuencias acumuladas.
- [ ] Finales.
- [ ] Epílogos.

### Criterio de terminado

Cada región se siente distinta en cultura, paisaje, economía, eventos y personajes, sin convertirse en una colección superficial de estereotipos.

---

## FASE 13 — UI, audio, arte y presentación

### Objetivo

Reemplazar placeholders cuando el diseño ya esté probado.

### UI

- [ ] Sistema visual coherente.
- [ ] HUD legible.
- [ ] Journal.
- [ ] Inventario.
- [ ] Mercado.
- [ ] Estado del tren.
- [ ] Relaciones.
- [ ] Ajustes.
- [ ] Escalado responsive.
- [ ] Navegación por teclado y gamepad.

### Arte

- [ ] Guía visual.
- [ ] Paleta.
- [ ] Escala de sprites.
- [ ] Tiles.
- [ ] Personajes.
- [ ] Retratos.
- [ ] Tren.
- [ ] Estaciones.
- [ ] Props.
- [ ] Efectos.
- [ ] Fondos y transiciones.
- [ ] Inventario de licencias.

### Audio

- [ ] Identidad musical.
- [ ] Ambientes.
- [ ] Locomotora.
- [ ] Pasos.
- [ ] UI.
- [ ] Voces no habladas o sonidos de diálogo.
- [ ] Mezcla.
- [ ] Volúmenes separados.
- [ ] Música regional con revisión cultural.
- [ ] Sin usar material sin licencia.

### Cinemáticas

- [ ] Definir lenguaje visual económico.
- [ ] Intro corta.
- [ ] Salida de Retiro.
- [ ] Eventos de capítulo.
- [ ] Llegada a Arequipa.
- [ ] Epílogos.

### Criterio de terminado

La presentación acompaña a sistemas ya divertidos y no oculta problemas de diseño debajo de assets costosos.

---

## FASE 14 — Accesibilidad y opciones

### Objetivo

Que el juego pueda ser disfrutado por la mayor cantidad de personas posible.

- [ ] Remapeo de controles.
- [ ] Tamaño de texto.
- [ ] Velocidad de texto.
- [ ] Alto contraste de interacción.
- [ ] Reducción de movimiento.
- [ ] Control de flashes.
- [ ] Volúmenes separados.
- [ ] Subtítulos para todo contenido hablado.
- [ ] Pausa segura.
- [ ] Confirmaciones para acciones destructivas.
- [ ] No depender sólo del color.
- [ ] Navegación completa sin mouse cuando corresponda.
- [ ] Modo de asistencia para eventos de precisión.
- [ ] Revisar fuentes y legibilidad en español.

### Criterio de terminado

Las opciones no son un parche final: los sistemas principales respetan pausa, foco, escalado y distintos métodos de entrada.

---

## FASE 15 — Calidad, rendimiento y publicación

### Calidad

- [ ] Matriz de pruebas por sistema.
- [ ] Smoke test de partida nueva.
- [ ] Smoke test de carga.
- [ ] Migraciones de save.
- [ ] Pruebas de misiones.
- [ ] Pruebas de economía.
- [ ] Pruebas de relaciones.
- [ ] Pruebas de transiciones.
- [ ] Pruebas de inputs.
- [ ] Pruebas de resolución.
- [ ] Pruebas de larga duración.

### Rendimiento

- [ ] Medir FPS.
- [ ] Medir memoria.
- [ ] Revisar fugas por listeners.
- [ ] Revisar objetos destruidos.
- [ ] Revisar assets duplicados.
- [ ] Limitar efectos.
- [ ] Ajustes de calidad.

### Publicación

- [ ] Página del juego.
- [ ] Build estable.
- [ ] Política de privacidad si aplica.
- [ ] Licencias.
- [ ] Créditos.
- [ ] Disclaimer histórico-cultural.
- [ ] Reporte de bugs.
- [ ] Versionado.
- [ ] Changelog.
- [ ] Estrategia de demos.

### Criterio de terminado

La build puede distribuirse, actualizarse y recuperar partidas sin depender del entorno del desarrollador.

---

# 9. Sistemas que quedan explícitamente fuera por ahora

Hasta terminar la primera vertical slice, no priorizar:

- multijugador;
- backend online;
- cuentas de usuario;
- microservicios;
- tienda real;
- combate complejo;
- árbol de habilidades grande;
- romance completo;
- familia;
- mods;
- Steam Workshop;
- editor de mapas;
- generación procedural de regiones;
- economía global simulada;
- conducción ferroviaria hardcore;
- clima complejo;
- animales con ciclo completo;
- todos los países a la vez;
- localización a múltiples idiomas;
- aplicación móvil nativa.

Pueden quedar documentados, pero no deben bloquear la experiencia principal.

---

# 10. Contratos que conviene construir antes que contenido masivo

- [ ] `LocationId`.
- [ ] Datos discriminados de entrada de escena.
- [ ] Datos discriminados de retorno.
- [ ] `TrainState`.
- [ ] `TrainCarId`.
- [ ] `QuestId`.
- [ ] `QuestState`.
- [ ] `Objective`.
- [ ] `DialogueNode`.
- [ ] `NarrativeEvent`.
- [ ] `ItemId`.
- [ ] `InventoryState`.
- [ ] `MarketState`.
- [ ] `RelationshipState`.
- [ ] `TimeState`.
- [ ] `RegionId`.
- [ ] `StationId`.

No es necesario crearlos todos ahora. Se crea cada contrato cuando una tarea real lo necesita.

---

# 11. Definición de terminado para cada tarea

Una tarea sólo puede marcarse `[x]` cuando cumple:

### Código

- La responsabilidad está clara.
- No usa `any` para silenciar problemas.
- No usa `@ts-ignore` sin aprobación.
- No agrega dependencias sin necesidad.
- No modifica archivos ajenos.
- Limpia recursos de Phaser.
- Mantiene textos visibles en español rioplatense.

### Validación automática

- `npm run typecheck`
- `npm test -- --run`
- `npm run build`

Cuando un comando no aplica o no puede ejecutarse, debe documentarse.

### Validación manual

- Se recorrió el flujo afectado.
- Se probó una ruta normal.
- Se probó al menos un borde razonable.
- No aparecen dobles interacciones.
- No se repite contenido único.
- No se rompe volver atrás.
- No se pierde estado.

### Entrega

- Resumen.
- Archivos modificados.
- Decisiones.
- Validaciones reales.
- Riesgos.
- Commit sugerido.
- Actualización de este lienzo.

---

# 12. Tarjeta de trabajo para cada sesión

Copiar esta plantilla en un issue o en el chat.

```md
## Unidad de trabajo

### Objetivo
Una oración que describa el resultado jugable o técnico.

### Estado inicial confirmado
Qué existe hoy y qué falta.

### Alcance
- Cambio 1
- Cambio 2
- Cambio 3

### Fuera de alcance
- Sistema relacionado que no se implementará todavía.

### Archivos previstos
- `ruta`: motivo.

### Criterios de aceptación
- [ ] Criterio observable 1.
- [ ] Criterio observable 2.
- [ ] Criterio observable 3.

### Pruebas
- [ ] Typecheck.
- [ ] Tests.
- [ ] Build.
- [ ] Flujo manual.

### Entrega
- [ ] Código.
- [ ] Resumen.
- [ ] Lienzo actualizado.
```

---

# 13. Protocolo para programar desde ChatGPT

Cuando Enzo diga “sigamos con el juego”, “codeemos” o “continuemos el lienzo”:

1. Revisar este archivo.
2. Revisar issues y PRs abiertos.
3. Revisar el estado actual de `main`.
4. No asumir que el último cambio fue fusionado.
5. Identificar el primer checkbox pendiente que no esté bloqueado.
6. Proponer una unidad de trabajo acotada.
7. Explicar archivos y riesgos.
8. Implementar sólo con aprobación cuando sea un cambio grande.
9. Para cambios locales claros, aplicar el cambio.
10. Revisar diff.
11. Ejecutar validaciones reales.
12. Actualizar el lienzo y el issue.
13. Sugerir commit.
14. No marcar tareas por inferencia.

### Regla de tamaño

Una unidad de trabajo ideal:

- modifica entre uno y seis archivos;
- puede validarse en una sesión;
- produce un cambio observable;
- no mezcla dos sistemas grandes;
- deja el proyecto funcionando.

Cuando una tarea excede ese tamaño, dividirla.

---

# 14. Cola sugerida de próximas unidades

Esta cola puede cambiar según resultados reales.

1. [~] Issue #1: primera escena interior del tren.
2. [ ] Revisar y fusionar el PR de Issue #1.
3. [ ] Actualizar README con el estado real.
4. [ ] Reemplazar NPC placeholder por Sofía en el interior.
5. [ ] Crear checklist de preparación del tren.
6. [ ] Crear dos puntos inspeccionables.
7. [ ] Crear cierre del prólogo.
8. [ ] Diseñar contrato mínimo de ubicación.
9. [ ] Crear prototipo de segundo vagón.
10. [ ] Decidir arquitectura de vagones.
11. [ ] Crear `TrainState` mínimo.
12. [ ] Crear prototipo de parte diario.
13. [ ] Prototipar el primer viaje Buenos Aires → Córdoba.
14. [ ] Evaluar la forma de viaje.
15. [ ] Implementar una entrega simple.

---

# 15. Decisiones registradas

| Fecha | Decisión | Motivo | Impacto |
|---|---|---|---|
| 2026-08-06 | Usar Phaser 3, TypeScript y Vite | Stack actual del proyecto | Mantener todas las tareas compatibles |
| 2026-08-06 | Arcade Physics para movimiento y colisiones simples | Consistencia y alcance | No introducir otro motor físico |
| 2026-08-06 | Desarrollo incremental, una responsabilidad por cambio | Reducir regresiones y deuda | Dividir tareas grandes |
| 2026-08-06 | El GDD es visión; este lienzo es ejecución | Evitar confundir ideas con trabajo listo | Actualizar ambos cuando cambie diseño |
| 2026-08-06 | Construir primero un vertical slice Buenos Aires–Córdoba | Validar el loop antes de producir todo el continente | Las regiones internacionales quedan después |
| 2026-08-06 | Placeholders antes que assets finales | Probar diseño sin encarecer iteraciones | Arte final entra después de validar sistemas |
| 2026-08-06 | El tren debe convertirse en hogar persistente | Es central a la fantasía del juego | Diseñar navegación y estado reutilizables |

---

# 16. Decisiones abiertas

- [!] ¿Cómo se representa el viaje principal: conducción, mapa con eventos o híbrido?
- [!] ¿Cada vagón será una escena o varios vagones convivirán en una escena?
- [!] ¿Cuál será la primera estación completa después de Retiro?
- [!] ¿La primera vertical slice llegará hasta Córdoba o incluirá Tucumán?
- [!] ¿Qué nombre definitivo tendrá la moneda UFES: Ferro, Peso UFES u otro?
- [!] ¿Cuál es la carga oficial definitiva: Motor Aurora, planos u otra pieza?
- [!] ¿Qué alcance tendrá la personalización del protagonista en la primera versión?
- [!] ¿Los orígenes del protagonista entran en la vertical slice o después?
- [!] ¿El tiempo avanza libremente en estaciones o por acciones/franjas?
- [!] ¿Qué personajes son romanceables y en qué etapa se decide?
- [!] ¿Qué rutas exactas justifican el paso por Paraguay y Chile dentro de la campaña?

Las decisiones abiertas no deben resolverse todas juntas. Se resuelven cuando una tarea concreta depende de ellas.

---

# 17. Riesgos del proyecto

| Riesgo | Señal temprana | Respuesta |
|---|---|---|
| Alcance continental demasiado grande | Se crean regiones antes de cerrar el loop | Volver al vertical slice |
| Escenas monolíticas | Una escena contiene nivel, UI, misión, diálogo y save | Extraer sólo responsabilidades reales |
| Sistemas prematuros | Se diseñan contratos sin una tarea jugable | Crear el mínimo requerido |
| Arte antes de diseño | Mucho asset y poco loop | Volver a placeholders |
| Narrativa hardcodeada | Cada diálogo requiere editar escenas | Separar datos cuando haya repetición |
| Pérdida de estado | Volver a una escena reinicia progreso | Contratos de entrada y save explícitos |
| Dependencia de agentes | Nadie entiende lo implementado | Commits pequeños, documentación y pruebas |
| Cultura superficial | Elementos regionales decorativos o incorrectos | Revisión, fuentes y personajes con agencia |
| Save incompatible | Cambios de contrato rompen partidas | Versionado y migraciones |
| Falsa sensación de avance | Muchas tareas abiertas, nada jugable | Priorizar flujo de punta a punta |

---

# 18. Registro de avances

Agregar una fila por unidad terminada.

| Fecha | Unidad | Resultado | Commit/PR | Validaciones |
|---|---|---|---|---|
| 2026-08-06 | Crear lienzo maestro | Roadmap operativo inicial | Pendiente de PR documental | Revisión documental |
| 2026-08-06 | Interior del tren | En desarrollo mediante Issue #1 | Pendiente | Pendiente |

---

# 19. Preguntas para evaluar cada hito jugable

Después de cada hito, responder:

1. ¿Qué pudo hacer el jugador que antes no podía?
2. ¿Entendió qué debía hacer sin ayuda externa?
3. ¿La acción se siente propia de Tren al Sur?
4. ¿Hubo una decisión real o sólo una secuencia?
5. ¿El estado sobrevivió a cambios de escena?
6. ¿El sistema puede reutilizarse?
7. ¿Qué parte fue aburrida o confusa?
8. ¿Qué quedó hardcodeado y por qué?
9. ¿Qué no deberíamos construir todavía?
10. ¿Cuál es el siguiente cambio más pequeño con mayor impacto?

---

# 20. Regla final

El objetivo no es completar casillas por cantidad.

El objetivo es que cada casilla terminada convierta a **Tren al Sur** en un juego un poco más claro, más jugable, más emotivo y más fácil de continuar.
