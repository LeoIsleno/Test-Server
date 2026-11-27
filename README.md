# Profesor DSI — Agente de modelado UML para Diseño de Sistemas de Información (UTN FRC)

Proyecto final (horizonte: 2 años). Un agente basado en Claude que, a partir de un
enunciado de dominio y de los casos de uso, **analiza el dominio como lo haría la cátedra
de DSI** y produce los artefactos que pide un parcial: realización de CU (comunicación /
secuencia), diagrama de clases de análisis y de diseño, DTE (máquina de estados), DER,
y aplicación de patrones de diseño, **todos consistentes entre sí**.

## La idea central en una línea

> Los diagramas no se generan por separado: se genera **un único modelo canónico** del
> sistema y cada diagrama es una **proyección** de ese modelo. Un validador determinista
> verifica las reglas de consistencia entre vistas antes de entregar nada.
> El **editor web de diagramas** edita ese mismo modelo, así que lo que dibuja el alumno
> y lo que genera el agente se validan igual.

Así, si `Vuelo` tiene `fecha` y `horaPartidaProgramada` en el diagrama de clases, el
diagrama de secuencia sólo puede usar esos atributos (vía `getFecha()`, etc.) porque
ambos salen del mismo objeto.

## Índice de la documentación

| Doc | Contenido |
|---|---|
| [docs/00-vision.md](docs/00-vision.md) | Problema, objetivos, alcance, qué significa "entrenar" en este proyecto |
| [docs/01-arquitectura.md](docs/01-arquitectura.md) | Arquitectura del agente, pipeline, patrones de Anthropic aplicados |
| [docs/02-modelo-canonico.md](docs/02-modelo-canonico.md) | Esquema del modelo canónico y catálogo de reglas de consistencia |
| [docs/03-rag-y-corpus.md](docs/03-rag-y-corpus.md) | Ingesta de EPCs/parciales, transcripción de diagramas, RAG |
| [docs/04-aprendizaje.md](docs/04-aprendizaje.md) | Retroalimentación y "entrenamiento": qué es posible y qué no |
| [docs/05-evaluacion.md](docs/05-evaluacion.md) | Cómo medimos si el profesor es bueno |
| [docs/06-roadmap.md](docs/06-roadmap.md) | Plan de 2 años con la pausa de investigación |
| [docs/07-editor-uml.md](docs/07-editor-uml.md) | Editor web de diagramas consistente y exportable a PDF |
| [docs/08-reglas-y-contexto.md](docs/08-reglas-y-contexto.md) | Implementación de reglas, armado de contexto y hooks |
| [docs/convenciones-catedra.md](docs/convenciones-catedra.md) | Convenciones de la cátedra extraídas de los EPC |
| [docs/bitacora.md](docs/bitacora.md) | Bitácora de decisiones y avances (para retomar en 1 año) |
| [docs/adr/](docs/adr/) | Registros de decisiones de arquitectura (ADR) |
| [corpus/](corpus/) | Corpus de ejercicios: metadatos y transcripciones (no los PDF originales) |
| [corpus/cobertura.md](corpus/cobertura.md) | Matriz de cobertura: qué tipos de problema cubre el corpus |
| [corpus/plan-de-carga.md](corpus/plan-de-carga.md) | Plan de carga por oleadas, split y costos |

## Estado

Fase 0 — Diseño y documentación. Ver [roadmap](docs/06-roadmap.md).
