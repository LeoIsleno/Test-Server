# ADR-0002 — Lenguaje y stack

**Estado:** Propuesto

## Opciones
- **Python**: ecosistema más amplio para RAG/ML y para un posible fine-tuning en el
  año 2; SDK oficial de Anthropic; habitual en trabajos académicos.
- **TypeScript**: buena opción si la interfaz web es prioritaria; SDK oficial también.
- Java/C#: posibles (SDK oficiales) pero con menos herramientas de RAG/ML.

## Propuesta
Python para el núcleo (modelo canónico, validador, RAG, evaluación). Interfaz a definir.
Almacenamiento: SQLite al inicio → Postgres + pgvector cuando el corpus crezca.
Render: PlantUML.

## A decidir por el autor
Confirmar lenguaje según lo que domine y lo que pida la cátedra de proyecto final.
