# Instrucciones para agentes — Tren al Sur

Este archivo define las reglas obligatorias para cualquier agente que analice, modifique o revise este repositorio.

## 1. Contexto del proyecto

- Juego 2D top-down desarrollado con Phaser 3, TypeScript y Vite.
- Física principal: Phaser Arcade Physics.
- TypeScript debe mantenerse en modo estricto.
- El código fuente usa identificadores en inglés.
- Los textos visibles para el jugador, la documentación y los commits se escriben en español rioplatense claro.
- El proyecto se construye de manera incremental: una mecánica o responsabilidad por cambio.

## 2. Protocolo obligatorio antes de modificar código

1. Leer los archivos relacionados y seguir el flujo existente antes de proponer cambios.
2. Explicar brevemente el problema, la causa y el alcance esperado.
3. Identificar qué archivos se modificarán y por qué.
4. Elegir la solución más pequeña que preserve el comportamiento actual.
5. Evitar crear abstracciones, sistemas o dependencias que todavía no sean necesarios.
6. No modificar archivos ajenos a la tarea sólo para “mejorarlos”.
7. No hacer commit ni push salvo pedido explícito del usuario.

Para cambios grandes, primero presentar un plan y esperar aprobación. Para correcciones locales, se puede implementar directamente si el alcance está claro.

## 3. Arquitectura y responsabilidades

### Escenas

- Una escena coordina el flujo; no debe concentrar indefinidamente toda la lógica del juego.
- Separar responsabilidades cuando una escena empiece a mezclar construcción de nivel, movimiento, UI, diálogo, misiones, guardado y carga.
- No dividir por dividir: extraer una clase o módulo cuando tenga una responsabilidad clara, reutilización real o pruebas independientes.
- Las escenas deben registrar su limpieza mediante `Phaser.Scenes.Events.SHUTDOWN` cuando agreguen listeners, timers o suscripciones externas.

### Entidades

- El jugador y los NPC con comportamiento propio deben evolucionar hacia Game Objects tipados y reutilizables, por ejemplo clases que extiendan `Phaser.Physics.Arcade.Sprite`.
- La escena puede crear y conectar entidades, pero no debería contener toda su lógica de movimiento, animación o estado interno.
- Si se sobrescribe `preUpdate`, llamar siempre a `super.preUpdate(time, delta)`.

### UI

- La UI simple puede vivir temporalmente en la escena de juego.
- Cuando el HUD crezca o necesite mantenerse independiente de la cámara, moverlo a una escena paralela de UI.
- Usar `Container` sólo cuando varios elementos necesiten transformarse juntos. Evitar anidamientos innecesarios.

### Estado y reglas de juego

- No guardar estado importante únicamente en objetos visuales.
- Definir tipos explícitos para estados, pasos de tutorial, identificadores e interacciones.
- Cuando un flujo tenga varias transiciones, usar una máquina de estados simple o una clase específica en lugar de múltiples booleanos dispersos.
- Los servicios de guardado, audio o datos no deben depender de una escena concreta.

### Assets

- Cargar assets desde escenas de precarga o manifiestos dedicados.
- Usar claves semánticas y constantes; evitar strings repetidos por todo el código.
- Mantener rutas organizadas por dominio, por ejemplo `public/assets/characters`, `public/assets/stations`, `public/assets/ui` y `public/assets/audio`.
- No depender de imágenes remotas para el funcionamiento normal del juego.
- Separar el aspecto visual del área de interacción y del cuerpo físico.

## 4. Phaser y rendimiento

- Usar Arcade Physics para movimiento y colisiones simples.
- Ajustar hitboxes y offsets para que representen los pies o el volumen lógico, no necesariamente todo el sprite.
- No mezclar movimiento manual por posición con velocidad de Arcade Physics para la misma entidad sin una razón documentada.
- Evitar crear y destruir objetos repetidamente dentro de `update`; usar Groups o pooling cuando exista una frecuencia real de creación alta.
- Usar Static Groups para geometría inmóvil.
- Usar `delta` en cálculos manuales dependientes del tiempo.
- Evitar cálculos, búsquedas o asignaciones innecesarias en cada frame.
- No optimizar prematuramente: medir antes de introducir complejidad.

