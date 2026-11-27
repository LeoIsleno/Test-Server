import type { Clase, ModeloCanonico, Realizacion } from "../modelo/tipos.ts";

/** Accesos rápidos sobre el modelo, compartidos por todas las reglas. */
export class Indice {
  readonly clases = new Map<string, Clase>();

  constructor(readonly modelo: ModeloCanonico) {
    for (const c of modelo.clases) this.clases.set(c.nombre, c);
  }

  tieneMetodo(clase: string, metodo: string): boolean {
    return this.clases.get(clase)?.metodos.includes(metodo) ?? false;
  }

  /** ¿Existe una relación navegable de `a` hacia `b`? */
  navegable(a: string, b: string): boolean {
    return this.modelo.relaciones.some(
      (r) => r.desde === a && r.hacia === b && r.navegable !== false,
    );
  }

  claseDeLinea(r: Realizacion, idLinea: string): string | undefined {
    return r.lineasDeVida.find((l) => l.id === idLinea)?.clase;
  }
}

export const nombreLinea = (r: Realizacion, id: string) =>
  id === "actor" ? "actor" : `${id}:${r.lineasDeVida.find((l) => l.id === id)?.clase ?? "?"}`;

/** "EnEjecucion.EnAire" -> "EnEjecucion" */
export const estadoRaiz = (estado: string) => estado.split(".")[0];
