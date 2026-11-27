# Convenciones de la cátedra DSI (extraídas de los EPC)

Fuente inicial: EPC Líneas Aéreas v1.35 (Alarcón, Boiero, Meles). Cada convención se
anota con su fuente; se amplía con cada documento nuevo. Estas son las reglas de estilo
que el validador chequea como advertencias y que van en el prompt fijo (cacheado).

## Realización de casos de uso de análisis
- Tres estereotipos: **boundary** (`Pantalla<Nombre>`), **control**
  (`Gestor<Nombre>`), **entity** (clases del dominio). Un boundary y un control por CU.
- El actor dispara con `opcion<NombreCU>()` sobre la pantalla; la pantalla se habilita
  con `habilitarPantalla()` / `habilitarVentana()` y crea/invoca al gestor
  (`nuevaCancelacion()`, `consultarDispVuelos()`).
- Selecciones del actor: `seleccion<Cosa>()` / `tomarSeleccion<Cosa>()` en la pantalla
  → `<cosa>Seleccionada()` / `tomar<Cosa>()` en el gestor. El gestor guarda la selección
  como atributo (`paisOrigenSeleccionado`, `motivoCancelacion`).
- Pedidos del sistema al actor: `solicitar…()`, `pedir…()`, `listar…()`, `mostrar…()`
  en la pantalla.
- El gestor cierra con `finCU()` (CU2, CU3) o `finCasoDeUso()` (CU1).
- En selecciones en cascada con origen y destino, la realización intercala: país origen →
  provincias de origen → país destino → provincias de destino → … aunque el CU los
  agrupe en un mismo paso.
- Mensajes iterativos con `*` (`*getNombre()`), y en secuencia dentro de fragmentos
  `loop` con guarda `[mientras haya <cosas>]`.
- Fecha/hora actual y usuario logueado: `obtenerFechaYHoraActual()`,
  `obtenerUsuarioSesion()` → `Sesion.obtenerEmpleado()`.
- Para mostrar datos de objetos relacionados se navega: `Vuelo.mostrarDatosDefinicion()`
  → `DefinicionDeVuelo.mostrarCiudadOrigen()` → `Aeropuerto.getNombreCiudad()` →
  `Ciudad.getNombre()`. Nunca se "saltean" objetos.
- Consultas booleanas como `es<Algo>()` / `esFactible<Algo>()` / `permite<Algo>()`.

## Historial de estados
- Una entidad con historia de estados tiene `CambioEstadoVuelo` (fechaHoraInicio,
  fechaHoraFin, …) asociado a `Estado`. El estado actual es el cambio sin
  `fechaHoraFin`: `esEstadoActual()`.
- Cambiar de estado: cerrar el actual (`setFechaHoraFin()`) y crear uno nuevo
  (`crearCambioEstadoVuelo()` → `new()`).
- `Estado` expone predicados (`esCancelado()`, `esEstadoFinal()`,
  `permiteCancelacion()`).

## DTE
- Transiciones con formato `Evento [guarda] /accion()`; el evento suele ser el nombre
  del CU ("Cancelar Vuelo /cancelar()").
- Estados compuestos (p. ej. `EnEjecucion`) con su submáquina.
- Se pide listar los CU asociados a las transiciones.

## Patrones (diseño)
- Se entregan **estructura** (diagrama de clases), **dinámica** (secuencia) y
  **pseudocódigo**, y se indica variante (p. ej. Observer *push*).
- Interfaces con prefijo `I` (`ISujetoVuelo`, `IObservadorVuelo`).
- En diseño los atributos y métodos llevan visibilidad y tipos.

## Casos de uso
- Plantilla con: categoría, prioridad, complejidad, actores, tipo, objetivo,
  precondiciones, postcondiciones (éxito/fracaso), curso normal numerado
  Actor/Sistema, alternativos numerados por paso (`11.A`, `11.A.1`), observaciones,
  extensiones/inclusiones/generalización. Existe una versión abreviada con flujos
  alternativos `A1…An`.
