# Ficha de transcripción — CU1 Consultar disponibilidad de vuelos

- **Fuente:** EPC Líneas Aéreas v1.35, págs. 4-6 (CU, curso normal abreviado), 13 (comunicación, 86 mensajes), 14 (vista de clases)
- **Estado:** borrador
- **Generada desde:** `corpus/epc-lineas-aereas/modelo/cu1-consultar-disponibilidad.json`

> Revisar cada tabla contra el PDF. Marcar errores de lectura y corregirlos en el JSON (no en esta ficha).

## CU1 — Consultar disponibilidad de vuelos (actor: Pasajero)

| Paso | Quién | Texto |
|---|---|---|
| 1 | Actor | selecciona la opción Consultar disponibilidad de vuelos |
| 2 | Sistema | requiere que se indique el Tipo de Vuelo |
| 3 | Actor | selecciona Tipo de Vuelo = Sólo Ida |
| 4 | Sistema | requiere País de Origen y de Destino |
| 5 | Actor | selecciona País de Origen y de Destino |
| 6 | Sistema | obtiene las Provincias de los Países seleccionados y requiere Provincia de Origen y de Destino |
| 7 | Actor | selecciona Provincia de Origen y de Destino |
| 8 | Sistema | muestra Ciudades de las Provincias seleccionadas y requiere Ciudad de Origen y de Destino |
| 9 | Actor | selecciona Ciudad de Origen y de Destino |
| 10 | Sistema | solicita si admite flexibilidad en horarios habilitando el ingreso de una fecha |
| 11 | Actor | indica que es flexible e indica una fecha |
| 12 | Sistema | solicita la Cantidad de Pasajeros por Tipo de Clase |
| 13 | Actor | indica la Cantidad de Pasajeros por Tipo de Clase |
| 14 | Sistema | permite confirmar la búsqueda |
| 15 | Actor | confirma la búsqueda |
| 16 | Sistema | verifica que los datos requeridos estén completos |
| 17 | Sistema | verifica flexibilidad: HorarioDesde = 0:00, HorarioHasta = 23:59 |
| 18 | Sistema | verifica Sólo Ida y busca vuelos por ciudad de origen y destino, fecha, horario y butacas disponibles (reservas vigentes y capacidad de la aeronave) |
| 19 | Sistema | muestra para cada vuelo: horario y aeropuerto de salida, horario y aeropuerto de llegada, número, duración e importe total |

## Clases

