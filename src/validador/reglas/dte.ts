import type { Regla, Violacion } from "../tipos.ts";
import { Indice, estadoRaiz } from "../indice.ts";

/** DT-01: toda acción /m() de una transición es un método de la clase del DTE. */
export const DT01: Regla = {
  id: "DT-01",
  severidad: "B",
  descripcion: "Toda acción /m() de una transición del DTE es un método de la clase",
  verificar(m) {
    const ix = new Indice(m);
    const v: Violacion[] = [];
    for (const dte of m.maquinasDeEstado) {
      const faltantes = new Map<string, string[]>();
      for (const t of dte.transiciones) {
        if (t.accion && !ix.tieneMetodo(dte.clase, t.accion)) {
          faltantes.set(t.accion, [...(faltantes.get(t.accion) ?? []), `${t.desde}→${t.hacia}`]);
        }
      }
      for (const [accion, trans] of faltantes) {
        v.push({
          regla: "DT-01",
          severidad: "B",
          ubicacion: `DTE ${dte.clase}, transiciones ${trans.join(", ")}`,
          detalle: `La acción /${accion}() no es un método de ${dte.clase}`,
          sugerencias: [`agregar ${accion}() a ${dte.clase}`],
          refs: { clases: [dte.clase], cu: dte.transiciones.find((t) => t.accion === accion)?.cu, metodo: accion },
        });
      }
    }
    return v;
  },
};

/** DT-02: todo evento con CU asociado referencia un CU existente. */
export const DT02: Regla = {
  id: "DT-02",
  severidad: "B",
  descripcion: "Todo CU asociado a una transición existe en el modelo",
  verificar(m) {
    const ids = new Set(m.casosDeUso.map((c) => c.id));
    return m.maquinasDeEstado.flatMap((dte) =>
      dte.transiciones
        .filter((t) => t.cu && !ids.has(t.cu))
        .map((t) => ({
          regla: "DT-02",
          severidad: "B" as const,
          ubicacion: `DTE ${dte.clase}, ${t.desde}→${t.hacia}`,
          detalle: `El CU ${t.cu} no existe`,
        })),
    );
  },
};

/**
 * DT-03: los estados desde los que el DTE permite un evento coinciden con los que
 * enumera cada versión del CU asociado.
 */
export const DT03: Regla = {
  id: "DT-03",
  severidad: "B",
  descripcion: "Los estados de origen de un evento en el DTE coinciden con los que enumera el CU",
  verificar(m) {
    const v: Violacion[] = [];
    for (const dte of m.maquinasDeEstado) {
      const porCU = new Map<string, Set<string>>();
      for (const t of dte.transiciones) {
        if (!t.cu) continue;
        if (!porCU.has(t.cu)) porCU.set(t.cu, new Set());
        porCU.get(t.cu)!.add(estadoRaiz(t.desde));
      }
      for (const [cuId, enDTE] of porCU) {
        const cu = m.casosDeUso.find((c) => c.id === cuId);
        for (const ver of cu?.versiones ?? []) {
          if (!ver.estadosPermitidos) continue;
          const enCU = new Set(ver.estadosPermitidos);
          const soloDTE = [...enDTE].filter((e) => !enCU.has(e));
          const soloCU = [...enCU].filter((e) => !enDTE.has(e));
          if (soloDTE.length || soloCU.length) {
            v.push({
              regla: "DT-03",
              severidad: "B",
              ubicacion: `${cuId} (${ver.id}, ${ver.fuente}) vs DTE ${dte.clase}`,
              detalle:
                (soloDTE.length ? `El DTE permite "${cu!.nombre}" desde ${soloDTE.join(", ")}, que el CU no menciona. ` : "") +
                (soloCU.length ? `El CU menciona ${soloCU.join(", ")}, sin transición en el DTE.` : ""),
              sugerencias: ["alinear el texto del CU con el DTE y las reglas de negocio"],
              refs: { cu: cuId, clases: [dte.clase] },
            });
          }
        }
      }
    }
    return v;
  },
};
