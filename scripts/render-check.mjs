import { createServer } from "vite";
import React from "react";
import { renderToString } from "react-dom/server";
import { readFileSync } from "node:fs";

const appSource = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

const vite = await createServer({ root: process.cwd(), server: { middlewareMode: true }, appType: "custom" });
const { ACTORS, COMMODITIES } = await vite.ssrLoadModule("/src/data/actors.js");
const { PERSONAS } = await vite.ssrLoadModule("/src/data/personas.js");
const TH = await vite.ssrLoadModule("/src/views/TradingHouseView.jsx");
const AV = await vite.ssrLoadModule("/src/views/ActorView.jsx");
const SD = await vite.ssrLoadModule("/src/views/SystemDynamicsView.jsx");
const App = (await vite.ssrLoadModule("/src/App.jsx")).default;
const FilterBar = (await vite.ssrLoadModule("/src/views/FilterBar.jsx")).default;

const h = React.createElement;
const F = (o) => ({ commodity: null, lens: null, effectType: null, ...o });
const summary = (o) => Object.entries(o).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join(",") || "none";
const byId = (id) => ACTORS.find(a => a.id === id);
const detail = (id, f) => [`ActorDetail:${id}[${summary(f)}]`, h(AV.ActorDetail, { actor: byId(id), isMobile: true, filters: F(f) })];
const noop = () => {};

// [label, element, optional assertion on rendered HTML -> error string | null]
const cases = [
  ["App", h(App)],
  ["TheHouseView", h(TH.TheHouseView, { isMobile: false })],
  ["SystemDynamicsView", h(SD.SystemDynamicsView, { isMobile: false })],
  ...Object.keys(PERSONAS).map(p => [`TradingHouseView:${p}`, h(TH.TradingHouseView, { selectedPersona: p, onSelectPersona: noop, isMobile: false })]),
  ...ACTORS.map(a => [`ActorDetail:${a.id}`, h(AV.ActorDetail, { actor: a, isMobile: true })]),
  ["MobileActorSelector", h(AV.MobileActorSelector, { selectedActor: "producer", onSelect: noop, isOpen: true, onToggle: noop })],
  // Phase 3 filter cases
  detail("bunge", { commodity: "corn" }),
  detail("bunge", { lens: "merchant" }),
  detail("bunge", { effectType: "pressure" }),
  detail("bunge", { commodity: "corn", lens: "merchant", effectType: "pressure" }),
  [...detail("usda", { lens: "originator" }), html => html.includes("outside lens") ? null : "missing 'outside lens'"],
  [`MobileActorSelector[lens=originator,selected=usda]`,
    h(AV.MobileActorSelector, { selectedActor: "usda", onSelect: noop, isOpen: true, onToggle: noop, filters: F({ lens: "originator" }) }),
    html => html.includes("USDA") && html.includes("outside lens") ? null : "missing USDA or 'outside lens'"],
  [...detail("insurance", { commodity: "wheat", effectType: "opportunity" }),
    html => html.includes("No cross-references for this filter.") ? null : "missing empty state"],
  [`SystemDynamicsView[commodity=wheat]`, h(SD.SystemDynamicsView, { isMobile: false, filters: F({ commodity: "wheat" }) })],
  [`SystemDynamicsView[commodity=corn,effectType=pressure]`, h(SD.SystemDynamicsView, { isMobile: false, filters: F({ commodity: "corn", effectType: "pressure" }) })],
  [`FilterBar[none]`, h(FilterBar, { filters: F({}), onChange: noop, showEffectType: true, isMobile: false }),
    html => html.includes("Clear") ? "Clear button rendered with no filters" : null],
  [`FilterBar[all-set]`, h(FilterBar, { filters: F({ commodity: "corn", lens: "merchant", effectType: "pressure" }), onChange: noop, showEffectType: true, isMobile: false }),
    html => html.includes('aria-pressed="true"') && /<button type="button"[^>]*>Clear<\/button>/.test(html) ? null : "missing aria-pressed=true or Clear button"],
  // persona audience cases
  ["TradingHouseView[default]", h(TH.TradingHouseView, { selectedPersona: "merchant", onSelectPersona: noop, isMobile: false }),
    html => (html.split("Primary user").length - 1) === 1 && html.includes("Secondary user") ? null : "expected exactly one 'Primary user' badge and a 'Secondary user' badge"],
  ["App[roles-default]", h(App), () => appSource.includes('setSelectedPersona] = useState("merchant")') ? null : "App.jsx does not default selectedPersona to \"merchant\""],
];
let fail = 0;
if (Object.keys(COMMODITIES).length === 3) console.log("ok", "COMMODITIES:3-keys", 3);
else { fail++; console.log("FAIL", "COMMODITIES:3-keys", `expected 3 keys, got ${Object.keys(COMMODITIES).length}`); }
for (const [name, el, assert] of cases) {
  try {
    const out = renderToString(el);
    const err = assert ? assert(out) : null;
    if (err) { fail++; console.log("FAIL", name, err); }
    else console.log("ok", name, out.length);
  }
  catch (e) { fail++; console.log("FAIL", name, e.message); }
}
await vite.close();
console.log(fail ? `${fail} failures` : "all rendered");
process.exit(fail ? 1 : 0);
