import type { ModeloCanonico } from "../../src/modelo/tipos.ts";
import { validar, REGLAS, type Violacion } from "../../src/validador/index.ts";
import { cargarCorpus, desdeArchivo, type EjercicioCargado } from "./datos.ts";
import { svgClases } from "./render/clases.ts";
import { svgSecuencia } from "./render/secuencia.ts";
import { esc, type Resaltado } from "./render/svg.ts";

type Pestana = "cu" | "clases" | "secuencia";

const estado = {
  ejercicios: cargarCorpus(),
  ej: 0,
  cu: "",
  pestana: "cu" as Pestana,
  errorCarga: "",
  /** Zoom independiente por diagrama. */
  zoom: { clases: 1, secuencia: 1 } as Record<"clases" | "secuencia", number>,
  res: { clases: new Set<string>(), mensajes: new Set<number>(), pasos: new Set<number>() } as Resaltado,
};
estado.cu = estado.ejercicios[0]?.ejercicio.casosDeUso[0]?.id ?? "";

const app = document.getElementById("app")!;

const actual = (): EjercicioCargado | undefined => estado.ejercicios[estado.ej];
const modeloCU = (): ModeloCanonico | undefined => actual()?.modelos.get(estado.cu);

/** Violaciones del modelo del CU, filtradas a las que corresponden a ese CU (o sin CU). */
function violacionesCU(m: ModeloCanonico, cu: string): Violacion[] {
  return validar(m).filter((v) => !v.refs?.cu || v.refs.cu === cu);
}

function limpiarResaltado() {
  estado.res = { clases: new Set(), mensajes: new Set(), pasos: new Set() };
}

