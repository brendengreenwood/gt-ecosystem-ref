import { createServer } from "vite";
import React from "react";
import { renderToString } from "react-dom/server";

const vite = await createServer({ root: process.cwd(), server: { middlewareMode: true }, appType: "custom" });
const { ACTORS } = await vite.ssrLoadModule("/src/data/actors.js");
const { PERSONAS } = await vite.ssrLoadModule("/src/data/personas.js");
const TH = await vite.ssrLoadModule("/src/views/TradingHouseView.jsx");
const AV = await vite.ssrLoadModule("/src/views/ActorView.jsx");
const SD = await vite.ssrLoadModule("/src/views/SystemDynamicsView.jsx");
const App = (await vite.ssrLoadModule("/src/App.jsx")).default;

const h = React.createElement;
const cases = [
  ["App", h(App)],
  ["TheHouseView", h(TH.TheHouseView, { isMobile: false })],
  ["SystemDynamicsView", h(SD.SystemDynamicsView, { isMobile: false })],
  ...Object.keys(PERSONAS).map(p => [`TradingHouseView:${p}`, h(TH.TradingHouseView, { selectedPersona: p, onSelectPersona() {}, isMobile: false })]),
  ...ACTORS.map(a => [`ActorDetail:${a.id}`, h(AV.ActorDetail, { actor: a, isMobile: true })]),
  ["MobileActorSelector", h(AV.MobileActorSelector, { selectedActor: "producer", onSelect() {}, isOpen: true, onToggle() {} })],
];
let fail = 0;
for (const [name, el] of cases) {
  try { const out = renderToString(el); console.log("ok ", name, out.length); }
  catch (e) { fail++; console.log("FAIL", name, e.message); }
}
await vite.close();
console.log(fail ? `${fail} failures` : "all rendered");
process.exit(fail ? 1 : 0);
