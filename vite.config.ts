import { defineConfig } from "vite";

// La app web vive en web/ y reutiliza src/ (modelo y validador) y corpus/ (ejercicios).
export default defineConfig({
  root: "web",
  server: { fs: { allow: [".."] } },
  build: { outDir: "../dist", emptyOutDir: true },
});
