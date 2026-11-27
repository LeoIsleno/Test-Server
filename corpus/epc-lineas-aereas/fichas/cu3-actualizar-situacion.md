# Ficha de transcripción — CU3 Actualizar situación de Vuelo (escenario Aterrizar)

- **Fuente:** EPC Líneas Aéreas v1.35, págs. 10 (CU, escenario aterrizar), 19 (secuencia), 20 (vista de clases), 21-22 (DTE)
- **Estado:** borrador
- **Generada desde:** `corpus/epc-lineas-aereas/modelo/cu3-actualizar-situacion.json`

> Revisar cada tabla contra el PDF. Marcar errores de lectura y corregirlos en el JSON (no en esta ficha).

## CU3 — Actualizar situación de Vuelo (escenario Aterrizar) (actor: EncargadoNavegacion)

| Paso | Quién | Texto |
|---|---|---|
| 1 | Actor | selecciona la opción Actualizar situación de Vuelo |
| 2 | Sistema | busca y muestra las opciones de actualización de estado (vuelos en estado no final) y solicita qué estado actualizar |
| 3 | Actor | selecciona la opción Aterrizar Vuelo |
| 4 | Sistema | busca los vuelos en condiciones de aterrizar (en zona), muestra número de vuelo y fecha y hora de partida programada, y solicita seleccionarlos |
| 5 | Actor | selecciona un vuelo para aterrizar |
| 6 | Sistema | solicita confirmación para marcar el vuelo como aterrizado |
| 7 | Actor | confirma la actualización |
| 8 | Sistema | registra fecha, hora y usuario responsable, actualiza el estado a aterrizado y notifica a los interesados |

## Clases

| Clase | Estereotipo | Atributos | Métodos |
|---|---|---|---|
| PantSituacionVuelo | boundary | estadoElegido, estadoNoFinal, labelEstadoVuelosActualizar, vueloElegido, vuelosAActualizar | habilitarInterfaz(), mostrarVuelosActualizar(), opcionActualizarSituacionVuelo(), opcionAterrizarVuelo(), pedirConfirmacionAterrizarVuelo(), tomarConfAterrizarVuelo(), tomarSeleccionVuelo(), visualizarEstados() |
| GestorSituacionVuelo | control | estadoDestino, estadoElegidoParaActualizar, estadosNoFinales, fechaHoraActual, infoVuelosActualizables, sesion, vueloElegido | actualizarSituacionVuelo(), aterrizarVuelo(), buscarEstadoAterrizado(), buscarEstadosNoFinales(), buscarVuelosEnZona(), finCU(), obtenerFechaHoraActual(), obtenerInfoVuelosEnZona(), obtenerUsuarioSesion(), registrarAterrizajeVuelo(), tomarConfAterrizajeVuelo(), tomarSeleccionEstadoActualVuelo(), tomarSeleccionEstadoDestino(), tomarVueloElegido() |
| PantallaEstadosDeVuelo | boundary | estado, fechaVuelo, horaVuelo, nroVuelo | actualizar(), actualizarEstadoVuelos(), buscarVuelo(), setEstadoVuelo(), setFecha(), setHora(), setNroVuelo() |
| PantallaConsultarDisponibilidad | boundary | estado, fechaVuelo, flexibilidad, horaDesde, horaHasta, horaVuelo, nroVuelo | actualizar(), actualizarEstadoVuelos(), buscarVuelo(), setEstadoVuelo(), setFecha(), setHora() |
| Vuelo | entity | diagramacion, fecha, historialEstado, horaPartidaProgramada, reserva | aterrizar(), calcularDisponibilidad(), cancelar(), cerrar(), crearCambioEstadoVuelo(), demorar(), despegar(), embarcar(), enAire(), enZona(), esAterrizado(), esDeFechaYHoraYDestino(), esFactibleCancelar(), getCambioEstadoVuelo(), getDefinicionVuelo(), getFecha(), getFechaHoraPartidaProgramada(), getHoraPartidaProgramada(), getReserva(), mostrarDatosDefinicion(), mostrarDatosVuelo(), new(), obtenerCiudadDestino(), obtenerCiudadOrigen(), obtenerDisponibilidadPorClase(), obtenerDuracion(), obtenerEstadoActual(), obtenerNroVuelo(), obtenerReservasSegunClase(), obtenerTarifaSegunClase(), reprogramar(), terminarVuelo() |
| CambioEstadoVuelo | entity | comentario, estado, fechaHoraFin, fechaHoraInicio, motivoCancelacion | esCancelable(), esEstadoActual(), esEstadoEnZona(), getEmpleado(), getEstado(), getFechaHoraFin(), getMotivoCancelacion(), getSesion(), new(), setFechaHoraFin() |
| Estado | entity | descripcion, esCancelable, esFinal, nombre | esCancelado(), esEstadoEnZona(), esEstadoFinal(), getCancelable(), getFinal(), getNombre(), permiteCancelacion(), setCancelable(), setFinal(), setNombre() |
| DefinicionDeVuelo | entity | aeropuertoDestino, aeropuertoOrigen, diaSemana, duracion, horarioPartida, nroVuelo, tarifa, tiempoEmbarque | getAeropuertoDestino(), getAeropuertoOrigen(), getDiaSemana(), getDuracion(), getNroVuelo(), getTarifa(), getTipoAeroNave(), mostrarCiudadDestino(), mostrarCiudadOrigen(), obtenerCapacidadSegunClase(), obtenerTarifaSegunClase() |
| Sesion | entity | fechaHora, responsable | obtenerEmpleado() |
| Empleado | entity | apellido, cargo, nombre | getCargo(), getNombreCompleto() |

