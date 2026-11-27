import type { Regla, Violacion } from "../tipos.ts";

/** CR-01 / CR-02: todo paso del curso normal está realizado por al menos un mensaje. */
export const CR01: Regla = {
  id: "CR-01",
  severidad: "B",
  descripcion: "Todo paso del curso normal (Actor y Sistema) está realizado por al menos un mensaje",
  verificar(m) {
    const v: Violacion[] = [];
    for (const r of m.realizaciones.filter((x) => x.curso === "normal")) {
      const cu = m.casosDeUso.find((c) => c.id === r.cu);
      if (!cu) continue;
      const cubiertos = new Set(r.mensajes.map((x) => x.pasoCU));
      for (const p of cu.pasos) {
        if (!cubiertos.has(p.nro)) {
          v.push({
            regla: "CR-01",
            severidad: "B",
            ubicacion: `${cu.id} paso ${p.nro}`,
            detalle: `El paso "${p.quien}: ${p.texto}" no tiene mensajes en la realización`,
          });
        }
      }
    }
    return v;
  },
};

/** CR-03: el orden de los mensajes respeta el orden de los pasos del CU. */
export const CR03: Regla = {
  id: "CR-03",
  severidad: "B",
  descripcion: "El orden de los mensajes respeta el orden de los pasos del CU",
  verificar(m) {
    const v: Violacion[] = [];
    for (const r of m.realizaciones) {
      let ultimo = 0;
      for (const msj of [...r.mensajes].sort((a, b) => a.nro - b.nro)) {
        if (msj.pasoCU === undefined) continue;
        if (msj.pasoCU < ultimo) {
          v.push({
            regla: "CR-03",
            severidad: "B",
            ubicacion: `${r.cu} ${r.vista}, msg ${msj.nro}`,
            detalle: `El mensaje ${msj.metodo}() realiza el paso ${msj.pasoCU} pero aparece después de mensajes del paso ${ultimo}`,
          });
        }
        ultimo = Math.max(ultimo, msj.pasoCU);
      }
    }
    return v;
  },
};

/** CR-04: la realización termina con finCU() en el control. */
export const CR04: Regla = {
  id: "CR-04",
  severidad: "A",
  descripcion: "La realización termina con finCU() en el control",
  verificar(m) {
    return m.realizaciones
      .filter((r) => {
        const ultimo = [...r.mensajes].sort((a, b) => b.nro - a.nro)[0];
        return ultimo?.metodo !== "finCU";
      })
      .map((r) => ({
        regla: "CR-04",
        severidad: "A" as const,
        ubicacion: `${r.cu} ${r.vista}`,
        detalle: "El último mensaje no es finCU()",
      }));
  },
};
