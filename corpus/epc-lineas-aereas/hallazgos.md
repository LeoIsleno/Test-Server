# Hallazgos — EPC Líneas Aéreas v1.35

Lectura manual de las imágenes del PDF (resolución limitada). Son **candidatos**: hay
que confirmarlos contra el original y, si es posible, con la cátedra. Puede que algunos
sean simplificaciones didácticas intencionales. Sirven como **casos de prueba del
validador**: debe detectarlos (o el esquema debe poder marcarlos como aceptados).

| # | Dónde | Observación | Regla |
|---|---|---|---|
| H1 | CU2 pág. 8 vs pág. 9 | La versión extendida del paso 2 lista vuelos "demorados, programados, en embarque y reprogramados"; la abreviada agrega "y/o en ejecución". La RN7 ("cancelable hasta que aterrice") y la submáquina `EnEjecucion` (cancelar desde EnDespegue / EnAire / EnZona) coinciden con la abreviada. | DT-03 |
| H2 | Realización CU2 (págs. 15/17) vs vista de clases CU2 (pág. 18) | `elegido:Vuelo` recibe `cancelar()` y `crearCambioEstadoVuelo()`, pero la clase `Vuelo` de la vista de clases de CU2 no lista esos métodos (sí aparecen en la vista de CU3, pág. 20). | RC-01 |
| H3 | Comunicación CU2 (pág. 15) vs vista de clases CU2 (pág. 18) | El gestor se envía `notificar()` (msg 46), pero la clase `GestorCancelacionVuelo` declara `notificarEstadoVuelo()`. En el diseño Observer (pág. 22) aparecen ambos. | RC-01 |
| H4 | Vista de clases CU2 (pág. 18) vs pseudocódigo Observer (pág. 25) | El gestor guarda la selección de vuelo (`tomarVuelo()`), pero no tiene atributo para el vuelo elegido; en el pseudocódigo de diseño sí: `private Vuelo vuelo`. | RC-05 |
| H5 | Observer estructura (pág. 22) vs pseudocódigo (pág. 25) | `suscribir/quitar` reciben `IObservadorVuelo[]` en el diagrama y un `IObservadorVuelo` en el pseudocódigo. | PT-02 |
| H7 | DTE Vuelo (pág. 21) vs CU2 págs. 8–9 | **Encontrado por el validador.** El DTE permite cancelar desde `Cerrado`, pero ninguna versión del CU lo enumera entre los vuelos cancelables. (Confirmar la lectura de esa transición en el original.) | DT-03 |
| H8 | Secuencia CU2 (pág. 17) vs vista de clases (pág. 18) | **Encontrado por el validador.** `origen:Aeropuerto` le pide `getNombre()` a `Ciudad`, pero la asociación navegable es `Ciudad → Aeropuerto`. La vista muestra además una dependencia punteada; definir cómo representa la cátedra ese acceso. | RC-03 (A) |
| H9 | CU1 comunicación msg 43 (pág. 13) vs vista de clases (pág. 14) | El gestor llama `habilitarFlexibilidadHorarios()`; la pantalla declara `habilitarHorariosYFlexibilidad()`. Mismo concepto, distinto nombre. | RC-01 |
| H10 | CU1 msg 50 vs pág. 14 | El mensaje es `cantidadPasajerosPorTipoIndicado()`; la clase declara `cantidadPasajerosProTipoIndicado()` (probable errata "Pro"). | RC-01 |
| H11 | CU1 msgs 63 y 67 vs pág. 14 | `DefinicionDeVuelo` le envía `getCiudad()` a `Aeropuerto`, que no lo tiene (tiene `getNombreCiudad()` / `deQueCiudad()`). **Lectura dudosa** del número/rótulo en la imagen. | RC-01 |
| H12 | CU1 msg 73 vs pág. 14 | `obtenerCapacidadSegunClase()` llega a `TipoAeronave`, que declara `obtenerCapacidadPorTipoClase()`. | RC-01 |
| H13 | CU1 msgs 78 y 81 vs pág. 14 | El gestor se envía `determinarDisponibilidadSegunCantidad()` y `calcularImporteTotal()`, que no están en la clase del gestor. | RC-01 |
| H14 | CU1 msgs 13–38 | La realización intercala origen/destino (país origen → provincias origen → país destino …) mientras el CU agrupa ("selecciona país de origen y de destino"). Es un patrón habitual de la cátedra → motivó bajar CR-03 a advertencia. | CR-03 (A) |
| — | CU3 (págs. 10, 19, 20) | **Sin violaciones**: realización y vista de clases consistentes. Observación de criterio (no la detecta ninguna regla): `buscarEstadoAterrizado()` pregunta `*esAterrizado()` a los `Vuelo` en lugar de a los `Estado`, a diferencia de CU2 (`*esCancelado()` a `Estado`). | — |
| H6 | Observer (págs. 22/25) | `ISujetoVuelo` es interfaz pero declara el atributo `observadores`. Probablemente simplificación didáctica (en Java una interfaz no tiene atributos de instancia); a confirmar cómo lo acepta la cátedra. | PT-02 (A) |

## Por qué esto importa para el proyecto
Si el material oficial contiene inconsistencias, el agente **no puede tomar el corpus
como verdad absoluta**: el validador debe poder señalar el problema y el esquema debe
permitir anotar "aceptado por la cátedra" cuando sea intencional. Es además un buen
argumento para la defensa: el sistema detecta errores que pasan en revisión humana.