## Relaciones

| Desde | Hacia | Rol | Multiplicidad |
|---|---|---|---|
| Vuelo | CambioEstadoVuelo | cambioEstadoVuelo | 1..* |
| Vuelo | DefinicionDeVuelo | definicionDeVuelo | 1 |
| CambioEstadoVuelo | Estado | estado | 1 |
| CambioEstadoVuelo | Empleado | empleado | 1 |
| Sesion | Empleado | responsable | 1 |

## Realización CU3 — secuencia, curso aterrizar (pág. 19)

| # | Desde | Hacia | Mensaje | Paso CU | Nota |
|---|---|---|---|---|---|
| 1 | actor | pantalla:PantSituacionVuelo | opcionActualizarSituacionVuelo() | 1 |  |
| 2 | pantalla:PantSituacionVuelo | pantalla:PantSituacionVuelo | habilitarInterfaz() | 1 |  |
| 3 | pantalla:PantSituacionVuelo | gestor:GestorSituacionVuelo | actualizarSituacionVuelo() | 1 |  |
| 4 | gestor:GestorSituacionVuelo | gestor:GestorSituacionVuelo | buscarEstadosNoFinales() | 2 |  |
| 5 | gestor:GestorSituacionVuelo | estados:Estado | *esEstadoFinal() | 2 |  |
| 6 | gestor:GestorSituacionVuelo | estados:Estado | *getNombre() | 2 |  |
| 7 | gestor:GestorSituacionVuelo | pantalla:PantSituacionVuelo | visualizarEstados() | 2 |  |
| 8 | actor | pantalla:PantSituacionVuelo | opcionAterrizarVuelo() | 3 |  |
| 9 | pantalla:PantSituacionVuelo | gestor:GestorSituacionVuelo | aterrizarVuelo() | 3 |  |
| 10 | gestor:GestorSituacionVuelo | gestor:GestorSituacionVuelo | buscarVuelosEnZona() | 4 |  |
| 11 | gestor:GestorSituacionVuelo | vuelos:Vuelo | *obtenerEstadoActual() | 4 |  |
| 12 | vuelos:Vuelo | cambios:CambioEstadoVuelo | *esEstadoActual() | 4 |  |
| 13 | vuelos:Vuelo | actual:CambioEstadoVuelo | esEstadoEnZona() | 4 |  |
| 14 | actual:CambioEstadoVuelo | estado:Estado | esEstadoEnZona() | 4 |  |
| 15 | actual:CambioEstadoVuelo | estado:Estado | getNombre() | 4 |  |
| 16 | gestor:GestorSituacionVuelo | gestor:GestorSituacionVuelo | obtenerInfoVuelosEnZona() | 4 |  |
| 17 | gestor:GestorSituacionVuelo | vuelos:Vuelo | *obtenerNroVuelo() | 4 |  |
| 18 | vuelos:Vuelo | definicion:DefinicionDeVuelo | getNroVuelo() | 4 |  |
| 19 | gestor:GestorSituacionVuelo | vuelos:Vuelo | *getFechaHoraPartidaProgramada() | 4 |  |
| 20 | gestor:GestorSituacionVuelo | pantalla:PantSituacionVuelo | mostrarVuelosActualizar() | 4 |  |
| 21 | actor | pantalla:PantSituacionVuelo | tomarSeleccionVuelo() | 5 |  |
| 22 | pantalla:PantSituacionVuelo | gestor:GestorSituacionVuelo | tomarVueloElegido() | 5 |  |
| 23 | gestor:GestorSituacionVuelo | pantalla:PantSituacionVuelo | pedirConfirmacionAterrizarVuelo() | 6 |  |
| 24 | actor | pantalla:PantSituacionVuelo | tomarConfAterrizarVuelo() | 7 |  |
| 25 | pantalla:PantSituacionVuelo | gestor:GestorSituacionVuelo | tomarConfAterrizajeVuelo() | 7 |  |
| 26 | gestor:GestorSituacionVuelo | gestor:GestorSituacionVuelo | aterrizarVuelo() | 8 |  |
| 27 | gestor:GestorSituacionVuelo | gestor:GestorSituacionVuelo | obtenerFechaHoraActual() | 8 |  |
| 28 | gestor:GestorSituacionVuelo | gestor:GestorSituacionVuelo | obtenerUsuarioSesion() | 8 |  |
| 29 | gestor:GestorSituacionVuelo | sesion:Sesion | obtenerEmpleado() | 8 |  |
| 30 | sesion:Sesion | empleado:Empleado | getNombreCompleto() | 8 |  |
| 31 | gestor:GestorSituacionVuelo | gestor:GestorSituacionVuelo | buscarEstadoAterrizado() | 8 |  |
| 32 | gestor:GestorSituacionVuelo | vuelos:Vuelo | *esAterrizado() | 8 |  |
| 33 | gestor:GestorSituacionVuelo | gestor:GestorSituacionVuelo | registrarAterrizajeVuelo() | 8 |  |
| 34 | gestor:GestorSituacionVuelo | elegido:Vuelo | aterrizar() | 8 |  |
| 35 | elegido:Vuelo | actual:CambioEstadoVuelo | setFechaHoraFin() | 8 |  |
| 36 | elegido:Vuelo | elegido:Vuelo | crearCambioEstadoVuelo() | 8 |  |
| 37 | elegido:Vuelo | nuevo:CambioEstadoVuelo | new() | 8 |  |
| 38 | gestor:GestorSituacionVuelo | pantallaEstados:PantallaEstadosDeVuelo | actualizarEstadoVuelos() | 8 |  |
| 39 | gestor:GestorSituacionVuelo | pantallaConsulta:PantallaConsultarDisponibilidad | actualizarEstadoVuelos() | 8 |  |
| 40 | gestor:GestorSituacionVuelo | gestor:GestorSituacionVuelo | finCU() |  |  |
- `loop [mientras haya estado]`: mensajes 5–6
- `loop [mientras haya vuelos]`: mensajes 11–15
- `loop [mientras haya vuelos]`: mensajes 17–19

## DTE Vuelo

| Desde | Hacia | Evento | Acción | CU |
|---|---|---|---|---|
| EnEjecucion.EnZona | EnEjecucion.Aterrizado | Actualizar situación de vuelo | /aterrizar() | CU3 |

## Resultado del validador (0)

Sin violaciones.
