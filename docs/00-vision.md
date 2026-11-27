# 00 — Visión del proyecto

## Problema

En DSI (UTN FRC) los parciales piden, a partir de una **descripción del dominio** y de
**casos de uso** (CU), construir modelos UML: realización de CU de análisis (diagrama de
comunicación o secuencia), vista de clases de análisis, DTE de una clase, y en diseño la
aplicación de un patrón (p. ej. Observer) con su estructura, dinámica y pseudocódigo.

El error típico del alumno (y de un LLM usado "a pelo") no es dibujar mal un diagrama
aislado: es la **inconsistencia entre diagramas**. Un mensaje de secuencia que no existe
como método en la clase receptora, un atributo que aparece en un diagrama y no en otro,
una transición del DTE sin método asociado, un paso del CU sin mensaje que lo realice.

## Objetivo general

Construir un **agente "Profesor DSI"** que:

1. **Recupere** (RAG) ejercicios resueltos y convenciones de la cátedra relevantes al
   pedido.
2. **Analice el dominio** de un enunciado nuevo de forma explícita y trazable
   (entidades, estados, reglas de negocio, actores, CU).
3. **Produzca** el artefacto solicitado (clases, secuencia, comunicación, DTE, DER,
   patrón) como proyección de un modelo canónico único.
4. **Verifique** la consistencia entre todos los artefactos con reglas deterministas y
   corrija antes de responder.
5. **Ofrezca un editor web de diagramas** (clases, secuencia, DTE, comunicación, DER)
   que edita el mismo modelo, valida en vivo y exporta a PDF (doc 07). Sirve también
   para estudiar para el final de DSI.
6. **Mejore con el uso**: cada corrección validada (por el alumno o por un docente)
   alimenta el corpus, los ejemplos y el set de evaluación.

## Objetivos específicos (medibles)

- O1. Transcribir ≥ 15 EPC/parciales resueltos a formato estructurado validado.
- O2. Validador de consistencia con ≥ 30 reglas, cada una con tests.
- O3. En el set de evaluación retenido: 100 % de salidas sin violaciones de reglas
  "bloqueantes" y cobertura ≥ X % de clases/métodos de la solución oficial (X a fijar con
  la línea base del mes 6).
- O4. Modo tutor: dado un diagrama del alumno, señalar inconsistencias con la misma
  precisión que el validador.

## Alcance

**Incluye:** análisis y diseño OO tal como lo enseña la cátedra (boundary / control /
entity, realización de CU, DTE, patrones GoF vistos en la materia), DER, generación en
PlantUML (renderizable) y explicación textual.

**No incluye (al menos inicialmente):** reemplazar la corrección docente, generar código
de producción, otras materias.

## ¿Qué significa "entrenar" acá?

Ver [04-aprendizaje.md](04-aprendizaje.md). Resumen honesto: el núcleo del proyecto **no**
depende de reentrenar los pesos del modelo. El "aprendizaje" es (a) un corpus que crece,
(b) ejemplos recuperados según el pedido, (c) memoria de correcciones validadas y
(d) mejora iterativa de prompts medida contra un set de evaluación. El ajuste fino de un
modelo abierto queda como **línea de investigación opcional del año 2**, comparada contra
lo anterior.

## Usuarios

- **Alumno**: pide un artefacto o somete el suyo a revisión ("modo tutor").
- **Docente / validador**: aprueba o corrige transcripciones y respuestas; sus
  correcciones tienen mayor peso.
- **Desarrollador (vos, en 1 año)**: tiene que poder retomar leyendo `docs/`.
