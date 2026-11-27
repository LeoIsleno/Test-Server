import type { ModeloCanonico } from "../../src/modelo/tipos.ts";

export interface ConsignaEj {
  nro: string;
  texto: string;
  artefacto: string;
}
export interface CUEj {
  id: string;
  nombre: string;
  modelo: string;
  consignas: string[];
}
export interface Ejercicio {
  id: string;
  nombre: string;
  tipo: string;
  fuente: string;
  objetivo?: string;
  consignas: ConsignaEj[];
  casosDeUso: CUEj[];
}
export interface EjercicioCargado {
  ejercicio: Ejercicio;
  /** Modelo canónico de cada CU (su vista de clases + realización), por id de CU. */
  modelos: Map<string, ModeloCanonico>;
}

// Vite incluye en el bundle todos los ejercicios del corpus.
const ejercicios = import.meta.glob<Ejercicio>("../../corpus/*/ejercicio.json", { eager: true, import: "default" });
const modelos = import.meta.glob<ModeloCanonico>("../../corpus/*/modelo/*.json", { eager: true, import: "default" });

export function cargarCorpus(): EjercicioCargado[] {
  return Object.entries(ejercicios).map(([ruta, ejercicio]) => {
    const base = ruta.replace(/ejercicio\.json$/, "");
    const m = new Map<string, ModeloCanonico>();
    for (const cu of ejercicio.casosDeUso) {
      const modelo = modelos[base + cu.modelo];
      if (modelo) m.set(cu.id, modelo);
    }
    return { ejercicio, modelos: m };
  });
}

/** Un archivo cargado por el usuario: un modelo canónico de uno o más CU. */
export function desdeArchivo(nombreArchivo: string, json: unknown): EjercicioCargado {
  const m = json as ModeloCanonico;
  if (!m || !Array.isArray(m.casosDeUso) || !Array.isArray(m.clases) || !Array.isArray(m.realizaciones)) {
    throw new Error("El archivo no es un modelo canónico (faltan casosDeUso, clases o realizaciones).");
  }
  const ejercicio: Ejercicio = {
    id: `archivo:${nombreArchivo}`,
    nombre: nombreArchivo.replace(/\.json$/, ""),
    tipo: "Archivo cargado",
    fuente: m.fuente ?? nombreArchivo,
    consignas: [],
    casosDeUso: m.casosDeUso.map((cu) => ({ id: cu.id, nombre: cu.nombre, modelo: nombreArchivo, consignas: [] })),
  };
  return { ejercicio, modelos: new Map(m.casosDeUso.map((cu) => [cu.id, m])) };
}
