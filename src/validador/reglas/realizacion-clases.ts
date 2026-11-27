import type { Regla, Violacion } from "../tipos.ts";
import { Indice, nombreLinea } from "../indice.ts";

/** RC-01: todo mensaje recibido por una línea de vida es un método de su clase. */
export const RC01: Regla = {
  id: "RC-01",
  severidad: "B",
  descripcion: "Todo mensaje recibido por una línea de vida de clase C es un método de C",
  verificar(m) {
    const ix = new Indice(m);
    const v: Violacion[] = [];
    for (const r of m.realizaciones) {
      for (const msj of r.mensajes) {
        if (msj.hacia === "actor") continue;
        const clase = ix.claseDeLinea(r, msj.hacia);
        if (!clase || !ix.clases.has(clase)) continue; // lo reporta RC-02
        if (!ix.tieneMetodo(clase, msj.metodo)) {
          v.push({
            regla: "RC-01",
            severidad: "B",
            ubicacion: `${r.cu} ${r.vista}, msg ${msj.nro} (${nombreLinea(r, msj.desde)} → ${nombreLinea(r, msj.hacia)})`,
            detalle: `${clase} no tiene el método ${msj.metodo}()`,
            sugerencias: [
              `agregar ${msj.metodo}() a ${clase}`,
              `usar un método existente de ${clase}`,
              "cambiar el destinatario del mensaje",
            ],
            refs: { cu: r.cu, mensajes: [msj.nro], clases: [clase], metodo: msj.metodo },
          });
        }
      }
    }
    return v;
  },
};

/** RC-02: toda línea de vida referencia una clase existente. */
export const RC02: Regla = {
  id: "RC-02",
  severidad: "B",
  descripcion: "Toda línea de vida referencia una clase existente del modelo",
  verificar(m) {
    const ix = new Indice(m);
    return m.realizaciones.flatMap((r) =>
      r.lineasDeVida
        .filter((l) => !ix.clases.has(l.clase))
        .map((l) => ({
          regla: "RC-02",
          severidad: "B" as const,
          ubicacion: `${r.cu} ${r.vista}, línea de vida ${l.id}`,
          detalle: `La clase ${l.clase} no existe en el modelo`,
          sugerencias: [`crear la clase ${l.clase}`, "corregir el nombre"],
          refs: { cu: r.cu },
        })),
    );
  },
};

/**
 * RC-03 (v0: sólo entity → entity): si un objeto entity envía un mensaje a otro,
 * debe existir una relación navegable entre sus clases. Boundary y control acceden por
 * dependencias, que el modelo v0.1 todavía no representa, así que no se chequean.
 */
export const RC03: Regla = {
  id: "RC-03",
  severidad: "A",
  descripcion: "Un mensaje entre entidades requiere una relación navegable del emisor al receptor",
  verificar(m) {
    const ix = new Indice(m);
    const v: Violacion[] = [];
    const vistos = new Set<string>();
    for (const r of m.realizaciones) {
      for (const msj of r.mensajes) {
        const a = ix.claseDeLinea(r, msj.desde);
        const b = ix.claseDeLinea(r, msj.hacia);
        if (!a || !b || a === b) continue;
        if (ix.clases.get(a)?.estereotipo !== "entity" || ix.clases.get(b)?.estereotipo !== "entity") continue;
        if (ix.navegable(a, b) || vistos.has(`${a}>${b}`)) continue;
        vistos.add(`${a}>${b}`);
        const inversa = ix.navegable(b, a);
        v.push({
          regla: "RC-03",
          severidad: "A",
          ubicacion: `${r.cu} ${r.vista}, msg ${msj.nro} ${msj.metodo}()`,
          detalle: `${a} envía mensajes a ${b} pero no hay relación navegable ${a} → ${b}` +
            (inversa ? ` (sólo existe ${b} → ${a})` : ""),
          sugerencias: [`agregar navegabilidad ${a} → ${b}`, "obtener el dato por otro camino"],
          refs: { cu: r.cu, mensajes: [msj.nro], clases: [a, b] },
        });
      }
    }
    return v;
  },
};
