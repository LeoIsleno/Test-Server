import { readFileSync } from "node:fs";
import type { ModeloCanonico } from "../modelo/tipos.ts";
import { validar, REGLAS } from "../validador/index.ts";

const ruta = process.argv[2];
if (!ruta) {
  console.error("Uso: npm run validar -- <modelo.json>");
  process.exit(2);
}
const modelo = JSON.parse(readFileSync(ruta, "utf8")) as ModeloCanonico;
const violaciones = validar(modelo);

console.log(`Modelo: ${ruta}`);
console.log(`Reglas aplicadas: ${REGLAS.map((r) => r.id).join(", ")}\n`);
if (violaciones.length === 0) console.log("Sin violaciones.");
for (const v of violaciones) {
  console.log(`[${v.regla} ${v.severidad === "B" ? "BLOQUEANTE" : "advertencia"}] ${v.ubicacion}`);
  console.log(`   ${v.detalle}`);
  if (v.sugerencias?.length) console.log(`   → ${v.sugerencias.join(" | ")}`);
}
const bloqueantes = violaciones.filter((v) => v.severidad === "B").length;
console.log(`\nTotal: ${violaciones.length} (${bloqueantes} bloqueantes)`);
process.exit(bloqueantes ? 1 : 0);
