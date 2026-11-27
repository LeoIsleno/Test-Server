# Ficha de transcripción — CU2 Cancelar Vuelo

- **Fuente:** EPC Líneas Aéreas v1.35, págs. 8-9 (CU), 15 (comunicación), 17 (secuencia), 18 (clases), 21-22 (DTE)
- **Estado:** borrador
- **Generada desde:** `corpus/epc-lineas-aereas/modelo/cu2-cancelar-vuelo.json`

> Revisar cada tabla contra el PDF. Marcar errores de lectura y corregirlos en el JSON (no en esta ficha).

## CU2 — Cancelar Vuelo (actor: EncargadoNavegacion)

| Paso | Quién | Texto |
|---|---|---|
| 1 | Actor | selecciona la opción Cancelar Vuelo |
| 2 | Sistema | muestra los vuelos posibles de cancelar (número, origen, destino, horario) |
| 3 | Actor | selecciona un vuelo |
| 4 | Sistema | requiere seleccionar un motivo de cancelación |
| 5 | Actor | selecciona un motivo de cancelación |
| 6 | Sistema | solicita ingresar una descripción |
| 7 | Actor | ingresa la descripción |
| 8 | Sistema | solicita confirmar la cancelación |
| 9 | Actor | confirma la cancelación |
| 10 | Sistema | registra motivo, descripción, fecha, hora y usuario responsable; actualiza el estado a Cancelado y notifica a los interesados |

## Clases

| Clase | Estereotipo | Atributos | Métodos |
|---|---|---|---|
| PantallaCancelacionVuelo | boundary | areaTextoDescripcion, gestorCancelacion, listadoDeVuelos, listaMotivosCancelacion, opcionCancelar, opcionConfirmar | habilitarVentana(), mostrarInfoVuelos(), mostrarMotivosCancelacion(), opcionCancelarVuelo(), pedirConfirmacionCancelacion(), pedirIngresoDescripcion(), tomarConfCancelacion(), tomarIngresoDescripcion(), tomarSeleccionMotivoCancelacion(), tomarSeleccionVuelo() |
| GestorCancelacionVuelo | control | descripcion, estado, motivoCancelacion, pantallaCancelacionVuelo, sesion | buscarEstadoCancelacion(), buscarVueloFactibleCancelar(), cancelarVuelo(), finCU(), listarMotivosCancelacion(), notificarEstadoVuelo(), nuevaCancelacion(), obtenerFechaYHoraActual(), obtenerUsuarioSesion(), registrarCancelacion(), tomarConfCancelacion(), tomarDescripcion(), tomarMotivoCancelacion(), tomarVuelo() |
| Vuelo | entity | fecha, horaPartidaProgramada | esAterrizado(), esFactibleCancelar(), getFecha(), getFechaHoraPartidaProgramada(), getHoraPartidaProgramada(), mostrarDatosDefinicion(), mostrarDatosVuelo(), obtenerEstadoActual(), obtenerNroVuelo() |
| CambioEstadoVuelo | entity | comentario, fechaHoraFin, fechaHoraInicio | esCancelable(), esEstadoActual(), esEstadoEnZona(), getEmpleado(), getEstado(), getFechaHoraFin(), getMotivoCancelacion(), getSesion(), new(), setFechaHoraFin() |
| Estado | entity | descripcion, esCancelable, esFinal, nombre | esCancelado(), esEstadoEnZona(), esEstadoFinal(), getCancelable(), getFinal(), getNombre(), permiteCancelacion(), setCancelable(), setFinal(), setNombre() |
| MotivoCancelacion | entity | descripcion | getDescripcion() |
| Sesion | entity | fechaHora | obtenerEmpleado() |
| DefinicionDeVuelo | entity | duracion, horarioPartida, nroVuelo, tiempoEmbarque | getNroVuelo(), getTipoAeroNave(), mostrarCiudadDestino(), mostrarCiudadOrigen() |
| Aeropuerto | entity | codigo, direccion, nombre | deQueCiudad(), getNombre(), getNombreCiudad() |
| Ciudad | entity | codigo, nombre | getAeropuerto(), getNombre() |
| Empleado | entity | apellido, nombre | getCargo(), getNombreCompleto() |
| PantallaEstadosDeVuelo | boundary | estado, fechaVuelo, horaVuelo, nroVuelo | actualizarEstadoVuelos(), buscarVuelo(), setEstadoVuelo(), setFecha(), setHora(), setNroVuelo() |
| PantallaConsultarDisponibilidad | boundary | estado, fechaVuelo, horaVuelo, nroVuelo | actualizarEstadoVuelos(), buscarVuelo(), setEstadoVuelo(), setFecha(), setHora() |

## Relaciones

