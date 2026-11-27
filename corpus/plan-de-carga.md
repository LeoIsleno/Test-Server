# Plan de carga del corpus (~50 parciales y EPC)

El cuello de botella es la **validación humana**, no la cantidad de PDFs. Por eso se
carga por etapas, eligiendo qué transcribir.

## Paso 1 — Inventario (barato, todos)
Completar `inventario.csv` con los ~50: tipo, año, dominio, si tiene **solución**, tipos
de CU, si pide DTE / patrón (cuál) / DER. Basta con leer enunciado y consignas.

- **Con solución** → candidatos a corpus (train) o a test.
- **Sin solución** → sirven como enunciados de práctica en el modo estudio o como test
  calificado por un docente; no van al RAG.

## Paso 2 — Split
- **Test: el año más reciente** (o ~20 %, 8–10 docs). Simula "el próximo parcial" y es la
  medida más honesta. Nunca entra al RAG durante la evaluación.
- **Train: el resto con solución.**

## Paso 3 — Transcripción por oleadas
| Oleada | Docs | Criterio | Costo API estimado* |
|---|---|---|---|
| MVP | 3–5 | Máxima variedad: llenar la matriz de `cobertura.md` | ≈ USD 2–5 |
| 2 | +5–10 | Huecos de la matriz (patrones y tipos de CU faltantes, DER) | ≈ USD 5–10 |
| 3 | resto | Sólo donde la evaluación muestre fallas | ≈ USD 20–40 en total |

*Transcripción de diagramas con visión: ~10 páginas de diagramas por documento,
≈ USD 0,5–1 por documento con el Opus actual, la mitad con Batch API. Estimación a
confirmar midiendo el primer documento.

## Material de la cátedra
Uso personal / académico: privado, fuera del repo (`corpus/_raw/`). Antes de abrir la
herramienta a otros alumnos, pedir autorización a la cátedra (además puede ser un aliado:
validación docente y difusión).
