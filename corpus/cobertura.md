# Matriz de cobertura del corpus

Lo que importa no es cuántos ejercicios hay sino **qué tipos de problema cubren**.
Objetivo: cada tipo presente en **≥ 2–3 documentos de train** (para que el RAG encuentre
uno parecido aunque otro esté reservado para test).

Marcar con ✔ validado, ◐ transcripto sin validar, vacío = no hay.

| Tipo de problema | Líneas Aéreas | … | … |
|---|---|---|---|
| CU consulta con filtros en cascada (país → provincia → ciudad) | ◐ CU1 | | |
| CU registro de cambio de estado (cancelar, actualizar situación) | ◐ CU2, CU3 | | |
| CU ABM / alta de entidad | | | |
| CU reporte / listado con cálculo | | | |
| Realización con diagrama de comunicación | ◐ | | |
| Realización con diagrama de secuencia | ◐ | | |
| Historial de estados (`CambioEstado…`) | ◐ | | |
| DTE con estado compuesto | ◐ EnEjecucion | | |
| Patrón Observer | ◐ push | | |
| Patrón State | | | |
| Patrón Strategy | | | |
| Patrón Composite | | | |
| Otros patrones de la materia | | | |
| DER | | | |

## Metas
- **MVP:** 3–5 documentos variados. Ya da respuestas útiles en los tipos cubiertos.
- **Cobertura buena:** 10–15 documentos que llenen la matriz (2–3 por tipo).
- **Después:** rendimientos decrecientes; agregar sólo donde la evaluación muestre
  fallas (doc 05).
- Reservar 3–5 documentos para test, nunca usados por el RAG en la evaluación.
