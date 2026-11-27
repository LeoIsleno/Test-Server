import type { ModeloCanonico, Realizacion } from "../../../src/modelo/tipos.ts";
import type { Violacion } from "../../../src/validador/index.ts";
import { ancho, esc, FUENTE, FUENTE_NEGRITA, MARCADORES, type Resaltado } from "./svg.ts";

const TOPE = 34;
const CABEZA = 44;
const FILA = 28;
const FILA_PROPIA = 36;
const LAZO = 34;

/**
 * Diagrama de secuencia dibujado desde la realización del modelo canónico.
 * Los mensajes con violaciones se pintan en rojo (bloqueante) o ámbar (advertencia).
 */
export function svgSecuencia(m: ModeloCanonico, r: Realizacion, violaciones: Violacion[], res: Resaltado): string {
  const actor = m.casosDeUso.find((c) => c.id === r.cu)?.actor ?? "Actor";
  const participantes = [
    { id: "actor", etiqueta: `:${actor}`, clase: "", estereotipo: "actor", multi: false },
    ...r.lineasDeVida.map((l) => ({
      id: l.id,
      etiqueta: `${l.multiobjeto ? "" : l.id}:${l.clase}`,
      clase: l.clase,
      estereotipo: m.clases.find((c) => c.nombre === l.clase)?.estereotipo ?? "",
      multi: !!l.multiobjeto,
    })),
  ];

  const xs = new Map<string, number>();
  let x = 30;
  for (const p of participantes) {
    const w = Math.max(96, ancho(p.etiqueta, FUENTE_NEGRITA) + 24);
    xs.set(p.id, x + w / 2);
    (p as typeof p & { w: number }).w = w;
    x += w + 26;
  }
  const anchoTotal = x + 20;

  const errores = new Map<number, Violacion[]>();
  for (const v of violaciones) for (const n of v.refs?.cu === r.cu ? (v.refs.mensajes ?? []) : []) errores.set(n, [...(errores.get(n) ?? []), v]);

  const mensajes = [...r.mensajes].sort((a, b) => a.nro - b.nro);
  const ys = new Map<number, number>();
  let y = TOPE + CABEZA + 30;
  for (const msj of mensajes) {
    y += msj.desde === msj.hacia ? FILA_PROPIA : FILA;
    ys.set(msj.nro, y);
  }
  const alto = y + 50;

  const partes: string[] = [];
  partes.push(`<svg xmlns="http://www.w3.org/2000/svg" class="diagrama" width="${anchoTotal}" height="${alto}" viewBox="0 0 ${anchoTotal} ${alto}" data-base-w="${anchoTotal}" data-base-h="${alto}">`);
  partes.push(MARCADORES);

  // Fragmentos (loop/alt/opt) detrás de todo.
  for (const f of r.fragmentos ?? []) {
    const dentro = mensajes.filter((x) => x.nro >= f.mensajes[0] && x.nro <= f.mensajes[1]);
    if (!dentro.length) continue;
    const ids = dentro.flatMap((x) => [x.desde, x.hacia]);
    const minX = Math.min(...ids.map((i) => xs.get(i)!)) - 40;
    const maxX = Math.max(...ids.map((i) => xs.get(i)!)) + 60 + LAZO;
    const y0 = ys.get(dentro[0].nro)! - FILA + 2;
    const y1 = ys.get(dentro[dentro.length - 1].nro)! + 14;
    const etiqueta = `${f.tipo}`;
    const we = ancho(etiqueta, FUENTE_NEGRITA) + 16;
    partes.push(`<g class="fragmento"><rect x="${minX}" y="${y0}" width="${maxX - minX}" height="${y1 - y0}" class="marco"/>`);
    partes.push(`<path d="M${minX},${y0} h${we} v12 l-6,6 h${-(we - 6)} z" class="pestana"/>`);
    partes.push(`<text x="${minX + 6}" y="${y0 + 13}" class="texto-pestana">${esc(etiqueta)}</text>`);
    partes.push(`<text x="${minX + we + 8}" y="${y0 + 13}" class="guarda">[${esc(f.guarda)}]</text></g>`);
  }

  // Cabezas y líneas de vida.
  for (const p of participantes as (typeof participantes[number] & { w: number })[]) {
    const cx = xs.get(p.id)!;
    const resaltada = p.clase && res.clases.has(p.clase);
    partes.push(`<g class="linea-vida${resaltada ? " resaltado" : ""}" ${p.clase ? `data-clase="${esc(p.clase)}"` : ""}>`);
    partes.push(`<line x1="${cx}" y1="${TOPE + CABEZA}" x2="${cx}" y2="${alto - 16}" class="vida"/>`);
    if (p.id === "actor") {
      const top = TOPE - 4;
      partes.push(`<circle cx="${cx}" cy="${top + 6}" r="6" class="actor"/><path d="M${cx},${top + 12} v14 M${cx - 10},${top + 17} h20 M${cx},${top + 26} l-8,10 M${cx},${top + 26} l8,10" class="actor"/>`);
      partes.push(`<text x="${cx}" y="${TOPE + CABEZA - 2}" text-anchor="middle" class="nombre-linea">${esc(p.etiqueta)}</text>`);
    } else {
      const bx = cx - p.w / 2;
      if (p.multi) partes.push(`<rect x="${bx + 4}" y="${TOPE - 4}" width="${p.w}" height="${CABEZA - 8}" rx="3" class="caja-linea sombra"/>`);
      partes.push(`<rect x="${bx}" y="${TOPE}" width="${p.w}" height="${CABEZA - 8}" rx="3" class="caja-linea est-${p.estereotipo}"/>`);
      partes.push(`<text x="${cx}" y="${TOPE + 13}" text-anchor="middle" class="estereotipo">«${esc(p.estereotipo)}»</text>`);
      partes.push(`<text x="${cx}" y="${TOPE + 28}" text-anchor="middle" class="nombre-linea subrayado">${esc(p.etiqueta)}</text>`);
      partes.push(`<title>Clic para ver la clase ${esc(p.clase)}</title>`);
    }
    partes.push(`</g>`);
  }

  // Mensajes.
  for (const msj of mensajes) {
    const yy = ys.get(msj.nro)!;
    const x1 = xs.get(msj.desde)!;
    const x2 = xs.get(msj.hacia)!;
    const v = errores.get(msj.nro) ?? [];
    const css = ["mensaje"];
    if (v.some((e) => e.severidad === "B")) css.push("error");
    else if (v.length) css.push("advertencia");
    const receptor = r.lineasDeVida.find((l) => l.id === msj.hacia)?.clase ?? "";
    if (res.mensajes.has(msj.nro) || (receptor && res.clases.has(receptor))) css.push("resaltado");
    const texto = `${msj.nro}: ${msj.iterativo ? "*" : ""}${msj.metodo}()${v.length ? "  ⚠" : ""}`;
    const titulo = [`Paso CU: ${msj.pasoCU ?? "—"}`, ...v.map((e) => `${e.regla}: ${e.detalle}`)].join("\n");
    partes.push(`<g class="${css.join(" ")}" data-nro="${msj.nro}"><title>${esc(titulo)}</title>`);
    const discont = msj.metodo === "new" ? ' stroke-dasharray="6 4"' : "";
    if (x1 === x2) {
      partes.push(`<path d="M${x1},${yy - 12} h${LAZO} v14 h${-LAZO + 2}" class="flecha"${discont} marker-end="url(#flecha-llena)"/>`);
      partes.push(`<text x="${x1 + LAZO + 6}" y="${yy - 4}" class="texto-mensaje">${esc(texto)}</text>`);
    } else {
      const dir = x2 > x1 ? 1 : -1;
      partes.push(`<line x1="${x1}" y1="${yy}" x2="${x2 - dir * 2}" y2="${yy}" class="flecha"${discont} marker-end="url(#flecha-llena)"/>`);
      const tx = dir > 0 ? x1 + 8 : x2 + 8;
      partes.push(`<text x="${tx}" y="${yy - 5}" class="texto-mensaje">${esc(texto)}</text>`);
    }
    partes.push(`</g>`);
  }

  partes.push(`</svg>`);
  return partes.join("\n");
}

export const _FUENTE = FUENTE;
