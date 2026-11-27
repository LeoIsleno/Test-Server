# 02 — Modelo canónico y reglas de consistencia

Es el corazón del proyecto. Todo artefacto es una vista de este modelo.

## Esquema (borrador v0)

```jsonc
{
  "dominio": {
    "nombre": "Líneas Aéreas",
    "reglasNegocio": [{ "id": "RN7", "nombre": "Cancelación del Vuelo", "texto": "..." }]
  },
  "casosDeUso": [{
    "id": "CU2", "nombre": "Cancelar Vuelo", "actor": "EncargadoNavegacion",
    "pasos": [{ "nro": 10, "quien": "Sistema", "texto": "registra el motivo, ...",
                "reglas": ["RN7"] }],
    "alternativos": [{ "id": "A1", "texto": "No existen vuelos posibles de cancelar" }]
  }],
  "clases": [{
    "nombre": "Vuelo", "estereotipo": "entity",        // boundary | control | entity | interface
    "atributos": [{ "nombre": "fecha", "tipo": "date" }],
    "metodos":   [{ "nombre": "cancelar", "params": [], "retorno": "void",
                    "origen": ["CU2.realizacion#42", "DTE.Vuelo#cancelar"] }]
  }],
  "relaciones": [{ "desde": "Vuelo", "hacia": "CambioEstadoVuelo", "tipo": "asociacion",
                   "rol": "cambioEstadoVuelo", "mult": "1..*", "navegable": true }],
  "realizaciones": [{
    "cu": "CU2", "curso": "normal", "vista": "secuencia",   // o "comunicacion"
    "lineasDeVida": [{ "id": "elegido", "clase": "Vuelo" }],
    "mensajes": [{ "nro": 42, "desde": "gestor", "hacia": "elegido",
                   "metodo": "cancelar", "iterativo": false, "pasoCU": 10 }],
    "fragmentos": [{ "tipo": "loop", "guarda": "mientras haya vuelos", "mensajes": [5, 20] }]
  }],
  "maquinasDeEstado": [{
    "clase": "Vuelo",
    "estados": [{ "nombre": "Programado" }, { "nombre": "EnEjecucion", "compuesto": true }],
    "transiciones": [{ "desde": "Programado", "hacia": "Cancelado",
                       "evento": "Cancelar Vuelo", "guarda": null, "accion": "cancelar",
                       "cu": "CU2" }]
  }],
  "patrones": [{ "nombre": "Observer", "variante": "push",
                 "roles": { "SujetoAbstracto": "ISujetoVuelo",
                            "SujetoConcreto": "GestorCancelacionVuelo",
                            "ObservadorAbstracto": "IObservadorVuelo",
                            "ObservadorConcreto": ["PantallaEstadosDeVuelo",
                                                   "PantallaConsultarDisponibilidad"] } }],
  "der": { "tablas": [] },
  "trazabilidad": []   // derivada: paso CU ↔ mensajes ↔ métodos ↔ transiciones
}
```

El esquema se versiona (`schemaVersion`) y se valida con JSON Schema; los cambios se
registran en la bitácora.

## Catálogo de reglas de consistencia (v0)

Severidad: **B** = bloqueante (no se entrega), **A** = advertencia (se explica al usuario).

### Realización ↔ Clases
| ID | Regla | Sev |
|---|---|---|
| RC-01 | Todo mensaje recibido por una línea de vida de clase C es un método de C (o de un ancestro / interfaz que implementa) | B |
| RC-02 | Toda línea de vida referencia una clase existente | B |
| RC-03 | Si A envía un mensaje a B (B ≠ A), existe relación navegable A→B, o B es parámetro / retorno / variable local justificada, o B es una dependencia declarada | B |
| RC-04 | Un `get<Atributo>()` sólo existe si `<atributo>` es atributo de la clase | B |
| RC-05 | Los atributos del control que guardan selecciones del usuario (`paisOrigenSeleccionado`, …) tienen un mensaje `tomar…`/`seleccion…` que los alimenta | A |
| RC-06 | Mensajes iterativos (`*`) aparecen dentro de un `loop` o marcados con `*` en comunicación, y van a una multiplicidad `*` / `1..*` | A |
| RC-07 | Creación de objeto (`new()`) corresponde a una clase entity existente y aparece en el paso del CU que registra | A |

### CU ↔ Realización
| ID | Regla | Sev |
|---|---|---|
| CR-01 | Todo paso "Sistema" del curso normal está realizado por ≥ 1 mensaje | B |
| CR-02 | Todo paso "Actor" se corresponde con un mensaje actor→boundary y boundary→control | B |
| CR-03 | El orden de los mensajes respeta el orden de los pasos. **Bajada a A** al calibrar con el corpus: la cátedra intercala pasos origen/destino (hallazgo H14) | A |
| CR-04 | La realización termina con `finCU()` o `finCasoDeUso()` en el control | A |
| CR-05 | Los datos que el CU dice "mostrar" (p. ej. número de vuelo, origen, destino, horario) se obtienen por mensajes hacia las clases que los poseen | B |

### DTE ↔ Clases / CU / Reglas
| ID | Regla | Sev |
|---|---|---|
| DT-01 | Toda acción `/m()` de una transición es un método de la clase del DTE | B |
| DT-02 | Todo evento de transición corresponde a un CU existente | B |
| DT-03 | Los estados desde los que un CU permite actuar coinciden con lo que dicen el CU y las reglas de negocio (p. ej. "estados cancelables") | B |
| DT-04 | Hay estado inicial y, si el dominio lo indica, final; estados compuestos tienen su submáquina | A |

### Patrón ↔ resto
| ID | Regla | Sev |
|---|---|---|
| PT-01 | Cada rol obligatorio del patrón está asignado a una clase/interfaz del modelo | B |
| PT-02 | Las clases que cumplen un rol implementan los métodos de la interfaz del rol con la misma firma en estructura, dinámica y pseudocódigo | B |
| PT-03 | Los datos pasados en modo *push* existen en el sujeto concreto (atributo o accesible por navegación) | B |

### DER ↔ Clases
| ID | Regla | Sev |
|---|---|---|
| DE-01 | Toda clase entity persistente tiene tabla (o justificación de herencia/mapeo) | A |
| DE-02 | Toda asociación de clases se refleja en FK o tabla intermedia según multiplicidad | B |

### Estilo cátedra
Ver [convenciones-catedra.md](convenciones-catedra.md). Se validan como advertencias.

## Prueba de concepto sobre material real

Al transcribir a mano el CU *Cancelar Vuelo* del EPC Líneas Aéreas aparecieron
**candidatos a inconsistencia** que estas reglas detectarían. Están detallados en
[corpus/epc-lineas-aereas/hallazgos.md](../corpus/epc-lineas-aereas/hallazgos.md) y son
el primer caso de prueba del validador.
