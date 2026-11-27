import type { Regla, Violacion } from "../tipos.ts";

/** CR-01 / CR-02: todo paso del curso normal está realizado por al menos un mensaje. */
export const CR01: Regla = {
  id: "CR-01",
  severidad: "B",
  descripcion: "Todo paso del curso normal (Actor y Sistema) está realizado por al menos un mensaje",
  verificar(m) {
    const v: Violacion[] = [];
    for (const r of m.realizaciones) {
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
            refs: { cu: cu.id, pasos: [p.nro] },
          });
        }
      }
    }
    return v;
  },
};

/**
 * CR-03: el orden de los mensajes respeta el orden de los pasos del CU.
 * Calibrada con el corpus: la cátedra intercala pasos que el CU agrupa ("selecciona país
 * de origen y de destino" se realiza como origen → provincias de origen → destino → …),
 * así que es advertencia y se informa una vez por realización.
 */
export const CR03: Regla = {
  id: "CR-03",
  severidad: "A",
  descripcion: "El orden de los mensajes respeta el orden de los pasos del CU (se admite intercalar pasos origen/destino)",
  verificar(m) {
    const v: Violacion[] = [];
    for (const r of m.realizaciones) {
      let ultimo = 0;
      const fuera: string[] = [];
      const nros: number[] = [];
      for (const msj of [...r.mensajes].sort((a, b) => a.nro - b.nro)) {
        if (msj.pasoCU === undefined) continue;
        if (msj.pasoCU < ultimo) {
          fuera.push(`${msj.nro} (paso ${msj.pasoCU} después del ${ultimo})`);
          nros.push(msj.nro);
        }
        ultimo = Math.max(ultimo, msj.pasoCU);
      }
      if (fuera.length) {
        v.push({
          regla: "CR-03",
          severidad: "A",
          ubicacion: `${r.cu} ${r.vista}`,
          detalle: `${fuera.length} mensaje(s) fuera del orden del CU: ${fuera.join(", ")}`,
          sugerencias: ["si es un intercalado intencional (origen/destino), redactar el CU en ese orden o aceptarlo"],
          refs: { cu: r.cu, mensajes: nros },
        });
      }
    }
    return v;
  },
};

/** CR-04: la realización termina con finCU() en el control. */
export const CR04: Regla = {
  id: "CR-04",
  severidad: "A",
  descripcion: "La realización termina con finCU() (o finCasoDeUso()) en el control",
  verificar(m) {
    return m.realizaciones
      .filter((r) => {
        const ultimo = [...r.mensajes].sort((a, b) => b.nro - a.nro)[0];
        return !["finCU", "finCasoDeUso"].includes(ultimo?.metodo ?? "");
      })
      .map((r) => ({
        regla: "CR-04",
        severidad: "A" as const,
        ubicacion: `${r.cu} ${r.vista}`,
        detalle: "El último mensaje no es finCU() / finCasoDeUso()",
        refs: { cu: r.cu },
      }));
  },
};