| Clase | Estereotipo | Atributos | Métodos |
|---|---|---|---|
| PantallaConsultarDisponibilidad | boundary | estado, fechaVuelo, flexibilidad, horaDesde, horaHasta, horaVuelo, listadoCiudadesDestino, listadoCiudadesOrigen, listadoPaisesDestino, listadoPaisesOrigen, listadoPciasDestino, listadoPciasOrigen, listaTiposDeVuelo, nroVuelo, opcionCancelar, opcionConfirmar | confirmar(), habilitarHorariosYFlexibilidad(), habilitarPantalla(), ingresoCantidadPorClase(), listarCiudadesDestino(), listarCiudadesOrigen(), listarPaisesDestino(), listarPaisesOrigen(), listarProvinciasDestino(), listarProvinciasOrigen(), mostrarVuelosDisponibles(), opcionConsultaDispVuelos(), seleccionCiudadDestino(), seleccionCiudadOrigen(), seleccionFechaYFlexibilidad(), seleccionPaisDestino(), seleccionPaisOrigen(), seleccionProvinciaDestino(), seleccionProvinciaOrigen(), seleccionTipoVuelo(), solicitarCantidadPasajerosPorClase(), solicitarConfirmacion(), solicitarSeleccionTipoVuelo() |
| GestorDeConsultaDisponibilidad | control | cantidadIndicada, ciudadDestinoSeleccionada, ciudadOrigenSeleccionada, fechaHoraDesde, fechaHoraHasta, flexibilidadHoraria, paisDestinoSeleccionado, paisOrigenSeleccionado, paisSeleccionado, pciaDestinoSeleccionada, pciaOrigenSeleccionada, tipoDeClaseSeleccionada, tipoVueloSeleccionado | buscarVuelosParaFechaYDestino(), cantidadPasajerosProTipoIndicado(), ciudadDestinoSeleccionada(), ciudadOrigenSeleccionada(), consultarDispVuelos(), determinarHoraDesdeYHasta(), finCasoDeUso(), obtenerCiudadesPciaDestino(), obtenerCiudadesPciaOrigen(), obtenerPaises(), obtenerProvinciasPaisDestino(), obtenerProvinciasPaisOrigen(), obtenerTiposDeClase(), obtenerTiposDeVuelo(), paisDestinoSeleccionado(), paisOrigenSeleccionado(), pciaDestinoSeleccionada(), pciaOrigenSeleccionada(), seleccionFechaYFlexibilidad(), tipoVueloSeleccionado(), tomarConfirmacion(), verificarDatosRequeridos(), verificarDisponibilidadParaVuelo(), verificarTipoVuelo() |
| Vuelo | entity | fecha, horaPartidaProgramada | calcularDisponibilidad(), enZona(), esAterrizado(), esDeFechaYHoraYDestino(), esFactibleCancelar(), getCambioEstadoVuelo(), getDefinicionVuelo(), getFecha(), getFechaHoraPartidaProgramada(), getHoraPartidaProgramada(), getReserva(), mostrarDatosDefinicion(), mostrarDatosVuelo(), new(), obtenerCiudadDestino(), obtenerCiudadOrigen(), obtenerDisponibilidadPorClase(), obtenerDuracion(), obtenerEstadoActual(), obtenerNroVuelo(), obtenerReservasSegunClase(), obtenerTarifaSegunClase() |
| DefinicionDeVuelo | entity | duracion, horarioPartida, nroVuelo, tiempoEmbarque | getAeropuertoDestino(), getAeropuertoOrigen(), getDiaSemana(), getDuracion(), getNroVuelo(), getTarifa(), getTipoAeroNave(), mostrarCiudadDestino(), mostrarCiudadOrigen(), obtenerCapacidadSegunClase(), obtenerTarifaSegunClase() |
| Aeropuerto | entity | codigo, direccion, nombre | deQueCiudad(), getNombre(), getNombreCiudad() |
| Ciudad | entity | codigo, nombre | getAeropuerto(), getNombre() |
| Provincia | entity | nombre | getCiudad(), getNombre(), obtenerAeropuertosProvincia() |
| Pais | entity | nombre | getNombre(), getProvincia(), obtenerAeropuertosPais(), obtenerCiudadesDePcia(), setNombre() |
| TipoAeronave | entity | capacidad, descripcion, nombre | getCapacidad(), obtenerCapacidadPorTipoClase() |
| Capacidad | entity | cantidad | esDeTipoClase(), getCantidad(), getTipoClase() |
| Tarifa | entity | importe | getImporte(), getTipoClase(), obtenerCapacidadSegunClase() |
| Reserva | entity | fechaYHoraCreada, fechaYHoraVto, nroReserva | esDeTipoClaseYFecha(), estaVigente(), getTipoClase() |
| TipoClase | entity | nombre | getNombre(), setNombre() |
| TipoVuelo | entity |  | getNombre() |

## Relaciones

| Desde | Hacia | Rol | Multiplicidad |
|---|---|---|---|
| DefinicionDeVuelo | Aeropuerto | destino | 1 |
| DefinicionDeVuelo | Aeropuerto | origen | 1 |
| Ciudad | Aeropuerto | aeropuerto | 0..* |
| Provincia | Ciudad | ciudad | 1..* |
| Pais | Provincia | provincia | 1..* |
| DefinicionDeVuelo | TipoAeronave | tipoAeronave | 1 |
| DefinicionDeVuelo | Tarifa | tarifa | 1..* |
| TipoAeronave | Capacidad | capacidad | 1..* |
| Reserva | TipoClase | tipoClase | 1 |
| Tarifa | TipoClase | tipoClase | 1 |
| Capacidad | TipoClase | tipoClase | 1 |
| Vuelo | DefinicionDeVuelo | definicionDeVuelo | 1 |
| Vuelo | Reserva | reserva | 0..* |

