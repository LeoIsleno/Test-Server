import dagre from "@dagrejs/dagre";
import type { ModeloCanonico } from "../../../src/modelo/tipos.ts";
import type { Violacion } from "../../../src/validador/index.ts";
import { ancho, esc, FUENTE, FUENTE_NEGRITA, MARCADORES, type Resaltado } from "./svg.ts";

const LH = 16;
const PAD = 12;

interface Faltante {
  metodo: string;
  usos: string[];
}

/**
 * Diagrama de clases de análisis, dibujado desde el modelo canónico.
 * - Relaciones del modelo: línea continua, flecha abierta si es navegable, rol y multiplicidad.
 * - Dependencias derivadas de la realización (boundary/control → otras clases): línea punteada.
 * - Métodos usados en la secuencia o el DTE pero no declarados: en rojo, con su origen.
 */
export function svgClases(m: ModeloCanonico, violaciones: Violacion[], res: Resaltado): string {
  const nombres = new Set(m.clases.map((c) => c.nombre));

  const faltantes = new Map<string, Faltante[]>();
  for (const v of violaciones) {
    const clase = v.refs?.clases?.[0];
    const metodo = v.refs?.metodo;
    if (!clase || !metodo || (v.regla !== "RC-01" && v.regla !== "DT-01")) continue;
    const lista = faltantes.get(clase) ?? [];
    let f = lista.find((x) => x.metodo === metodo);
    if (!f) lista.push((f = { metodo, usos: [] }));
    f.usos.push(v.regla === "DT-01" ? "DTE" : `msg ${v.refs!.mensajes?.join(",")}`);
    faltantes.set(clase, lista);
  }
  const conError = new Set(violaciones.filter((v) => v.severidad === "B").flatMap((v) => v.refs?.clases ?? []));

  const g = new dagre.graphlib.Graph({ multigraph: true });
  g.setGraph({ rankdir: "LR", nodesep: 26, ranksep: 90, edgesep: 18, marginx: 24, marginy: 24 });
  g.setDefaultEdgeLabel(() => ({}));

  for (const c of m.clases) {
    const falt = faltantes.get(c.nombre) ?? [];
    const lineas = [
      ...c.atributos,
      ...c.metodos.map((x) => `${x}()`),
      ...falt.map((f) => `⚠ ${f.metodo}()  ← ${f.usos.join(", ")}`),
    ];
    const w = Math.max(
      150,
      ancho(`«${c.estereotipo}»`) + 2 * PAD,
      ancho(c.nombre, FUENTE_NEGRITA) + 2 * PAD,
      ...lineas.map((l) => ancho(l, FUENTE) + 2 * PAD),
    );
    const h = 40 + Math.max(1, c.atributos.length) * LH + 10 + Math.max(1, c.metodos.length + falt.length) * LH + 8;
    g.setNode(c.nombre, { width: Math.ceil(w), height: h });
  }

  m.relaciones.forEach((r, i) => {
    if (nombres.has(r.desde) && nombres.has(r.hacia)) g.setEdge(r.desde, r.hacia, { tipo: "rel", r }, `r${i}`);
  });

  // Dependencias derivadas: quién le habla a quién en la realización, sin relación declarada.
  const conRelacion = (a: string, b: string) =>
    m.relaciones.some((r) => (r.desde === a && r.hacia === b) || (r.desde === b && r.hacia === a));
  const deps = new Set<string>();
  for (const real of m.realizaciones) {
    const claseDe = (id: string) => real.lineasDeVida.find((l) => l.id === id)?.clase;
    for (const msj of real.mensajes) {
      const a = claseDe(msj.desde);
      const b = claseDe(msj.hacia);
      if (!a || !b || a === b || !nombres.has(a) || !nombres.has(b) || conRelacion(a, b)) continue;
      const k = `${a}>${b}`;
      if (deps.has(k)) continue;
      deps.add(k);
      g.setEdge(a, b, { tipo: "dep" }, `d:${k}`);
    }
  }

  dagre.layout(g);
  const { width = 800, height = 600 } = g.graph() as { width?: number; height?: number };

  const partes: string[] = [];
  partes.push(`<svg xmlns="http://www.w3.org/2000/svg" class="diagrama" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" data-base-w="${width}" data-base-h="${height}">`);
  partes.push(MARCADORES);

  for (const e of g.edges()) {
    const datos = g.edge(e) as { tipo: "rel" | "dep"; r?: ModeloCanonico["relaciones"][number]; points: { x: number; y: number }[] };
    const pts = datos.points;
    const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    const resaltada = res.clases.has(e.v) || res.clases.has(e.w);
    if (datos.tipo === "dep") {
      partes.push(`<path d="${d}" class="arista dependencia${resaltada ? " resaltado" : ""}" marker-end="url(#flecha-abierta)"><title>dependencia (derivada de la realización)</title></path>`);
    } else {
      const r = datos.r!;
      const nav = r.navegable !== false;
      partes.push(`<path d="${d}" class="arista relacion${resaltada ? " resaltado" : ""}" ${nav ? 'marker-end="url(#flecha-abierta)"' : ""}/>`);
      const fin = pts[pts.length - 1];
      const prev = pts[pts.length - 2] ?? fin;
      const lx = fin.x + (prev.x - fin.x) * 0.25;
      const ly = fin.y + (prev.y - fin.y) * 0.25 - 6;
      partes.push(`<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" class="etiqueta-arista" text-anchor="middle">${esc(r.rol)} ${esc(r.mult)}</text>`);
    }
  }

  for (const c of m.clases) {
    const n = g.node(c.nombre) as { x: number; y: number; width: number; height: number };
    const x = n.x - n.width / 2;
    const y = n.y - n.height / 2;
    const clasesCss = ["nodo-clase", `est-${c.estereotipo}`];
    if (res.clases.has(c.nombre)) clasesCss.push("resaltado");
    if (conError.has(c.nombre)) clasesCss.push("con-error");
    partes.push(`<g class="${clasesCss.join(" ")}" data-clase="${esc(c.nombre)}">`);
    partes.push(`<title>Clic para ver dónde participa ${esc(c.nombre)} en la realización</title>`);
    partes.push(`<rect x="${x}" y="${y}" width="${n.width}" height="${n.height}" rx="3" class="caja"/>`);
    partes.push(`<text x="${n.x}" y="${y + 16}" text-anchor="middle" class="estereotipo">«${esc(c.estereotipo)}»</text>`);
    partes.push(`<text x="${n.x}" y="${y + 32}" text-anchor="middle" class="nombre-clase">${esc(c.nombre)}</text>`);
    let cy = y + 40;
    partes.push(`<line x1="${x}" y1="${cy}" x2="${x + n.width}" y2="${cy}" class="separador"/>`);
    cy += 4;
    for (const a of c.atributos) {
      cy += LH;
      partes.push(`<text x="${x + PAD}" y="${cy - 3}" class="miembro">${esc(a)}</text>`);
    }
    if (!c.atributos.length) cy += LH;
    cy += 6;
    partes.push(`<line x1="${x}" y1="${cy}" x2="${x + n.width}" y2="${cy}" class="separador"/>`);
    cy += 4;
    for (const met of c.metodos) {
      cy += LH;
      partes.push(`<text x="${x + PAD}" y="${cy - 3}" class="miembro">${esc(met)}()</text>`);
    }
    for (const f of faltantes.get(c.nombre) ?? []) {
      cy += LH;
      partes.push(`<text x="${x + PAD}" y="${cy - 3}" class="miembro faltante"><title>Se usa pero no está declarado en la clase</title>⚠ ${esc(f.metodo)}()  ← ${esc(f.usos.join(", "))}</text>`);
    }
    partes.push(`</g>`);
  }
  partes.push(`</svg>`);
  return partes.join("\n");
}
