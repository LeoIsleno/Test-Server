# ADR-0004 — API de Anthropic vs modelo propio (GPU local o alquilada)

**Estado:** Aceptado (2026-11-27)

## Opciones
1. **API de Anthropic** con contexto de modelado (convenciones cacheadas + RAG + validador).
2. **GPU local** (RTX 4060, 8 GB): QLoRA de modelos de ~7–8B.
3. **GPU alquilada** (p. ej. RTX 5090, 32 GB, en marketplaces tipo Vast.ai, ~USD 0,4/h
   publicado; el precio varía según la oferta): QLoRA de modelos de hasta ~30B y
   ejecución de modelos de ese tamaño cuantizados.

## Análisis
- **El cuello de botella son los datos, no la GPU.** Con ~15 documentos validados hay
  cientos de ejemplos: el ajuste fino enseña estilo, no análisis de dominio. Más GPU no
  resuelve eso.
- **Calidad:** los modelos abiertos que entran en 32 GB siguen por debajo de los modelos
  de frontera en razonamiento largo y coherente entre varios artefactos, y en leer
  diagramas en imagen (necesario para la ingesta).
- **Costo de entrenar vs costo de servir:** una corrida de entrenamiento en una GPU
  alquilada cuesta pocos dólares, pero tener el modelo **siempre online** cuesta
  ~USD 0,4 × 720 h ≈ USD 280/mes. La API cobra por uso (≈ USD 0,6 por ejercicio
  completo, estimado), así que para un uso esporádico es mucho más barata.
- **Operación:** las instancias de marketplace pueden ser interrumpibles y corren en
  máquinas de terceros; requiere montar el entorno cada vez.

## Decisión
API de Anthropic como base. La GPU alquilada (mejor que la 4060 para esto) se usa en
el **año 2 para el experimento comparativo** del doc 04: mismo set de evaluación y
mismas métricas del validador, Claude+RAG vs modelo abierto ajustado para generar el
JSON canónico. Alquiler por horas sólo durante entrenamiento y evaluación.

## Consecuencias
- El backend del modelo queda detrás de una interfaz (`GeneradorModelo`) para poder
  enchufar el modelo propio sin tocar editor ni validador.
- Re-evaluar esta decisión al retomar (~mes 12) con los datos que existan.