function render() {
  const ec = actual();
  const m = modeloCU();
  const cuDef = m?.casosDeUso.find((c) => c.id === estado.cu);
  const real = m?.realizaciones.find((r) => r.cu === estado.cu);
  const viol = m ? violacionesCU(m, estado.cu) : [];
  const nB = viol.filter((v) => v.severidad === "B").length;

  const listaCU = (ec?.ejercicio.casosDeUso ?? [])
    .map((cu) => {
      const mm = ec!.modelos.get(cu.id);
      const vv = mm ? violacionesCU(mm, cu.id) : [];
      const b = vv.filter((v) => v.severidad === "B").length;
      const insignia = !mm ? `<span class="insignia gris">sin modelo</span>`
        : b ? `<span class="insignia roja">${b}</span>`
        : vv.length ? `<span class="insignia ambar">${vv.length}</span>` : `<span class="insignia verde">✓</span>`;
      return `<button class="item-cu${cu.id === estado.cu ? " activo" : ""}" data-cu="${esc(cu.id)}">
        <span class="id-cu">${esc(cu.id)}</span><span class="nombre-cu">${esc(cu.nombre)}</span>${insignia}</button>`;
    })
    .join("");

  const opcionesEj = estado.ejercicios
    .map((e, i) => `<option value="${i}"${i === estado.ej ? " selected" : ""}>${esc(e.ejercicio.nombre)} (${esc(e.ejercicio.tipo)})</option>`)
    .join("");

  let contenido = `<p class="vacio">Elegí un caso de uso.</p>`;
  if (m && cuDef && ec) {
    if (estado.pestana === "cu") {
      const consignas = ec.ejercicio.consignas.filter((c) => ec.ejercicio.casosDeUso.find((x) => x.id === estado.cu)?.consignas.includes(c.nro));
      const porPaso = new Map<number, number[]>();
      for (const x of real?.mensajes ?? []) if (x.pasoCU !== undefined) porPaso.set(x.pasoCU, [...(porPaso.get(x.pasoCU) ?? []), x.nro]);
      contenido = `
        ${consignas.length ? `<section class="tarjeta"><h3>Consignas que aplican a este CU</h3><ol class="consignas">${consignas
          .map((c) => `<li><span class="nro-consigna">${esc(c.nro)}</span> ${esc(c.texto)}</li>`).join("")}</ol></section>` : ""}
        <section class="tarjeta">
          <h3>${esc(cuDef.id)} — ${esc(cuDef.nombre)} <span class="sutil">actor: ${esc(cuDef.actor)}</span></h3>
          <p class="ayuda">Clic en un paso para ver qué mensajes lo realizan en el diagrama de secuencia.</p>
          <table class="tabla-pasos"><thead><tr><th>#</th><th>Quién</th><th>Paso</th><th>Mensajes</th></tr></thead><tbody>
          ${cuDef.pasos.map((p) => {
            const ms = porPaso.get(p.nro) ?? [];
            const sinReal = viol.some((v) => v.refs?.pasos?.includes(p.nro));
            return `<tr class="paso${estado.res.pasos.has(p.nro) ? " resaltado" : ""}${sinReal ? " error" : ""}" data-paso="${p.nro}">
              <td>${p.nro}</td><td><span class="quien ${p.quien === "Actor" ? "q-actor" : "q-sistema"}">${p.quien}</span></td>
              <td>${esc(p.texto)}</td><td class="nros">${ms.length ? `${ms[0]}–${ms[ms.length - 1]} <span class="sutil">(${ms.length})</span>` : "—"}</td></tr>`;
          }).join("")}
          </tbody></table>
          ${cuDef.alternativos?.length ? `<h4>Flujos alternativos</h4><ul class="alternativos">${cuDef.alternativos.map((a) => `<li><b>${esc(a.id)}</b> ${esc(a.texto)}</li>`).join("")}</ul>` : ""}
        </section>`;
    } else {
      const svg = estado.pestana === "clases" ? svgClases(m, viol, estado.res) : real ? svgSecuencia(m, real, viol, estado.res) : "";
      const nota = estado.pestana === "secuencia" && real?.vista === "comunicacion"
        ? `<p class="aviso">Transcripto de un <b>diagrama de comunicación</b>; se muestra como secuencia con los mismos mensajes y numeración.</p>` : "";
      const ayuda = estado.pestana === "clases"
        ? "Clic en una clase para resaltar dónde participa en la secuencia. Línea punteada: dependencia derivada de la realización. En rojo: métodos usados pero no declarados."
        : "Clic en una línea de vida para resaltar su clase. Rojo: violación bloqueante · ámbar: advertencia. Pasá el mouse por un mensaje para ver el paso del CU.";
      contenido = `${nota}<div class="barra-diagrama"><p class="ayuda">${ayuda}</p>
        <div class="zoom"><button data-zoom="-">−</button><span>${Math.round(zoomActual() * 100)}%</span><button data-zoom="+">+</button><button data-zoom="fit">Ajustar</button></div></div>
        <div class="lienzo" id="lienzo">${svg}</div>`;
    }
  }

  const panelViol = !m ? "" : viol.length === 0
    ? `<p class="ok">Sin violaciones: el CU, el diagrama de clases y el de secuencia son consistentes.</p>`
    : viol.map((v, i) => `<button class="violacion ${v.severidad === "B" ? "bloq" : "adv"}" data-viol="${i}">
        <span class="regla">${esc(v.regla)}</span><span class="detalle">${esc(v.detalle)}</span><span class="ubic">${esc(v.ubicacion)}</span></button>`).join("");

  const hayResaltado = estado.res.clases.size || estado.res.mensajes.size || estado.res.pasos.size;

  app.innerHTML = `
  <header class="cabecera">
    <div class="marca"><span class="logo">DSI</span><div><h1>Profesor DSI</h1><p>Modelado UML consistente · UTN FRC</p></div></div>
    <div class="acciones-cabecera">
      <select id="sel-ej" aria-label="Ejercicio">${opcionesEj}</select>
      <label class="boton-sec">Cargar modelo JSON<input type="file" id="archivo" accept=".json,application/json" hidden></label>
      ${estado.errorCarga ? `<p class="error-carga" role="alert">${esc(estado.errorCarga)}</p>` : ""}
    </div>
  </header>
  <div class="cuerpo">
    <aside class="lateral">
      ${ec ? `<div class="info-ej"><h2>${esc(ec.ejercicio.nombre)}</h2><p class="sutil">${esc(ec.ejercicio.fuente)}</p>
        ${ec.ejercicio.objetivo ? `<p class="objetivo">${esc(ec.ejercicio.objetivo)}</p>` : ""}</div>` : ""}
      <h3 class="titulo-seccion">Casos de uso analizados</h3>
      <nav class="lista-cu">${listaCU}</nav>
      <p class="pie-lateral">Diagramas de actividad: fuera de alcance por ahora.</p>
    </aside>
    <main class="principal">
      <div class="pestanas" role="tablist">
        ${(["cu", "clases", "secuencia"] as Pestana[]).map((p) => `<button role="tab" class="pestana${estado.pestana === p ? " activa" : ""}" data-pestana="${p}">${
          p === "cu" ? "Caso de uso y consignas" : p === "clases" ? "Diagrama de clases" : "Diagrama de secuencia"}</button>`).join("")}
        ${hayResaltado ? `<button class="limpiar" data-limpiar>Quitar resaltado ✕</button>` : ""}
      </div>
      <div class="contenido">${contenido}</div>
    </main>
    <aside class="validacion">
      <h3 class="titulo-seccion">Validación <span class="insignia ${nB ? "roja" : viol.length ? "ambar" : "verde"}">${viol.length}</span></h3>
      <p class="sutil">${REGLAS.length} reglas de consistencia. Clic en una violación para verla en el diagrama.</p>
      <div class="lista-viol">${panelViol}</div>
    </aside>
  </div>`;

  aplicarZoom();
  conectar(viol);
}

/** Lleva el lienzo (no la página) hasta el elemento: inicio del mensaje o centro de la clase. */
function desplazarA(selector: string) {
  const lienzo = document.getElementById("lienzo");
  const el = lienzo?.querySelector<SVGGraphicsElement>(selector);
  if (!lienzo || !el) return;
  const z = zoomActual();
  const bb = el.getBBox();
  const esMensaje = el.hasAttribute("data-nro");
  lienzo.scrollLeft = Math.max(0, (esMensaje ? bb.x - 60 : bb.x + bb.width / 2) * z - (esMensaje ? 0 : lienzo.clientWidth / 2));
  lienzo.scrollTop = Math.max(0, (bb.y + bb.height / 2) * z - lienzo.clientHeight / 2);
}