## Realización CU1 — comunicacion, curso normal (pág. 13)

| # | Desde | Hacia | Mensaje | Paso CU | Nota |
|---|---|---|---|---|---|
| 1 | actor | pantalla:PantallaConsultarDisponibilidad | opcionConsultaDispVuelos() | 1 |  |
| 2 | pantalla:PantallaConsultarDisponibilidad | pantalla:PantallaConsultarDisponibilidad | habilitarPantalla() | 1 |  |
| 3 | pantalla:PantallaConsultarDisponibilidad | gestor:GestorDeConsultaDisponibilidad | consultarDispVuelos() | 1 |  |
| 4 | gestor:GestorDeConsultaDisponibilidad | gestor:GestorDeConsultaDisponibilidad | obtenerTiposDeVuelo() | 2 |  |
| 5 | gestor:GestorDeConsultaDisponibilidad | tiposVuelo:TipoVuelo | *getNombre() | 2 |  |
| 6 | gestor:GestorDeConsultaDisponibilidad | pantalla:PantallaConsultarDisponibilidad | solicitarSeleccionTipoVuelo() | 2 |  |
| 7 | actor | pantalla:PantallaConsultarDisponibilidad | seleccionTipoVuelo() | 3 |  |
| 8 | pantalla:PantallaConsultarDisponibilidad | gestor:GestorDeConsultaDisponibilidad | tipoVueloSeleccionado() | 3 |  |
| 9 | gestor:GestorDeConsultaDisponibilidad | gestor:GestorDeConsultaDisponibilidad | obtenerPaises() | 4 |  |
| 10 | gestor:GestorDeConsultaDisponibilidad | paises:Pais | *getNombre() | 4 |  |
| 11 | gestor:GestorDeConsultaDisponibilidad | pantalla:PantallaConsultarDisponibilidad | listarPaisesOrigen() | 4 |  |
| 12 | gestor:GestorDeConsultaDisponibilidad | pantalla:PantallaConsultarDisponibilidad | listarPaisesDestino() | 4 |  |
| 13 | actor | pantalla:PantallaConsultarDisponibilidad | seleccionPaisOrigen() | 5 |  |
| 14 | pantalla:PantallaConsultarDisponibilidad | gestor:GestorDeConsultaDisponibilidad | paisOrigenSeleccionado() | 5 |  |
| 15 | gestor:GestorDeConsultaDisponibilidad | gestor:GestorDeConsultaDisponibilidad | obtenerProvinciasPaisOrigen() | 6 |  |
| 16 | gestor:GestorDeConsultaDisponibilidad | paisOrigenSel:Pais | getProvincia() | 6 |  |
| 17 | paisOrigenSel:Pais | provincias:Provincia | *getNombre() | 6 |  |
| 18 | gestor:GestorDeConsultaDisponibilidad | pantalla:PantallaConsultarDisponibilidad | listarProvinciasOrigen() | 6 |  |
| 19 | actor | pantalla:PantallaConsultarDisponibilidad | seleccionPaisDestino() | 5 |  |
| 20 | pantalla:PantallaConsultarDisponibilidad | gestor:GestorDeConsultaDisponibilidad | paisDestinoSeleccionado() | 5 |  |
| 21 | gestor:GestorDeConsultaDisponibilidad | gestor:GestorDeConsultaDisponibilidad | obtenerProvinciasPaisDestino() | 6 |  |
| 22 | gestor:GestorDeConsultaDisponibilidad | paisDestinoSel:Pais | getProvincia() | 6 |  |
| 23 | paisDestinoSel:Pais | provincias:Provincia | *getNombre() | 6 |  |
| 24 | gestor:GestorDeConsultaDisponibilidad | pantalla:PantallaConsultarDisponibilidad | listarProvinciasDestino() | 6 |  |
| 25 | actor | pantalla:PantallaConsultarDisponibilidad | seleccionProvinciaOrigen() | 7 |  |
| 26 | pantalla:PantallaConsultarDisponibilidad | gestor:GestorDeConsultaDisponibilidad | pciaOrigenSeleccionada() | 7 |  |
| 27 | gestor:GestorDeConsultaDisponibilidad | gestor:GestorDeConsultaDisponibilidad | obtenerCiudadesPciaOrigen() | 8 |  |
| 28 | gestor:GestorDeConsultaDisponibilidad | paisOrigenSel:Pais | obtenerCiudadesDePcia() | 8 |  |
| 29 | paisOrigenSel:Pais | pciaOrigenSel:Provincia | getCiudad() | 8 |  |
| 30 | pciaOrigenSel:Provincia | ciudades:Ciudad | *getNombre() | 8 |  |
| 31 | gestor:GestorDeConsultaDisponibilidad | pantalla:PantallaConsultarDisponibilidad | listarCiudadesOrigen() | 8 |  |
| 32 | actor | pantalla:PantallaConsultarDisponibilidad | seleccionProvinciaDestino() | 7 |  |
| 33 | pantalla:PantallaConsultarDisponibilidad | gestor:GestorDeConsultaDisponibilidad | pciaDestinoSeleccionada() | 7 |  |
| 34 | gestor:GestorDeConsultaDisponibilidad | gestor:GestorDeConsultaDisponibilidad | obtenerCiudadesPciaDestino() | 8 |  |
| 35 | gestor:GestorDeConsultaDisponibilidad | paisDestinoSel:Pais | obtenerCiudadesDePcia() | 8 |  |
| 36 | paisDestinoSel:Pais | pciaDestinoSel:Provincia | getCiudad() | 8 |  |
| 37 | pciaDestinoSel:Provincia | ciudades:Ciudad | *getNombre() | 8 |  |
| 38 | gestor:GestorDeConsultaDisponibilidad | pantalla:PantallaConsultarDisponibilidad | listarCiudadesDestino() | 8 |  |
| 39 | actor | pantalla:PantallaConsultarDisponibilidad | seleccionCiudadOrigen() | 9 |  |
| 40 | pantalla:PantallaConsultarDisponibilidad | gestor:GestorDeConsultaDisponibilidad | ciudadOrigenSeleccionada() | 9 |  |
| 41 | actor | pantalla:PantallaConsultarDisponibilidad | seleccionCiudadDestino() | 9 |  |
| 42 | pantalla:PantallaConsultarDisponibilidad | gestor:GestorDeConsultaDisponibilidad | ciudadDestinoSeleccionada() | 9 |  |
| 43 | gestor:GestorDeConsultaDisponibilidad | pantalla:PantallaConsultarDisponibilidad | habilitarFlexibilidadHorarios() | 10 |  |
| 44 | actor | pantalla:PantallaConsultarDisponibilidad | seleccionFechaYFlexibilidad() | 11 |  |
| 45 | pantalla:PantallaConsultarDisponibilidad | gestor:GestorDeConsultaDisponibilidad | seleccionFechaYFlexibilidad() | 11 |  |
| 46 | gestor:GestorDeConsultaDisponibilidad | gestor:GestorDeConsultaDisponibilidad | obtenerTiposDeClase() | 12 |  |
| 47 | gestor:GestorDeConsultaDisponibilidad | tiposClase:TipoClase | *getNombre() | 12 |  |
| 48 | gestor:GestorDeConsultaDisponibilidad | pantalla:PantallaConsultarDisponibilidad | solicitarCantidadPasajerosPorClase() | 12 |  |
| 49 | actor | pantalla:PantallaConsultarDisponibilidad | ingresoCantidadPorClase() | 13 |  |
| 50 | pantalla:PantallaConsultarDisponibilidad | gestor:GestorDeConsultaDisponibilidad | cantidadPasajerosPorTipoIndicado() | 13 |  |
| 51 | gestor:GestorDeConsultaDisponibilidad | pantalla:PantallaConsultarDisponibilidad | solicitarConfirmacion() | 14 |  |
| 52 | actor | pantalla:PantallaConsultarDisponibilidad | confirmar() | 15 |  |
| 53 | pantalla:PantallaConsultarDisponibilidad | gestor:GestorDeConsultaDisponibilidad | tomarConfirmacion() | 15 |  |
| 54 | gestor:GestorDeConsultaDisponibilidad | gestor:GestorDeConsultaDisponibilidad | verificarDatosRequeridos() | 16 |  |
| 55 | gestor:GestorDeConsultaDisponibilidad | gestor:GestorDeConsultaDisponibilidad | determinarHoraDesdeYHasta() | 17 |  |
| 56 | gestor:GestorDeConsultaDisponibilidad | gestor:GestorDeConsultaDisponibilidad | verificarTipoVuelo() | 18 |  |
| 57 | gestor:GestorDeConsultaDisponibilidad | gestor:GestorDeConsultaDisponibilidad | buscarVuelosParaFechaYDestino() | 18 |  |
| 58 | gestor:GestorDeConsultaDisponibilidad | vuelos:Vuelo | *esDeFechaYHoraYDestino() | 18 |  |
| 59 | vuelos:Vuelo | vuelos:Vuelo | getFecha() | 18 |  |
| 60 | vuelos:Vuelo | vuelos:Vuelo | getHoraPartidaProgramada() | 18 |  |
| 61 | vuelos:Vuelo | vuelos:Vuelo | obtenerCiudadOrigen() | 18 |  |
| 62 | vuelos:Vuelo | definicion:DefinicionDeVuelo | mostrarCiudadOrigen() | 18 |  |
| 63 | definicion:DefinicionDeVuelo | origen:Aeropuerto | getCiudad() | 18 | dudosa: leído en imagen de baja resolución |
| 64 | origen:Aeropuerto | ciudades:Ciudad | getNombre() | 18 | dudosa: leído en imagen de baja resolución |
| 65 | vuelos:Vuelo | vuelos:Vuelo | obtenerCiudadDestino() | 18 |  |
| 66 | vuelos:Vuelo | definicion:DefinicionDeVuelo | mostrarCiudadDestino() | 18 |  |
| 67 | definicion:DefinicionDeVuelo | destino:Aeropuerto | getCiudad() | 18 | dudosa: leído en imagen de baja resolución |
| 68 | destino:Aeropuerto | ciudades:Ciudad | getNombre() | 18 | dudosa: leído en imagen de baja resolución |
| 69 | gestor:GestorDeConsultaDisponibilidad | gestor:GestorDeConsultaDisponibilidad | verificarDisponibilidadParaVuelo() | 18 |  |
| 70 | gestor:GestorDeConsultaDisponibilidad | vuelos:Vuelo | *calcularDisponibilidad() | 18 |  |
| 71 | vuelos:Vuelo | vuelos:Vuelo | obtenerDisponibilidadPorClase() | 18 |  |
| 72 | vuelos:Vuelo | definicion:DefinicionDeVuelo | obtenerCapacidadSegunClase() | 18 |  |
| 73 | definicion:DefinicionDeVuelo | tipoAeronave:TipoAeronave | obtenerCapacidadSegunClase() | 18 |  |
| 74 | tipoAeronave:TipoAeronave | capacidades:Capacidad | *esDeTipoClase() | 18 |  |
| 75 | tipoAeronave:TipoAeronave | capDeTipoClase:Capacidad | getCantidad() | 18 |  |
| 76 | vuelos:Vuelo | vuelos:Vuelo | obtenerReservasSegunClase() | 18 |  |
| 77 | vuelos:Vuelo | reservas:Reserva | *esDeTipoClaseYFecha() | 18 |  |
| 78 | gestor:GestorDeConsultaDisponibilidad | gestor:GestorDeConsultaDisponibilidad | determinarDisponibilidadSegunCantidad() | 18 |  |
| 79 | gestor:GestorDeConsultaDisponibilidad | vuelos:Vuelo | *obtenerDuracion() | 19 |  |
| 80 | vuelos:Vuelo | definicion:DefinicionDeVuelo | getDuracion() | 19 |  |
| 81 | gestor:GestorDeConsultaDisponibilidad | gestor:GestorDeConsultaDisponibilidad | calcularImporteTotal() | 19 |  |
| 82 | gestor:GestorDeConsultaDisponibilidad | vuelos:Vuelo | *obtenerTarifaSegunClase() | 19 |  |
| 83 | vuelos:Vuelo | definicion:DefinicionDeVuelo | obtenerTarifaSegunClase() | 19 |  |
| 84 | definicion:DefinicionDeVuelo | tarifas:Tarifa | *getImporte() | 19 |  |
| 85 | gestor:GestorDeConsultaDisponibilidad | pantalla:PantallaConsultarDisponibilidad | mostrarVuelosDisponibles() | 19 |  |
| 86 | gestor:GestorDeConsultaDisponibilidad | gestor:GestorDeConsultaDisponibilidad | finCasoDeUso() |  |  |

