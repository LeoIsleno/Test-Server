/**
 * Modelo canónico v0.1 (ver docs/02-modelo-canonico.md).
 * Todas las vistas (clases, secuencia, DTE, ...) se derivan de este objeto.
 * v0.1 simplifica atributos y métodos a nombres; tipos y parámetros llegan en v0.2.
 */

export type Estereotipo = "boundary" | "control" | "entity" | "interface";

export interface Clase {
  nombre: string;
  estereotipo: Estereotipo;
  atributos: string[];
  metodos: string[];
  _nota?: string;
}

export interface Relacion {
  desde: string;
  hacia: string;
  rol: string;
  mult: string;
  /** Si se omite, se asume navegable de `desde` hacia `hacia`. */
  navegable?: boolean;
}

export interface PasoCU {
  nro: number;
  quien: "Actor" | "Sistema";
  texto: string;
  reglas?: string[];
}

/** Una misma definición de CU puede aparecer en varias versiones (extendida/abreviada). */
export interface VersionCU {
  id: string;
  fuente: string;
  /** Estados desde los que el CU permite actuar, tal como los enumera el texto. */
  estadosPermitidos?: string[];
}

export interface CasoDeUso {
  id: string;
  nombre: string;
  actor: string;
  pasos: PasoCU[];
  alternativos?: { id: string; texto: string }[];
  versiones?: VersionCU[];
}

export interface LineaDeVida {
  id: string;
  clase: string;
  multiobjeto?: boolean;
}

export interface Mensaje {
  nro: number;
  desde: string; // id de línea de vida, o "actor"
  hacia: string;
  metodo: string;
  iterativo?: boolean;
  pasoCU?: number;
  _hallazgo?: string;
}

export interface Fragmento {
  tipo: "loop" | "alt" | "opt";
  guarda: string;
  /** Rango [primero, último] de números de mensaje incluidos. */
  mensajes: [number, number];
}

export interface Realizacion {
  cu: string;
  curso: string;
  vista: "secuencia" | "comunicacion";
  lineasDeVida: LineaDeVida[];
  mensajes: Mensaje[];
  fragmentos?: Fragmento[];
}

export interface Transicion {
  desde: string; // "Estado" o "Compuesto.Subestado"
  hacia: string;
  evento: string;
  guarda?: string | null;
  accion?: string;
  cu?: string;
}

export interface MaquinaDeEstados {
  clase: string;
  transiciones: Transicion[];
  _nota?: string;
}

export interface ModeloCanonico {
  schemaVersion: string;
  estadoValidacion: "borrador" | "validado";
  fuente?: string;
  casosDeUso: CasoDeUso[];
  clases: Clase[];
  relaciones: Relacion[];
  realizaciones: Realizacion[];
  maquinasDeEstado: MaquinaDeEstados[];
}
