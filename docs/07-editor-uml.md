# 07 — Editor web de diagramas UML

## Requisito
La página tiene un editor visual "por bloques" para construir los diagramas de la
materia, que mantiene la consistencia entre todos ellos y exporta a PDF. Doble uso:
**estudiar para el final de DSI** y ser la cara del proyecto final.

## Decisión de diseño clave
El editor **no edita dibujos: edita el modelo canónico** (doc 02). Cada diagrama es una
vista del mismo modelo, igual que las salidas del agente.

- Renombrar `fecha` → `fechaVuelo` en la clase `Vuelo` cambia el atributo, el
  `getFecha()` asociado si se acepta el refactor, y los mensajes de secuencia que lo usan.
- En el diagrama de secuencia, al trazar un mensaje hacia `:Vuelo`, el editor ofrece los
  métodos que **ya existen** en `Vuelo`, o "crear método nuevo", que lo agrega a la clase.
- En el DTE, la acción `/cancelar()` se elige de los métodos de la clase.
- El validador corre en vivo y marca las violaciones con su ID de regla (RC-01, DT-03…).

Así, el editor, el agente y el modo tutor comparten una sola fuente de verdad y un solo
validador.

## Alcance: los diagramas de la materia, no todo UML 2.0
UML 2.0 tiene 14 tipos de diagrama; hacer un editor completo es otro proyecto entero.
Alcance propuesto, en orden de prioridad:

1. Diagrama de clases (análisis y diseño: estereotipos, atributos, métodos,
   navegabilidad, multiplicidad, interfaces).
2. Diagrama de secuencia (líneas de vida, mensajes, `*` iterativo, fragmentos `loop`/`alt`/`opt`, creación).
3. DTE (estados simples y compuestos, transiciones `evento [guarda] /accion()`).
4. Diagrama de comunicación (derivable de la secuencia: mismos mensajes, otra vista).
5. DER.
6. Plantilla de caso de uso (formulario, no diagrama) y diagrama de CU.

## Técnica (propuesta, ver ADR-0005)
- Clases, DTE, DER, comunicación: son grafos (nodos + aristas) → librería de grafos en el
  navegador (p. ej. React Flow / xyflow, o JointJS) con nodos personalizados.
- Secuencia: **no** es un grafo libre (líneas de vida + mensajes ordenados). Mejor un
  editor estructurado (agregar mensaje: desde, hacia, método) con render SVG propio
  desde el modelo.
- Exportación: SVG por vista → PDF (en el navegador, o en el servidor imprimiendo con un
  navegador headless). También exportar PlantUML y el JSON del modelo.
- Layout automático para lo que genera el agente (p. ej. ELK / dagre); posiciones
  manuales guardadas aparte del modelo (son presentación, no semántica).

## Modos de uso
- **Estudio** (para el final): el alumno modela, el validador marca errores y el tutor
  da pistas sin resolver todo.
- **Generar**: el agente produce el modelo y el alumno lo edita en el mismo editor.
- **Revisar**: se carga un modelo y se reporta contra las reglas y la solución oficial si
  existe.
