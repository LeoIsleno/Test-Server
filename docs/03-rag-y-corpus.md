# 03 — RAG y corpus

## El problema particular de este corpus

Los EPC y parciales son PDF donde **lo valioso está en imágenes** (diagramas exportados
de Enterprise Architect / herramientas similares). Un RAG que sólo indexe el texto del
PDF pierde las soluciones. Por eso la ingesta tiene un paso de **transcripción
estructurada validada por humano**.

## Pipeline de ingesta

1. **Registro**: cada documento recibe un ID (`EPC-LINEAS-AEREAS-v1.35`), metadatos
   (materia, año, autores, tipo: EPC / parcial / práctico, versión) y se guarda **fuera
   del repo** (material de la cátedra; ver `corpus/README.md`).
2. **Segmentación por artefacto**: el documento se divide en secciones con significado
   propio: enunciado del dominio, reglas de negocio, cada CU, modelo de dominio, cada
   realización, cada vista de clases, cada DTE, cada patrón (estructura / dinámica /
   pseudocódigo).
3. **Transcripción de diagramas**: Claude (visión) lee cada página de diagrama y produce
   el fragmento correspondiente del **modelo canónico** (JSON). Ese JSON se pasa por el
   validador: lo que no cierra se marca para revisión.
4. **Revisión humana**: alumno/docente corrige la transcripción. Sólo lo aprobado pasa a
   estado `validado`. Este paso es lento y es *el* activo del proyecto.
5. **Indexación**: se indexan los segmentos validados (texto + JSON + PlantUML derivado).

## Unidad de recuperación (chunk)

Un chunk = **un artefacto con su contexto**, nunca un corte por cantidad de tokens.
Ejemplos: "CU Cancelar Vuelo (curso normal completo)", "Realización de análisis de
Cancelar Vuelo — secuencia", "DTE de Vuelo".

Metadatos por chunk: `doc_id`, `tipo_artefacto`, `cu`, `clases[]`, `patron`,
`estados[]`, `estado_validacion`, `version_esquema`.

## Contextual Retrieval (técnica publicada por Anthropic)

Antes de indexar, a cada chunk se le antepone un párrafo breve generado por un modelo
barato que lo sitúa en su documento ("Este fragmento es la realización de análisis del
CU Cancelar Vuelo del EPC Líneas Aéreas; involucra Vuelo, CambioEstadoVuelo, Estado…").
Se indexa con **embeddings + BM25** (búsqueda híbrida) y se reordena (*reranking*).
Anthropic reporta reducciones importantes en fallos de recuperación con esta combinación;
en este proyecto se **mide** con el set del doc 05 en vez de asumirlo.

## Qué se recupera según el pedido

| Pedido | Se recupera |
|---|---|
| "Hacé el DTE de X" | DTE de clases análogas (entidades con historial de estados), reglas de cátedra sobre DTE |
| "Realización del CU Y" | Realizaciones de CU con estructura parecida (ABM, consulta con filtros en cascada, cambio de estado) |
| "Aplicá el patrón que resuelva Z" | Ejercicios con el mismo problema de diseño + estructura/dinámica/pseudocódigo del patrón |
| "Revisá mi diagrama" | Convenciones + errores frecuentes validados en la memoria |

## Herramientas expuestas al agente (modo tutor / pedidos abiertos)

Diseñadas siguiendo *Writing effective tools for agents*: pocas, con nombres claros y
respuestas compactas.

- `buscar_corpus(consulta, tipo_artefacto?, patron?, k?)`
- `leer_artefacto(doc_id, artefacto_id)`
- `leer_modelo()` / `actualizar_modelo(parche_json)`
- `validar(modelo)` → lista de violaciones con ID de regla
- `renderizar(vista)` → PlantUML

## Stack (propuesta, ver ADR-0002)

Python; Postgres + pgvector (o SQLite + índice local al principio); BM25 con una librería
local; PlantUML para render. Todo reemplazable detrás de interfaces.
