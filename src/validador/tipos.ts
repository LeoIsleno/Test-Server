import type { ModeloCanonico } from "../modelo/tipos.ts";

/** B = bloqueante (no se entrega), A = advertencia (se explica). */
export type Severidad = "B" | "A";

export interface Violacion {
  regla: string;
  severidad: Severidad;
  ubicacion: string;
  detalle: string;
  sugerencias?: string[];
}

export interface Regla {
  id: string;
  severidad: Severidad;
  /** Una línea: se usa para el catálogo que va en el prompt y en la documentación. */
  descripcion: string;
  verificar(m: ModeloCanonico): Violacion[];
}
