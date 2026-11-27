import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { ModeloCanonico } from "../src/modelo/tipos.ts";
import { validar } from "../src/validador/index.ts";

const cargar = (): ModeloCanonico =>
  JSON.parse(readFileSync("corpus/epc-lineas-aereas/modelo/cu2-cancelar-vuelo.json", "utf8"));

const resumen = (m: ModeloCanonico) =>
  validar(m).map((v) => `${v.regla}|${v.detalle}`).sort();

test("Líneas Aéreas CU2 tal cual el EPC: detecta los hallazgos H1, H2, H3, H7 y H8", () => {
  const v = validar(cargar());
  const de = (regla: string) => v.filter((x) => x.regla === regla).map((x) => x.detalle);

  // H2: Vuelo recibe cancelar() y crearCambioEstadoVuelo() sin tenerlos
  assert.ok(de("RC-01").includes("Vuelo no tiene el método cancelar()"));
  assert.ok(de("RC-01").includes("Vuelo no tiene el método crearCambioEstadoVuelo()"));
  assert.ok(de("DT-01").some((d) => d.includes("/cancelar()")));
  // H3: notificar() vs notificarEstadoVuelo()
  assert.ok(de("RC-01").includes("GestorCancelacionVuelo no tiene el método notificar()"));
  // H1: la versión extendida del CU no incluye EnEjecucion; H7: ninguna incluye Cerrado
  assert.ok(v.some((x) => x.regla === "DT-03" && x.ubicacion.includes("extendida") && x.detalle.includes("EnEjecucion")));
  assert.ok(v.some((x) => x.regla === "DT-03" && x.ubicacion.includes("abreviada") && x.detalle.includes("Cerrado")));
  // H8: Aeropuerto -> Ciudad sin navegabilidad
  assert.ok(de("RC-03").some((d) => d.startsWith("Aeropuerto envía mensajes a Ciudad")));

  assert.equal(v.length, 7);
});

test("Al aplicar las correcciones propuestas no quedan violaciones", () => {
  const m = cargar();
  const vuelo = m.clases.find((c) => c.nombre === "Vuelo")!;
  vuelo.metodos.push("cancelar", "crearCambioEstadoVuelo");
  m.realizaciones[0].mensajes.find((x) => x.metodo === "notificar")!.metodo = "notificarEstadoVuelo";
  m.relaciones.push({ desde: "Aeropuerto", hacia: "Ciudad", rol: "ciudad", mult: "1" });
  for (const ver of m.casosDeUso[0].versiones!) {
    ver.estadosPermitidos = ["Demorado", "Programado", "EnEmbarque", "Reprogramado", "Cerrado", "EnEjecucion"];
  }
  assert.deepEqual(resumen(m), []);
});

test("RC-02: línea de vida con clase inexistente", () => {
  const m = cargar();
  m.realizaciones[0].lineasDeVida.push({ id: "x", clase: "Avion" });
  assert.ok(validar(m).some((v) => v.regla === "RC-02" && v.detalle.includes("Avion")));
});

test("CR-01: paso del CU sin mensajes", () => {
  const m = cargar();
  m.realizaciones[0].mensajes = m.realizaciones[0].mensajes.filter((x) => x.pasoCU !== 6);
  assert.ok(validar(m).some((v) => v.regla === "CR-01" && v.ubicacion === "CU2 paso 6"));
});

test("CR-03: mensaje fuera de orden", () => {
  const m = cargar();
  m.realizaciones[0].mensajes.find((x) => x.nro === 30)!.pasoCU = 2;
  assert.ok(validar(m).some((v) => v.regla === "CR-03"));
});

test("CR-04: falta finCU()", () => {
  const m = cargar();
  m.realizaciones[0].mensajes.pop();
  assert.ok(validar(m).some((v) => v.regla === "CR-04"));
});