## 5. TypeScript y calidad de código

- Mantener `strict: true`.
- No usar `any` para silenciar errores.
- No usar `@ts-ignore` salvo caso excepcional, documentado y aprobado.
- Tratar correctamente valores `null` o `undefined` mediante validaciones, optional chaining o diseño de tipos.
- Preferir nombres semánticos: `player`, `foreman`, `trainDoor`, no `box1` u `objectA`.
- Evitar números mágicos: extraer constantes de velocidad, dimensiones, profundidades, radios y coordenadas relevantes.
- Métodos cortos y con una sola responsabilidad.
- Comentarios sólo para explicar intención, decisiones o limitaciones; no narrar código evidente.
- No duplicar lógica. Extraerla cuando la repetición sea real, no anticipada.

## 6. Controles y experiencia de usuario

- No asignar una misma tecla a movimiento y a una acción global.
- Mantener los controles en un único lugar o mapa de acciones.
- Bloquear acciones cuando la UI modal o el diálogo lo requieran.
- Toda acción interactiva debe ofrecer feedback visual o textual.
- Los mensajes de error para el jugador deben ser claros y no exponer detalles internos.

## 7. Manejo y comunicación de errores

Nunca ocultar un error para lograr que el build “pase”. Ante un error:

1. Reproducirlo.
2. Registrar el comando o acción que lo provoca.
3. Copiar el mensaje relevante sin inventarlo.
4. Explicar la causa raíz o indicar claramente si todavía es una hipótesis.
5. Implementar la corrección mínima.
6. Volver a ejecutar la validación que falló.
7. Informar si quedó algún riesgo o caso sin comprobar.

El informe final del agente debe incluir, cuando corresponda:

- **Problema:** qué fallaba.
- **Causa:** por qué fallaba.
- **Solución:** qué se cambió.
- **Validación:** comandos y pruebas ejecutadas.
- **Pendiente:** limitaciones o verificaciones manuales restantes.

No afirmar “sin errores” si no se ejecutaron las validaciones correspondientes.

## 8. Validación obligatoria

Antes de dar una tarea por terminada:

1. Ejecutar `npm run typecheck`.
2. Ejecutar `npm run build`.
3. Ejecutar las pruebas relacionadas cuando existan.
4. Para cambios visuales o jugables, realizar una prueba manual en el navegador del flujo afectado.
5. Revisar `git diff` y confirmar que no haya cambios accidentales.
6. Informar exactamente qué validaciones se ejecutaron y su resultado.

Si un comando falla, no continuar como si hubiera pasado. Corregirlo o informar el bloqueo.

## 9. Git y commits

### Prefijos permitidos

Usar únicamente:

- `add:` para nuevas funcionalidades, assets, documentación, pruebas, mejoras estructurales o refactorizaciones planificadas.
- `fix:` para corregir errores, regresiones, fallas de configuración o comportamiento incorrecto.

### Formato

```text
add: agregar movimiento animado del jugador
fix: evitar listeners duplicados al reiniciar la escena
```

Reglas:

- Mensaje en español.
- Descripción concreta, en infinitivo y en minúscula.
- Sin punto final.
- Un commit debe representar una unidad lógica verificable.
- No usar mensajes vagos como `add: cambios`, `fix: arreglos` o `add: update`.
- No usar `feat:`, `chore:`, `refactor:` ni otros prefijos en este proyecto.
- Antes de commitear, mostrar `git status`, revisar `git diff` y ejecutar validaciones.
- No incluir archivos generados, secretos, `.env`, `node_modules` ni cambios ajenos.
- No hacer `push` salvo autorización explícita.

## 10. Formato de entrega del agente

Al finalizar una tarea, responder en este orden:

1. Resumen breve del resultado.
2. Archivos modificados y responsabilidad de cada uno.
3. Decisiones técnicas importantes.
4. Validaciones ejecutadas con resultado real.
5. Errores encontrados y cómo se resolvieron.
6. Pendientes o pruebas manuales recomendadas.
7. Mensaje de commit sugerido usando `add:` o `fix:`.

El agente debe priorizar código comprensible, mantenible y verificable por encima de producir muchos archivos o aparentar avance rápido.