| Desde | Hacia | Rol | Multiplicidad |
|---|---|---|---|
| Vuelo | CambioEstadoVuelo | cambioEstadoVuelo | 1..* |
| Vuelo | DefinicionDeVuelo | definicionDeVuelo | 1 |
| CambioEstadoVuelo | Estado | estado | 1 |
| CambioEstadoVuelo | MotivoCancelacion | motivo | 0..1 |
| CambioEstadoVuelo | Empleado | empleado | 1 |
| DefinicionDeVuelo | Aeropuerto | origen | 1 |
| DefinicionDeVuelo | Aeropuerto | destino | 1 |
| Ciudad | Aeropuerto | aeropuerto | 0..* |

## Realización CU2 — secuencia, curso normal (pág. 17)

| # | Desde | Hacia | Mensaje | Paso CU | Nota |
|---|---|---|---|---|---|
| 1 | actor | pantalla:PantallaCancelacionVuelo | opcionCancelarVuelo() | 1 |  |
| 2 | pantalla:PantallaCancelacionVuelo | pantalla:PantallaCancelacionVuelo | habilitarVentana() | 1 |  |
| 3 | pantalla:PantallaCancelacionVuelo | gestor:GestorCancelacionVuelo | nuevaCancelacion() | 1 |  |
| 4 | gestor:GestorCancelacionVuelo | gestor:GestorCancelacionVuelo | buscarVueloFactibleCancelar() | 2 |  |
| 5 | gestor:GestorCancelacionVuelo | vuelos:Vuelo | *esFactibleCancelar() | 2 |  |
| 6 | vuelos:Vuelo | vuelos:Vuelo | obtenerEstadoActual() | 2 |  |
| 7 | vuelos:Vuelo | cambios:CambioEstadoVuelo | *esEstadoActual() | 2 |  |
| 8 | vuelos:Vuelo | actual:CambioEstadoVuelo | esCancelable() | 2 |  |
| 9 | actual:CambioEstadoVuelo | estado:Estado | permiteCancelacion() | 2 |  |
| 10 | gestor:GestorCancelacionVuelo | vuelos:Vuelo | *mostrarDatosVuelo() | 2 |  |
| 11 | vuelos:Vuelo | vuelos:Vuelo | getFecha() | 2 |  |
| 12 | vuelos:Vuelo | vuelos:Vuelo | getHoraPartidaProgramada() | 2 |  |
| 13 | vuelos:Vuelo | vuelos:Vuelo | mostrarDatosDefinicion() | 2 |  |
| 14 | vuelos:Vuelo | definicion:DefinicionDeVuelo | getNroVuelo() | 2 |  |
| 15 | vuelos:Vuelo | definicion:DefinicionDeVuelo | mostrarCiudadOrigen() | 2 |  |
| 16 | definicion:DefinicionDeVuelo | origen:Aeropuerto | getNombreCiudad() | 2 |  |
| 17 | origen:Aeropuerto | ciudadOrigen:Ciudad | getNombre() | 2 |  |
| 18 | vuelos:Vuelo | definicion:DefinicionDeVuelo | mostrarCiudadDestino() | 2 |  |
| 19 | definicion:DefinicionDeVuelo | destino:Aeropuerto | getNombreCiudad() | 2 |  |
| 20 | destino:Aeropuerto | ciudadDestino:Ciudad | getNombre() | 2 |  |
| 21 | gestor:GestorCancelacionVuelo | pantalla:PantallaCancelacionVuelo | mostrarInfoVuelos() | 2 |  |
| 22 | actor | pantalla:PantallaCancelacionVuelo | tomarSeleccionVuelo() | 3 |  |
| 23 | pantalla:PantallaCancelacionVuelo | gestor:GestorCancelacionVuelo | tomarVuelo() | 3 |  |
| 24 | gestor:GestorCancelacionVuelo | gestor:GestorCancelacionVuelo | listarMotivosCancelacion() | 4 |  |
| 25 | gestor:GestorCancelacionVuelo | motivos:MotivoCancelacion | *getDescripcion() | 4 |  |
| 26 | gestor:GestorCancelacionVuelo | pantalla:PantallaCancelacionVuelo | mostrarMotivosCancelacion() | 4 |  |
| 27 | actor | pantalla:PantallaCancelacionVuelo | tomarSeleccionMotivoCancelacion() | 5 |  |
| 28 | pantalla:PantallaCancelacionVuelo | gestor:GestorCancelacionVuelo | tomarMotivoCancelacion() | 5 |  |
| 29 | gestor:GestorCancelacionVuelo | pantalla:PantallaCancelacionVuelo | pedirIngresoDescripcion() | 6 |  |
| 30 | actor | pantalla:PantallaCancelacionVuelo | tomarIngresoDescripcion() | 7 |  |
| 31 | pantalla:PantallaCancelacionVuelo | gestor:GestorCancelacionVuelo | tomarDescripcion() | 7 |  |
| 32 | gestor:GestorCancelacionVuelo | pantalla:PantallaCancelacionVuelo | pedirConfirmacionCancelacion() | 8 |  |
| 33 | actor | pantalla:PantallaCancelacionVuelo | tomarConfCancelacion() | 9 |  |
| 34 | pantalla:PantallaCancelacionVuelo | gestor:GestorCancelacionVuelo | tomarConfCancelacion() | 9 |  |
| 35 | gestor:GestorCancelacionVuelo | gestor:GestorCancelacionVuelo | cancelarVuelo() | 10 |  |
| 36 | gestor:GestorCancelacionVuelo | gestor:GestorCancelacionVuelo | obtenerFechaYHoraActual() | 10 |  |
| 37 | gestor:GestorCancelacionVuelo | gestor:GestorCancelacionVuelo | obtenerUsuarioSesion() | 10 |  |
| 38 | gestor:GestorCancelacionVuelo | sesion:Sesion | obtenerEmpleado() | 10 |  |
| 39 | gestor:GestorCancelacionVuelo | gestor:GestorCancelacionVuelo | buscarEstadoCancelacion() | 10 |  |
| 40 | gestor:GestorCancelacionVuelo | estados:Estado | *esCancelado() | 10 |  |
| 41 | gestor:GestorCancelacionVuelo | gestor:GestorCancelacionVuelo | registrarCancelacion() | 10 |  |
| 42 | gestor:GestorCancelacionVuelo | elegido:Vuelo | cancelar() | 10 | H2 |
| 43 | elegido:Vuelo | actual:CambioEstadoVuelo | setFechaHoraFin() | 10 |  |
| 44 | elegido:Vuelo | elegido:Vuelo | crearCambioEstadoVuelo() | 10 | H2 |
| 45 | elegido:Vuelo | cancelado:CambioEstadoVuelo | new() | 10 |  |
| 46 | gestor:GestorCancelacionVuelo | gestor:GestorCancelacionVuelo | notificar() | 10 | H3 |
| 47 | gestor:GestorCancelacionVuelo | pantallaEstados:PantallaEstadosDeVuelo | actualizarEstadoVuelos() | 10 |  |
| 48 | gestor:GestorCancelacionVuelo | pantallaConsulta:PantallaConsultarDisponibilidad | actualizarEstadoVuelos() | 10 |  |
| 49 | gestor:GestorCancelacionVuelo | gestor:GestorCancelacionVuelo | finCU() |  |  |
- `loop [mientras haya vuelos]`: mensajes 5–20
- `loop [mientras haya pantallas]`: mensajes 47–47

