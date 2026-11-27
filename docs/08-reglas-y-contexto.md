# 08 — Cómo se implementan las reglas y cómo el agente carga el contexto

## Idea base: el modelo no "recuerda", el sistema reconstruye el contexto
La API de Claude no guarda estado entre llamadas. Lo que persiste entre sesiones vive
en **nuestra base de datos**: el modelo canónico del ejercicio, el corpus y la memoria de
correcciones. En cada llamada se arma el contexto con eso.

## Tres tipos de conocimiento, tres implementaciones

| Conocimiento | Ejemplo | Dónde vive | Cómo llega al modelo |
|---|---|---|---|
| **Reglas de consistencia** | RC-01: todo mensaje es método de la clase receptora | **Código** (`validador/reglas/`) | No se explican en el prompt. Se ejecutan después y al modelo le llegan sólo las violaciones |
| **Convenciones de la cátedra** | `tomarSeleccion…`, `finCU()`, historial con `CambioEstado…` | Archivos versionados (`conocimiento/convenciones/*.md`) | Bloque fijo del system prompt, **cacheado** |
| **Ejemplos y correcciones** | Realización de CU2 de Líneas Aéreas | Corpus + base de datos | Recuperados por RAG en cada pedido, **después** del bloque cacheado |

### Reglas como código
Cada regla es una función pura con ID, severidad y test propio:

```text
regla RC-01 (bloqueante):
  para cada realización R, para cada mensaje M en R:
    clase = R.lineaDeVida(M.hacia).clase
    si M.metodo no está en metodos(clase) ∪ heredados(clase) ∪ interfaces(clase):
      violación("RC-01", ubicacion=M, detalle=f"{clase} no tiene {M.metodo}()",
                sugerencias=["agregar el método a la clase", "cambiar el destinatario"])
```

- Un registro central lista todas las reglas. **El catálogo resumido** (ID + una línea)
  **se genera desde ese registro**, para el prompt y para la documentación, así nunca se
  desincroniza.
- Cada regla tiene tests con casos reales del corpus, por ejemplo los hallazgos H1–H6
  de Líneas Aéreas.
- El mismo validador lo usan el agente, el editor (en vivo) y la evaluación.

### Convenciones como archivos
```
conocimiento/
  convenciones/
    01-realizacion-cu.md      # boundary/control/entity, nombres de mensajes
    02-historial-estados.md
    03-dte.md
    04-patrones.md
  esquema/modelo-canonico.schema.json
  catalogo-reglas.md          # generado desde el código
```
Cada archivo tiene su fuente (qué EPC) y versión. Cambiar una convención es un commit.

## Armado del contexto en cada llamada (orden pensado para el caché)

```
[tools]   leer_modelo, actualizar_modelo, buscar_corpus, validar   ← fijo
[system]  rol "Profesor DSI" + convenciones + esquema + catálogo   ← fijo
          ── cache breakpoint ──────────────────────────────────────
[messages]
  · modelo canónico actual (o la parte relevante: clases + CU pedido)
  · ejemplos recuperados por RAG y correcciones de memoria
  · pedido del usuario
```
Todo lo que está antes del breakpoint es idéntico en cada llamada (sin fechas, IDs ni
orden variable), así se lee del caché. Lo variable va después.

## Hooks: qué se usa y dónde

Los hooks `PreToolUse` / `PostToolUse` son de **Claude Code y el Claude Agent SDK**. Este
proyecto usa la **Messages API con un loop propio** (ADR-0003), así que no existen como
tales, pero se implementa **la misma idea**: código nuestro que corre antes y después de
cada herramienta. Como el loop es nuestro, el control es total.

### Pre-herramienta (antes de aplicar `actualizar_modelo`)
- El parche valida contra el JSON Schema (además, herramientas con `strict: true`).
- Referencias válidas: no se puede agregar un mensaje a una línea de vida inexistente.
- Protección: no borrar elementos `validado` sin confirmación del usuario.
- Presupuesto: máximo de iteraciones y de tokens por pedido (importa con USD 10 de saldo).

### Post-herramienta (después de aplicar el parche, sobre una copia)
1. Correr el validador sobre el modelo resultante.
2. Devolver en el `tool_result` sólo las violaciones nuevas:
   `RC-01 en realización CU2, msg 42: Vuelo no tiene cancelar()`.
3. Si hay violaciones bloqueantes, el modelo tiene que corregir. Máximo 3 rondas;
   después se entrega con las violaciones explicadas.
4. Registrar todo (parche, violaciones, tokens) → sirve para la evaluación y para
   detectar errores recurrentes que se conviertan en reglas nuevas (doc 04).

Este pre/post **es** el ciclo evaluador-optimizador del doc 01.

### Hooks de Claude Code, pero para desarrollar
Aparte del producto, en este repo sí conviene configurar hooks de Claude Code para el
**desarrollo**: por ejemplo, un `PostToolUse` que, al editar cualquier
`corpus/**/modelo/*.json`, corra el validador y los tests. Así las transcripciones del
corpus nunca quedan rotas. Se configura en `.claude/settings.json`.

## Notas de implementación con la API
- Salida estructurada / herramientas `strict` para que el parche siempre sea JSON válido.
- En los modelos actuales no se puede forzar una herramienta con `tool_choice`: se usa
  `auto` + instrucción clara + `strict`.
- Verificar en cada respuesta `usage.cache_read_input_tokens`: si es 0 en llamadas
  repetidas, algo está rompiendo el caché.

## Presupuesto de contexto: nunca se carga "todo"

Lo que crece con el tiempo (corpus, memoria, modelos) **nunca entra entero**. Sólo entra
un bloque fijo de tamaño constante y, del resto, la porción que el pedido necesita.

| Sección | ¿Crece? | Qué entra | Presupuesto aprox. |
|---|---|---|---|
| Herramientas + system (convenciones, esquema, catálogo) | No | Siempre, cacheado | 15–20k tokens |
| Modelo canónico del ejercicio | Sí | Sólo la porción relevante: clases del CU pedido + vecinas directas, y un índice del resto | 5–15k |
| Ejemplos del corpus (RAG) | Sí | Top 2–3 artefactos parecidos | 10–15k |
| Memoria de correcciones | Sí | Top 3–5 que toquen las mismas clases/reglas | 1–3k |
| Pedido + violaciones del validador | — | Lo de esta ronda | 1–3k |
| **Total por llamada** | | | **≈ 35–55k** |

Referencia: un EPC completo transcripto puede andar en 20–30k tokens, así que un corpus de
15 documentos ya supera los 300k. Cargarlo entero sería caro y además empeora las
respuestas: con más texto irrelevante el modelo presta menos atención a lo importante
(Anthropic lo describe en *Effective context engineering for AI agents*).

### Técnicas
- **Contexto justo a tiempo**: el modelo ve un índice ("clases: Vuelo, Estado, …") y pide
  el detalle con `leer_modelo(clase)` sólo si lo necesita.
- **Sin historial acumulado**: cada tarea empieza limpia. El estado está en el JSON del
  modelo, no en la conversación, así que no hace falta arrastrar el chat anterior.
- **Violaciones resumidas**: al modelo vuelven sólo las violaciones nuevas, no el
  reporte completo.
- **Medir**: registrar `input_tokens` por sección; si una pasa su presupuesto, recortar.
