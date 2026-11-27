# ADR-0002 — Lenguaje y stack

**Estado:** Propuesto (actualizado 2026-11-27; reemplaza la propuesta inicial de Python)

## Contexto
Apareció el requisito del editor web con validación en vivo (doc 07, ADR-0005).

## Opciones
- **TypeScript en todo**: el mismo validador corre en el navegador (editor, en vivo y
  sin servidor) y en el backend (agente, evaluación). Un solo lenguaje para mantener
  durante 2 años. Tiene SDK oficial de Anthropic.
- **Python núcleo + TypeScript editor**: mejor ecosistema de ML, pero el validador
  quedaría duplicado o tendría que correr siempre en el servidor.

## Propuesta
TypeScript en todo (Node en el backend). Python sólo si se hace el experimento de
ajuste fino del año 2, que es independiente: consume el JSON canónico y se evalúa con el
mismo validador expuesto por CLI.

## A confirmar por el autor
