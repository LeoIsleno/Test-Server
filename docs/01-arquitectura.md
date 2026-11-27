# 01 — Arquitectura

## Principio rector (guía de Anthropic: "empezar simple")

La guía *Building effective agents* de Anthropic distingue **workflows** (pasos
orquestados por código) de **agentes** (el modelo decide qué herramientas usar y cuándo),
y recomienda la solución más simple que funcione, agregando autonomía sólo cuando el
problema lo exige.

Resolver un parcial de DSI tiene **pasos conocidos y ordenados** (dominio → CU →
realización → clases → DTE → diseño/patrón), así que el núcleo es un **workflow**:

- **Prompt chaining**: cada etapa toma el modelo canónico de la etapa anterior.
- **Evaluator–optimizer**: después de cada etapa, el validador de consistencia (código,
  no LLM) devuelve violaciones; el modelo corrige hasta pasar o agotar intentos.
- **Routing**: un clasificador inicial decide qué se pidió (¿DTE? ¿secuencia? ¿patrón?
  ¿revisar un diagrama del alumno?) y qué etapas hacen falta.

La parte **agéntica** queda acotada al "modo tutor" y a pedidos abiertos, donde el modelo
elige herramientas (`buscar_corpus`, `leer_modelo`, `validar`, `renderizar`).

## Diagrama de alto nivel

```
            ┌───────────────────────────────────────────────┐
 Enunciado  │ 1. Router: ¿qué artefactos se piden?          │
 + CU  ───▶ └───────────────┬───────────────────────────────┘
 + pedido                   ▼
            ┌───────────────────────────────────────────────┐
            │ 2. Recuperación (RAG)                         │◀── Corpus EPC/parciales
            │   ejemplos similares + convenciones cátedra   │    (transcriptos y validados)
            └───────────────┬───────────────────────────────┘
                            ▼
            ┌───────────────────────────────────────────────┐
            │ 3. Análisis del dominio → MODELO CANÓNICO     │
            │   entidades, atributos, relaciones, estados,  │
            │   reglas de negocio, CU paso a paso           │
            └───────────────┬───────────────────────────────┘
                            ▼
            ┌───────────────────────────────────────────────┐
            │ 4. Etapas de generación (sobre el MISMO modelo)│
            │   realización CU → clases análisis → DTE →    │
            │   diseño/patrón → DER                         │
            │         │                ▲                    │
            │         ▼                │ violaciones        │
            │   5. VALIDADOR de consistencia (determinista) │
            └───────────────┬───────────────────────────────┘
                            ▼
            ┌───────────────────────────────────────────────┐
            │ 6. Proyección: PlantUML/Mermaid + explicación │
            │    + trazabilidad (paso CU ↔ mensaje ↔ método)│
            └───────────────────────────────────────────────┘
                            │
                            ▼  feedback del usuario/docente
                   corpus · memoria · set de evaluación
```

## Componentes

| Componente | Tipo | Responsabilidad |
|---|---|---|
| `router` | 1 llamada LLM, salida estructurada | Clasificar el pedido y elegir etapas |
| `retriever` | Código + embeddings + BM25 | Traer ejemplos y convenciones (ver doc 03) |
| `modelador` | LLM con salida estructurada (JSON Schema) | Construir/extender el modelo canónico |
| `validador` | **Código puro, sin LLM** | Aplicar reglas de consistencia (doc 02) |
| `proyector` | Código puro | Modelo canónico → PlantUML / Mermaid / tabla |
| `explicador` | LLM | Texto didáctico estilo cátedra, citando la trazabilidad |
| `tutor` | Agente con herramientas | Revisar el diagrama del alumno y guiar |
| `memoria` | Base de datos | Correcciones validadas, preferencias, historial |

**Por qué el validador es código y no otro LLM:** las reglas de consistencia son
verificables mecánicamente ("todo mensaje recibido por una línea de vida de clase C es un
método de C"). Un chequeo determinista es reproducible, explicable en la defensa del
proyecto y gratis. El LLM queda para lo que no se puede verificar así (calidad del
análisis, nombres, pertinencia didáctica), y eso se evalúa con rúbrica (doc 05).

## Salida estructurada

Todas las etapas que producen modelo devuelven JSON validado contra el esquema del doc 02
(*structured outputs* de la API de Claude). Nunca se parsea un diagrama dibujado por el
modelo como texto libre: el diagrama **se genera desde el JSON**.

## Uso de la API de Claude (decisiones a confirmar en ADR)

- Modelo principal: el Opus vigente para modelado y corrección; un modelo más barato
  (Haiku/Sonnet vigente) para router, contextualización de chunks y transcripciones
  masivas. Los IDs concretos viven en configuración, no en el código, para que el
  proyecto sobreviva cambios de modelo en 2 años.
- *Adaptive thinking* activado en etapas de análisis; esfuerzo (`effort`) ajustado por
  etapa y medido con el set de evaluación.
- *Prompt caching* sobre el bloque fijo (convenciones de cátedra + esquema + reglas), que
  se repite en todas las llamadas.
- Hosting del loop: ver [ADR-0003](adr/0003-hosting-del-agente.md).

## Referencias oficiales de Anthropic (verificar vigencia al retomar)

- *Building effective agents* — anthropic.com/research/building-effective-agents
- *Introducing Contextual Retrieval* — anthropic.com/news/contextual-retrieval
- *Writing effective tools for agents* — anthropic.com/engineering
- *Effective context engineering for AI agents* — anthropic.com/engineering
- Documentación de la API (tool use, structured outputs, prompt caching, evals) —
  platform.claude.com/docs