function zoomActual(): number {
  return estado.pestana === "cu" ? 1 : estado.zoom[estado.pestana];
}

function aplicarZoom() {
  const svg = document.querySelector<SVGSVGElement>("#lienzo svg");
  if (!svg) return;
  const w = Number(svg.dataset.baseW);
  const h = Number(svg.dataset.baseH);
  svg.setAttribute("width", String(w * zoomActual()));
  svg.setAttribute("height", String(h * zoomActual()));
}

function conectar(viol: Violacion[]) {
  document.getElementById("sel-ej")?.addEventListener("change", (e) => {
    estado.ej = Number((e.target as HTMLSelectElement).value);
    estado.cu = actual()?.ejercicio.casosDeUso[0]?.id ?? "";
    limpiarResaltado();
    render();
  });
  document.getElementById("archivo")?.addEventListener("change", async (e) => {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    try {
      const ec = desdeArchivo(f.name, JSON.parse(await f.text()));
      estado.errorCarga = "";
      estado.ejercicios.push(ec);
      estado.ej = estado.ejercicios.length - 1;
      estado.cu = ec.ejercicio.casosDeUso[0]?.id ?? "";
      limpiarResaltado();
      render();
    } catch (err) {
      estado.errorCarga = `No se pudo cargar ${f.name}: ${(err as Error).message}`;
      render();
    }
  });
  app.querySelectorAll<HTMLElement>("[data-cu]").forEach((b) =>
    b.addEventListener("click", () => { estado.cu = b.dataset.cu!; limpiarResaltado(); render(); }));
  app.querySelectorAll<HTMLElement>("[data-pestana]").forEach((b) =>
    b.addEventListener("click", () => { estado.pestana = b.dataset.pestana as Pestana; render(); }));
  app.querySelector("[data-limpiar]")?.addEventListener("click", () => { limpiarResaltado(); render(); });
  app.querySelectorAll<HTMLElement>("[data-paso]").forEach((tr) =>
    tr.addEventListener("click", () => {
      const paso = Number(tr.dataset.paso);
      const real = modeloCU()?.realizaciones.find((r) => r.cu === estado.cu);
      limpiarResaltado();
      estado.res.pasos.add(paso);
      for (const x of real?.mensajes ?? []) if (x.pasoCU === paso) estado.res.mensajes.add(x.nro);
      estado.pestana = "secuencia";
      render();
    }));
  app.querySelectorAll<SVGGElement>("#lienzo [data-clase]").forEach((g) =>
    g.addEventListener("click", () => {
      const c = g.dataset.clase!;
      const ya = estado.res.clases.has(c);
      limpiarResaltado();
      if (!ya) estado.res.clases.add(c);
      estado.pestana = estado.pestana === "clases" && !ya ? "secuencia" : estado.pestana === "secuencia" && !ya ? "clases" : estado.pestana;
      render();
    }));
  app.querySelectorAll<HTMLElement>("[data-viol]").forEach((b) =>
    b.addEventListener("click", () => {
      const v = viol[Number(b.dataset.viol)];
      limpiarResaltado();
      v.refs?.clases?.forEach((c) => estado.res.clases.add(c));
      v.refs?.mensajes?.forEach((n) => estado.res.mensajes.add(n));
      v.refs?.pasos?.forEach((p) => estado.res.pasos.add(p));
      estado.pestana = v.refs?.mensajes?.length ? "secuencia" : v.refs?.pasos?.length ? "cu" : "clases";
      render();
      const primero = v.refs?.mensajes?.[0];
      const sel = primero !== undefined ? `#lienzo [data-nro="${primero}"]` : v.refs?.clases?.[0] ? `#lienzo [data-clase="${CSS.escape(v.refs.clases[0])}"]` : "";
      if (sel) desplazarA(sel);
    }));
  app.querySelectorAll<HTMLElement>("[data-zoom]").forEach((b) =>
    b.addEventListener("click", () => {
      if (estado.pestana === "cu") return;
      const t = estado.pestana;
      const z = b.dataset.zoom;
      if (z === "+") estado.zoom[t] = Math.min(2, estado.zoom[t] + 0.1);
      else if (z === "-") estado.zoom[t] = Math.max(0.3, estado.zoom[t] - 0.1);
      else {
        const lienzo = document.getElementById("lienzo");
        const svg = lienzo?.querySelector<SVGSVGElement>("svg");
        if (lienzo && svg) estado.zoom[t] = Math.max(0.3, Math.min(1, (lienzo.clientWidth - 16) / Number(svg.dataset.baseW)));
      }
      render();
    }));
}

// Las cajas se dimensionan midiendo texto: esperar las fuentes antes de dibujar.
const fuentes = (document as Document & { fonts?: FontFaceSet }).fonts;
Promise.race([fuentes?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1500))]).then(render);
