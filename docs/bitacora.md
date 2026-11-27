# Bitácora

Formato: fecha — qué se hizo — qué se decidió — próximo paso. Lo más nuevo arriba.

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
