# 04 — Retroalimentación y "entrenamiento"

## Lo que hay que decir con claridad en la defensa

Los modelos Claude **no se reentrenan** desde la API pública con tus datos como parte de
este proyecto. Entonces, "que el agente aprenda" se implementa en capas que **sí
controlamos y podemos medir**:

| Capa | Qué cambia | Cómo aprende | Riesgo |
|---|---|---|---|
| 1. Corpus | Más ejercicios validados | Cada EPC/parcial transcripto suma ejemplos | Transcripciones erróneas → se mitiga con validación humana |
| 2. Ejemplos dinámicos (*few-shot*) | Qué ejemplos ve el modelo | Se priorizan los que mejor resultado dieron en evaluación | Sobreajuste a pocos ejercicios |
| 3. Memoria de correcciones | Errores frecuentes y su corrección | Una corrección aprobada por docente se guarda y se recupera en casos similares | Memoria contaminada → toda entrada nueva requiere aprobación |
| 4. Reglas del validador | Nuevas reglas de consistencia | Un error recurrente se convierte en regla determinista + test | — |
| 5. Prompts | Instrucciones del sistema por etapa | Iteración medida contra el set de evaluación (train / validación / test) | Mejorar en train y empeorar en test → siempre reportar test |
| 6. (Opcional, año 2) Ajuste fino | Pesos de un modelo abierto | Fine-tuning con pares (enunciado → modelo canónico validado) | Pocos datos; se compara contra capas 1–5 |

La capa 4 es la más valiosa académicamente: convierte "el profe me corrigió esto" en
**conocimiento explícito y verificable**.

## Ciclo de retroalimentación

```
respuesta del agente ─▶ usuario/docente marca: ✔ correcto / ✘ error (con regla o comentario)
                                   │
            ┌──────────────────────┼─────────────────────────┐
            ▼                      ▼                         ▼
   ¿error mecánico?        ¿error de criterio?       ¿respuesta ejemplar?
   → nueva regla +         → memoria de corrección   → candidato a ejemplo
     test (capa 4)           (capa 3, con aprobación)  del corpus (capa 1/2)
                                   │
                                   ▼
                  se agrega caso al set de evaluación (doc 05)
```

## Pregunta de investigación (para la pausa del año 1)

> ¿Cuánto mejora la consistencia y la fidelidad a la cátedra cada capa, por separado y
> combinadas? ¿Agrega algo el ajuste fino de un modelo abierto frente a RAG + validador?

Esto da una tesis concreta, medible y defendible, en lugar de "entrenamos una IA".
