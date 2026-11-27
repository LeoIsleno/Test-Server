import { readFileSync, writeFileSync } from "node:fs";
import type { ModeloCanonico } from "../modelo/tipos.ts";
import { validar } from "../validador/index.ts";

/**
 * Genera una "ficha de transcripción" en Markdown: lo que se transcribió, en tablas,
 * para revisarlo a mano contra el PDF original. Es el paso de validación humana (doc 03).
 */
const [ruta, salida] = process.argv.slice(2);
if (!ruta) {
  console.error("Uso: npm run ficha -- <modelo.json> [salida.md]");
  process.exit(2);
}
const m = JSON.parse(readFileSync(ruta, "utf8")) as ModeloCanonico;
const violaciones = validar(m);
const L: string[] = [];
const fila = (...c: (string | number | undefined)[]) => L.push(`| ${c.map((x) => String(x ?? "")).join(" | ")} |`);

L.push(`# Ficha de transcripción — ${m.casosDeUso.map((c) => `${c.id} ${c.nombre}`).join(", ")}`, "");
L.push(`- **Fuente:** ${m.fuente ?? "—"}`, `- **Estado:** ${m.estadoValidacion}`, `- **Generada desde:** \`${ruta}\``, "");
L.push("> Revisar cada tabla contra el PDF. Marcar errores de lectura y corregirlos en el JSON (no en esta ficha).", "");

for (const cu of m.casosDeUso) {
  L.push(`## ${cu.id} — ${cu.nombre} (actor: ${cu.actor})`, "", "| Paso | Quién | Texto |", "|---|---|---|");
  for (const p of cu.pasos) fila(p.nro, p.quien, p.texto);
  L.push("");
}

L.push("## Clases", "", "| Clase | Estereotipo | Atributos | Métodos |", "|---|---|---|---|");
for (const c of m.clases) fila(c.nombre, c.estereotipo, c.atributos.join(", "), c.metodos.map((x) => `${x}()`).join(", "));
L.push("", "## Relaciones", "", "| Desde | Hacia | Rol | Multiplicidad |", "|---|---|---|---|");
for (const r of m.relaciones) fila(r.desde, r.hacia, r.rol, r.mult);

for (const r of m.realizaciones) {
  const nom = (id: string) => (id === "actor" ? "actor" : `${id}:${r.lineasDeVida.find((l) => l.id === id)?.clase}`);
  L.push("", `## Realización ${r.cu} — ${r.vista}, curso ${r.curso}${"fuente" in r ? ` (${(r as { fuente?: string }).fuente})` : ""}`, "");
  L.push("| # | Desde | Hacia | Mensaje | Paso CU | Nota |", "|---|---|---|---|---|---|");
  for (const x of r.mensajes) {
    const nota = [(x as { _lectura?: string })._lectura, x._hallazgo].filter(Boolean).join("; ");
    fila(x.nro, nom(x.desde), nom(x.hacia), `${x.iterativo ? "*" : ""}${x.metodo}()`, x.pasoCU, nota);
  }
  for (const f of r.fragmentos ?? []) L.push(`- \`${f.tipo} [${f.guarda}]\`: mensajes ${f.mensajes[0]}–${f.mensajes[1]}`);
}

for (const d of m.maquinasDeEstado) {
  L.push("", `## DTE ${d.clase}`, "", "| Desde | Hacia | Evento | Acción | CU |", "|---|---|---|---|---|");
  for (const t of d.transiciones) fila(t.desde, t.hacia, t.evento, t.accion ? `/${t.accion}()` : "", t.cu);
}

L.push("", `## Resultado del validador (${violaciones.length})`, "");
if (!violaciones.length) L.push("Sin violaciones.");
for (const v of violaciones) L.push(`- **${v.regla}** (${v.severidad === "B" ? "bloqueante" : "advertencia"}) ${v.ubicacion}: ${v.detalle}`);

const texto = L.join("\n") + "\n";
if (salida) writeFileSync(salida, texto);
else process.stdout.write(texto);
