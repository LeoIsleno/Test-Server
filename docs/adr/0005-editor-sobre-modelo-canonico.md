# ADR-0005 — El editor UML edita el modelo canónico

**Estado:** Aceptado (2026-11-27)

## Contexto
La página debe tener un editor de diagramas por bloques, consistente entre vistas y
exportable a PDF (doc 07).

## Opciones
1. Integrar un editor de dibujo genérico (tipo draw.io) y sincronizar después.
2. Editor propio cuyas acciones son operaciones sobre el modelo canónico.

## Decisión
Opción 2. Un editor de dibujo genérico guarda formas, no semántica: no sabe que la
flecha `cancelar()` es un método de `Vuelo`, y la consistencia se perdería.

## Consecuencias
- (+) Consistencia por construcción; el validador y el agente se reutilizan.
- (−) Más trabajo de interfaz → alcance limitado a los diagramas de la materia.
