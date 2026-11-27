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

## El corpus ES el dataset (decisión reversible)

Transcribir y validar ejercicios se hace igual para RAG que para entrenar. Desde el día
1 cada ejemplo validado se exporta también en formato de entrenamiento, así la opción
de ajuste fino queda abierta sin trabajo extra.

```jsonl
{"id": "EPC-LA-v1.35/CU2/realizacion", "split": "train",
 "input":  {"dominio": "...", "reglasNegocio": [...], "cu": {...}, "consigna": "Realización de análisis, curso normal, secuencia", "modeloPrevio": {...}},
 "output": {"parche": {...}},            // fragmento del modelo canónico
 "validacion": {"estado": "validado", "por": "docente|alumno", "violaciones": []}}
```

- El `split` se asigna **por documento** (igual que en el doc 05).
- Un ejemplo por artefacto (CU → realización, realización → clases, clases → DTE, …),
  no por ejercicio entero: multiplica los ejemplos y coincide con las etapas del pipeline.

### Datos sintéticos (para escalar si se entrena)
Con ~15 documentos salen cientos de ejemplos: poco para ajuste fino. Para llegar a
miles: generar **variantes de dominio** (biblioteca, hospital, cine…) con sus
soluciones usando Claude, filtrar con el validador y revisar una muestra a mano.
- El validador garantiza consistencia, **no** criterio de cátedra → muestreo humano
  obligatorio.
- Costo estimado: con Batch API (50 % menos), ~USD 0,15–0,30 por ejemplo según modelo
  → 1.000 ejemplos ≈ USD 150–300. Fuera del alcance del saldo actual; planificarlo para
  el año 2 si el experimento se justifica.

### Hardware para el experimento del año 2
GPU alquilada por horas sólo durante el entrenamiento: RTX 5090 (32 GB) para modelos de
hasta ~30B con QLoRA; A40 (48 GB) da margen para ~30B cómodo o ~70B ajustado. La
elección depende del tamaño de modelo a comparar, no al revés.