## DTE Vuelo

| Desde | Hacia | Evento | Acción | CU |
|---|---|---|---|---|
| Programado | Cancelado | Cancelar Vuelo | /cancelar() | CU2 |
| Reprogramado | Cancelado | Cancelar Vuelo | /cancelar() | CU2 |
| Demorado | Cancelado | Cancelar Vuelo | /cancelar() | CU2 |
| EnEmbarque | Cancelado | Cancelar Vuelo | /cancelar() | CU2 |
| Cerrado | Cancelado | Cancelar Vuelo | /cancelar() | CU2 |
| EnEjecucion.EnDespegue | Cancelado | Cancelar Vuelo | /cancelar() | CU2 |
| EnEjecucion.EnAire | Cancelado | Cancelar Vuelo | /cancelar() | CU2 |
| EnEjecucion.EnZona | Cancelado | Cancelar Vuelo | /cancelar() | CU2 |

## Resultado del validador (7)

- **RC-01** (bloqueante) CU2 secuencia, msg 42 (gestor:GestorCancelacionVuelo → elegido:Vuelo): Vuelo no tiene el método cancelar()
- **RC-01** (bloqueante) CU2 secuencia, msg 44 (elegido:Vuelo → elegido:Vuelo): Vuelo no tiene el método crearCambioEstadoVuelo()
- **RC-01** (bloqueante) CU2 secuencia, msg 46 (gestor:GestorCancelacionVuelo → gestor:GestorCancelacionVuelo): GestorCancelacionVuelo no tiene el método notificar()
- **RC-03** (advertencia) CU2 secuencia, msg 17 getNombre(): Aeropuerto envía mensajes a Ciudad pero no hay relación navegable Aeropuerto → Ciudad (sólo existe Ciudad → Aeropuerto)
- **DT-01** (bloqueante) DTE Vuelo, transiciones Programado→Cancelado, Reprogramado→Cancelado, Demorado→Cancelado, EnEmbarque→Cancelado, Cerrado→Cancelado, EnEjecucion.EnDespegue→Cancelado, EnEjecucion.EnAire→Cancelado, EnEjecucion.EnZona→Cancelado: La acción /cancelar() no es un método de Vuelo
- **DT-03** (bloqueante) CU2 (extendida, pág. 8, paso 2) vs DTE Vuelo: El DTE permite "Cancelar Vuelo" desde Cerrado, EnEjecucion, que el CU no menciona. 
- **DT-03** (bloqueante) CU2 (abreviada, pág. 9, paso 2) vs DTE Vuelo: El DTE permite "Cancelar Vuelo" desde Cerrado, que el CU no menciona. 
