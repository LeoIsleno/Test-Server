import type { ModeloCanonico } from "../modelo/tipos.ts";
import type { Regla, Violacion } from "./tipos.ts";
import { RC01, RC02, RC03 } from "./reglas/realizacion-clases.ts";
import { CR01, CR03, CR04 } from "./reglas/cu-realizacion.ts";
import { DT01, DT02, DT03 } from "./reglas/dte.ts";

/** Registro central: el catálogo del prompt y de la documentación se genera desde acá. */
export const REGLAS: Regla[] = [RC01, RC02, RC03, CR01, CR03, CR04, DT01, DT02, DT03];

export function validar(modelo: ModeloCanonico, reglas: Regla[] = REGLAS): Violacion[] {
  return reglas.flatMap((r) => r.verificar(modelo));
}

export function catalogo(reglas: Regla[] = REGLAS): string {
  return reglas.map((r) => `- ${r.id} [${r.severidad}] ${r.descripcion}`).join("\n");
}

export type { Regla, Violacion } from "./tipos.ts";
