# ADR-0001 — Modelo canónico único; diagramas como proyecciones

**Estado:** Aceptado (2026-11-27)

## Contexto
El requisito central es la consistencia entre diagramas (atributos de clases que
aparecen en secuencia, métodos del DTE que existen en la clase, pasos del CU realizados).

## Opciones
1. Generar cada diagrama por separado (texto/PlantUML) y pedirle al LLM que revise.
2. Generar un modelo estructurado único (JSON) y derivar todas las vistas con código,
   validando reglas deterministas.

## Decisión
Opción 2.

## Consecuencias
- (+) Consistencia por construcción en lo que el esquema representa; violaciones
  restantes detectables y explicables por ID de regla.
- (+) El validador sirve también para el modo tutor y para validar transcripciones.
- (−) Hay que diseñar y versionar un esquema; los diagramas del alumno hay que llevarlos
  a ese esquema para revisarlos.
