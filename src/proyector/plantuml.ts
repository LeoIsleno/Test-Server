import type { ModeloCanonico, Realizacion } from "../modelo/tipos.ts";

/** Proyecciones del modelo canónico a PlantUML. El diagrama nunca es la fuente: el JSON lo es. */

export function diagramaDeClases(m: ModeloCanonico, titulo = "Vista de clases"): string {
  const out = ["@startuml", "!pragma layout smetana", `title ${titulo}`, "hide circle", "skinparam classAttributeIconSize 0"];
  for (const c of m.clases) {
    out.push(`class ${c.nombre} <<${c.estereotipo}>> {`);
    for (const a of c.atributos) out.push(`  ${a}`);
    out.push("  --");
    for (const met of c.metodos) out.push(`  ${met}()`);
    out.push("}");
  }
  for (const r of m.relaciones) {
    const flecha = r.navegable === false ? "--" : "-->";
    out.push(`${r.desde} ${flecha} "${r.mult}" ${r.hacia} : ${r.rol}`);
  }
  out.push("@enduml");
  return out.join("\n");
}

export function diagramaDeSecuencia(r: Realizacion, actor: string, titulo?: string): string {
  const out = ["@startuml", `title ${titulo ?? `Realización ${r.cu} – curso ${r.curso}`}`, "autonumber", `actor ":${actor}" as actor`];
  for (const l of r.lineasDeVida) {
    const nombre = `"${l.multiobjeto ? "" : l.id}:${l.clase}"`;
    out.push(`participant ${nombre} as ${l.id}`);
  }
  const abre = new Map<number, string>();
  const cierra = new Map<number, number>();
  for (const f of r.fragmentos ?? []) {
    abre.set(f.mensajes[0], `${f.tipo} ${f.guarda}`);
    cierra.set(f.mensajes[1], (cierra.get(f.mensajes[1]) ?? 0) + 1);
  }
  for (const msj of [...r.mensajes].sort((a, b) => a.nro - b.nro)) {
    if (abre.has(msj.nro)) out.push(abre.get(msj.nro)!);
    const marca = msj.metodo === "new" ? "-->" : "->";
    out.push(`${msj.desde} ${marca} ${msj.hacia} : ${msj.iterativo ? "*" : ""}${msj.metodo}()`);
    for (let i = 0; i < (cierra.get(msj.nro) ?? 0); i++) out.push("end");
  }
  out.push("@enduml");
  return out.join("\n");
}
