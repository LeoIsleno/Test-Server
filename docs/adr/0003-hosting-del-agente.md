# ADR-0003 — Dónde corre el loop del agente

**Estado:** Propuesto

## Opciones
1. **Messages API + tool use** (loop propio o *tool runner* del SDK): control total,
   reproducible, todo el estado en nuestra base. Adecuado para el workflow principal.
2. **Claude Managed Agents** (beta): Anthropic hospeda el loop y un contenedor por
   sesión; agentes versionados. Se factura tiempo de sesión además de tokens y las
   sesiones se conservan hasta borrarlas. Útil si el modo tutor necesita sesiones largas.
3. **Claude Agent SDK**: arnés de Claude Code como librería, hospedado por nosotros.

## Propuesta
Workflow principal (router → modelador → validador → proyector) sobre la **Messages API**
porque es un pipeline controlado por código y conviene que sea reproducible para la
evaluación. Reevaluar Managed Agents para el modo tutor en la fase 5.
