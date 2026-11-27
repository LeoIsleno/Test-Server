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
| H6 | Observer (págs. 22/25) | `ISujetoVuelo` es interfaz pero declara el atributo `observadores`. Probablemente simplificación didáctica (en Java una interfaz no tiene atributos de instancia); a confirmar cómo lo acepta la cátedra. | PT-02 (A) |

## Por qué esto importa para el proyecto
Si el material oficial contiene inconsistencias, el agente **no puede tomar el corpus
como verdad absoluta**: el validador debe poder señalar el problema y el esquema debe
permitir anotar "aceptado por la cátedra" cuando sea intencional. Es además un buen
argumento para la defensa: el sistema detecta errores que pasan en revisión humana.
