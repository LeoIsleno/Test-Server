import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

/**
 * Convierte el build de Vite (dist/) en una sola página HTML autocontenida para publicar
 * como Artifact de claude.ai: CSS y JS inline, sin <html>/<head>/<body> propios
 * (el visor agrega el esqueleto). Salida: artifact/profesor-dsi.html
 */
const assets = readdirSync("dist/assets");
const css = assets.filter((f) => f.endsWith(".css")).map((f) => readFileSync(`dist/assets/${f}`, "utf8")).join("\n");
const js = assets.filter((f) => f.endsWith(".js")).map((f) => readFileSync(`dist/assets/${f}`, "utf8")).join("\n");

const html = `<title>Profesor DSI</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
<style>
${css}
</style>
<div id="app"></div>
<script type="module">
${js.replace(/<\/script/gi, "<\\/script")}
</script>
`;
mkdirSync("artifact", { recursive: true });
writeFileSync("artifact/profesor-dsi.html", html);
console.log(`artifact/profesor-dsi.html (${(html.length / 1024).toFixed(0)} KB)`);
