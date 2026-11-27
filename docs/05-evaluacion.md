# 05 — Evaluación

Sin evaluación no hay forma de saber si un cambio mejoró al profesor. El set de
evaluación se arma **desde el primer EPC transcripto**.

## Set de casos

- Cada caso = (enunciado + CU + consigna) → solución oficial transcripta.
- **División por documento**, nunca por artefacto: si el EPC Líneas Aéreas está en test,
  ninguna parte suya entra al corpus recuperable durante esa evaluación (evita "copiarse").
- Proporción inicial: 60 % train (corpus + ejemplos), 20 % validación (ajustar prompts),
  20 % test (sólo se mira para reportar).

## Métricas

| Métrica | Cómo | Tipo |
|---|---|---|
| Violaciones bloqueantes | Validador del doc 02 | Determinista |
| Cobertura de clases | % de clases de la solución oficial presentes (con normalización de nombres) | Determinista |
| Cobertura de atributos / métodos | Ídem por clase | Determinista |
| Cobertura de mensajes | Alineación de la secuencia generada con la oficial | Determinista (aprox.) |
| Fidelidad a convenciones | Advertencias de estilo cátedra | Determinista |
| Calidad del análisis | Rúbrica (5–10 criterios) evaluada por LLM juez **calibrado contra notas humanas** | LLM + humano |
| Costo y latencia por ejercicio | Uso de tokens de la API | Medición |

El juez LLM sólo cuenta si su acuerdo con un docente sobre una muestra es aceptable; si
no, se usa la nota humana.

## Línea base

Antes de construir nada sofisticado: medir **un único prompt grande sin RAG ni
validador**. Toda mejora posterior se reporta contra esa línea base.