## Resultado del validador (9)

- **RC-01** (bloqueante) CU1 comunicacion, msg 43 (gestor:GestorDeConsultaDisponibilidad → pantalla:PantallaConsultarDisponibilidad): PantallaConsultarDisponibilidad no tiene el método habilitarFlexibilidadHorarios()
- **RC-01** (bloqueante) CU1 comunicacion, msg 50 (pantalla:PantallaConsultarDisponibilidad → gestor:GestorDeConsultaDisponibilidad): GestorDeConsultaDisponibilidad no tiene el método cantidadPasajerosPorTipoIndicado()
- **RC-01** (bloqueante) CU1 comunicacion, msg 63 (definicion:DefinicionDeVuelo → origen:Aeropuerto): Aeropuerto no tiene el método getCiudad()
- **RC-01** (bloqueante) CU1 comunicacion, msg 67 (definicion:DefinicionDeVuelo → destino:Aeropuerto): Aeropuerto no tiene el método getCiudad()
- **RC-01** (bloqueante) CU1 comunicacion, msg 73 (definicion:DefinicionDeVuelo → tipoAeronave:TipoAeronave): TipoAeronave no tiene el método obtenerCapacidadSegunClase()
- **RC-01** (bloqueante) CU1 comunicacion, msg 78 (gestor:GestorDeConsultaDisponibilidad → gestor:GestorDeConsultaDisponibilidad): GestorDeConsultaDisponibilidad no tiene el método determinarDisponibilidadSegunCantidad()
- **RC-01** (bloqueante) CU1 comunicacion, msg 81 (gestor:GestorDeConsultaDisponibilidad → gestor:GestorDeConsultaDisponibilidad): GestorDeConsultaDisponibilidad no tiene el método calcularImporteTotal()
- **RC-03** (advertencia) CU1 comunicacion, msg 64 getNombre(): Aeropuerto envía mensajes a Ciudad pero no hay relación navegable Aeropuerto → Ciudad (sólo existe Ciudad → Aeropuerto)
- **CR-03** (advertencia) CU1 comunicacion: 4 mensaje(s) fuera del orden del CU: 19 (paso 5 después del 6), 20 (paso 5 después del 6), 32 (paso 7 después del 8), 33 (paso 7 después del 8)
