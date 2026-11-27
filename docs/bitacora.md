# Bitácora

Formato: fecha — qué se hizo — qué se decidió — próximo paso. Lo más nuevo arriba.

## 2026-11-27 — Interfaz web v0
- Visor por CU en `web/`: consignas, pasos con trazabilidad a mensajes, diagrama de
  clases y de secuencia en SVG desde el modelo, validación en vivo con resaltado cruzado.
- `ejercicio.json` por documento del corpus: consignas y qué CU las aplica.
- Violaciones con referencias estructuradas (`refs`: mensajes, clases, pasos, método).
- Decisión: el código vive en el repo; el Artifact es sólo una vista previa compilada
  (`npm run artifact`), para verlo sin instalar nada.

## 2026-11-27 — CU1 y CU3 transcriptos
- CU1 (comunicación, 86 mensajes, págs. 4–6, 13, 14) y CU3 escenario aterrizar
  (secuencia, 40 mensajes, págs. 10, 19, 20). Transcripción manual desde las imágenes,
  sin validación humana todavía; lecturas dudosas marcadas con `_lectura`.
- Resultados: CU1 → 7 bloqueantes + 2 advertencias (H9–H14). CU3 → 0 violaciones.
- Calibración con el corpus: CR-03 pasa a advertencia (intercalado origen/destino es
  práctica de la cátedra); CR-04 acepta `finCasoDeUso()`; CR-01 aplica a todo escenario.
- Nueva herramienta `npm run ficha`: genera tablas Markdown de lo transcripto para
  revisar contra el PDF (fichas en `corpus/epc-lineas-aereas/fichas/`).
- Próximo paso: **revisión humana de las 3 fichas** contra el PDF; luego DTE completo de
  Vuelo y reglas de Observer (PT-01/02).

## 2026-11-27 — Validador v0 sobre Líneas Aéreas
- Stack: TypeScript (ADR-0002, adoptado de hecho; pendiente confirmación del autor).
- Transcripción completa de la secuencia de CU2 (49 mensajes, pág. 17).
- Validador v0: RC-01, RC-02, RC-03 (sólo entity→entity), CR-01, CR-03, CR-04, DT-01,
  DT-02, DT-03. Proyector PlantUML de clases y secuencia.
- Resultado sobre el EPC tal cual: 7 violaciones (6 bloqueantes). Reproduce H1, H2, H3 y
  encuentra dos candidatos nuevos: H7 (Cerrado) y H8 (navegabilidad Aeropuerto→Ciudad).
- Test: con las correcciones propuestas el modelo queda en 0 violaciones.
- Próximo paso: transcribir vista de clases y realización de CU1 y CU3; reglas RC-04,
  RC-06, PT-01/02 (Observer).

## 2026-11-27 — Reglas, contexto y hooks
- Reglas de consistencia = código (validador); convenciones = archivos cacheados en el
  system prompt; ejemplos = RAG. Pre/post de herramientas en el loop propio; hooks de
  Claude Code sólo para el desarrollo del repo (doc 08).

## 2026-11-27 — Modelo y editor
- Decisión: API de Anthropic como base; GPU alquilada (p. ej. 5090) sólo para el
  experimento de ajuste fino del año 2 (ADR-0004).
- Nuevo requisito: editor web UML por bloques, consistente y exportable a PDF; edita el
  modelo canónico (doc 07, ADR-0005). Alcance: diagramas de la materia.

## 2026-11-27 — Arranque
- Se definió la visión, arquitectura (workflow + validador determinista sobre modelo
  canónico), estrategia de RAG con transcripción validada, capas de aprendizaje,
  evaluación y roadmap.
- Se analizó el EPC Líneas Aéreas v1.35 como documento semilla; se extrajeron
  convenciones y candidatos a inconsistencia (`corpus/epc-lineas-aereas/hallazgos.md`).
- Pendiente de decidir: lenguaje/stack (ADR-0002), hosting del agente (ADR-0003).
- Próximo paso: transcribir a JSON completo el CU Cancelar Vuelo (realización +
  vista de clases + DTE) y escribir las primeras reglas del validador contra él.
