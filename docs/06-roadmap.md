# 06 — Roadmap (2 años, con pausa de investigación)

| Fase | Período aprox. | Entregable | Criterio de salida |
|---|---|---|---|
| 0. Diseño | Mes 0–1 | Esta documentación, ADRs, esquema v0 | Esquema y reglas revisados |
| 1. Corpus semilla | Mes 1–3 | 3–5 EPC transcriptos y validados (empezando por Líneas Aéreas) | Validador corre sobre ellos; hallazgos documentados |
| 2. Validador + proyector | Mes 2–4 | Reglas RC/CR/DT/PT con tests; render PlantUML | Detecta los hallazgos conocidos del corpus semilla |
| 2b. Editor v1 | Mes 3–6 | Editor de clases + secuencia sobre el modelo, validación en vivo, export PDF | Se puede rehacer CU2 de Líneas Aéreas en el editor sin violaciones |
| 3. Línea base | Mes 4–5 | Prompt único sin RAG; set de evaluación v1 | Números de línea base publicados en bitácora |
| 4. Pipeline v1 | Mes 5–8 | Router + RAG + modelador + ciclo evaluador-optimizador | Mejora medible sobre línea base en test |
| 5. Modo tutor | Mes 8–11 | Revisión de diagramas del alumno | Precisión de detección medida |
| **Pausa / retome investigación** | ~Mes 12 | Informe de avance: resultados por capa (doc 04) | Bitácora al día para retomar |
| 6. Escala de corpus | Mes 12–16 | ≥ 15 documentos, DER, más patrones | Cobertura de contenidos de la materia |
| 7. Retroalimentación | Mes 14–18 | Memoria de correcciones, feedback docente | Ciclo del doc 04 funcionando |
| 8. (Opcional) Fine-tuning | Mes 16–20 | Comparación modelo abierto ajustado vs RAG+validador | Resultado reportado, positivo o negativo |
| 9. Cierre | Mes 20–24 | Interfaz final, informe, defensa | Proyecto final presentado |

## Regla para retomar después de la pausa

Al volver: leer `docs/bitacora.md` de abajo hacia arriba, correr el set de evaluación y
comparar con el último número registrado **antes** de tocar nada. Los modelos de Claude
habrán cambiado: re-medir la línea base con el modelo vigente.
