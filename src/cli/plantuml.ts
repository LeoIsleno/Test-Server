import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import type { ModeloCanonico } from "../modelo/tipos.ts";
import { diagramaDeClases, diagramaDeSecuencia } from "../proyector/plantuml.ts";

const [ruta, dir = "salida"] = process.argv.slice(2);
if (!ruta) {
  console.error("Uso: npm run plantuml -- <modelo.json> [directorio]");
  process.exit(2);
}
const m = JSON.parse(readFileSync(ruta, "utf8")) as ModeloCanonico;
mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}/clases.puml`, diagramaDeClases(m));
for (const r of m.realizaciones) {
  const actor = m.casosDeUso.find((c) => c.id === r.cu)?.actor ?? "Actor";
  writeFileSync(`${dir}/${r.cu}-${r.vista}.puml`, diagramaDeSecuencia(r, actor));
}
console.log(`Diagramas generados en ${dir}/`);
