export const FUENTE_FAMILIA = "'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
export const FUENTE = `12px ${FUENTE_FAMILIA}`;
export const FUENTE_NEGRITA = `600 12.5px ${FUENTE_FAMILIA}`;

const ctx = document.createElement("canvas").getContext("2d")!;

/** Ancho en píxeles de un texto con la fuente dada (para dimensionar cajas). */
export function ancho(texto: string, fuente = FUENTE): number {
  ctx.font = fuente;
  return ctx.measureText(texto).width;
}

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export interface Resaltado {
  clases: Set<string>;
  mensajes: Set<number>;
  pasos: Set<number>;
}

export const MARCADORES = `
<defs>
  <marker id="flecha-llena" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 z" class="punta-llena"/>
  </marker>
  <marker id="flecha-abierta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10" class="punta-abierta"/>
  </marker>
</defs>`;
