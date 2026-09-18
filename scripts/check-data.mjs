// Referential-integrity and baseline-preservation check for src/data.
// Exits 1 on any failure. Run: node scripts/check-data.mjs
import { ACTORS, COMMODITIES } from "../src/data/actors.js";
import { SYSTEM_DYNAMICS } from "../src/data/system-dynamics.js";
import { CROSS_REFERENCES, EFFECT_TYPES, getInboundEffects } from "../src/data/cross-references.js";
import { PERSONAS } from "../src/data/personas.js";

// Snapshot of main (pre-Cargill) data: 13 actor ids, 64 actorId|strategyName pairs,
// 34 cross-ref records / 88 effects. Nothing here may be removed or altered
// (only the added `commodities` field may differ on current effects).
const BASELINE = {
  actorIds: ["producer","country-elevator","terminal-elevator","trading-house","processor","feeder","exporter","speculator","broker","logistics","usda","insurance","lender"],
  strategies: [
    "producer|Flat Price / Cash Contract",
    "producer|Basis Contract",
    "producer|Hedge-to-Arrive (HTA)",
    "producer|Minimum Price Contract",
    "producer|Delayed Pricing / Price Later",
    "producer|Scale-Up Selling",
    "producer|Target Pricing",
    "producer|Cost-of-Production Floor",
    "producer|Re-Own with Call Options",
    "producer|Revenue Protection Crop Insurance",
    "producer|Portfolio Pricing Across Crop Years",
    "producer|Withholding / Supply Timing",
    "country-elevator|Basis Posting / Manipulation",
    "country-elevator|Targeted Bidding",
    "country-elevator|Accumulation / Premium Basis",
    "country-elevator|Storage and Carry Capture",
    "country-elevator|Inverted Basis Posting",
    "country-elevator|Origination Hedging",
    "country-elevator|Multi-Point Basis Management",
    "country-elevator|Quality Blending",
    "country-elevator|Drying Margin Capture",
    "country-elevator|Destination Optimization",
    "country-elevator|Relationship / Loyalty Pricing",
    "terminal-elevator|Gulf Basis Trading",
    "terminal-elevator|Barge Position Management",
    "terminal-elevator|Throughput Maximization",
    "terminal-elevator|River Logistics Arbitrage",
    "trading-house|Information-Advantage Pricing",
    "trading-house|Origin Arbitrage",
    "trading-house|Integrated Chain Margin Capture",
    "trading-house|Freight and Logistics as a Profit Center",
    "trading-house|Policy and Trade Flow Anticipation",
    "processor|Crush / Grind / Ethanol Spread Management",
    "processor|Forward Coverage",
    "processor|Basis Bidding for Steady Flow",
    "processor|Co-Product Optimization",
    "processor|Feedstock Substitution",
    "processor|Tolling Arrangements",
    "feeder|Least-Cost Ration Optimization",
    "feeder|Feed/Livestock Margin Locking",
    "feeder|Forward Grain Buying",
    "feeder|Ingredient Substitution Arbitrage",
    "exporter|FOB / CIF Pricing",
    "exporter|Export Basis Trading",
    "exporter|Vessel Slot Optimization",
    "exporter|Destination Arbitrage",
    "speculator|Calendar Spread Trading",
    "speculator|Crush Spread",
    "speculator|Inter-Commodity Spreads",
    "speculator|Spatial Arbitrage",
    "speculator|USDA Report Positioning",
    "speculator|Seasonal Pattern Trading",
    "speculator|Options Volatility Strategies",
    "speculator|Trend Following / Momentum",
    "speculator|Mean Reversion",
    "speculator|Collar / Fence Strategies",
    "broker|Advisory Marketing Programs",
    "broker|Order Flow Aggregation Insight",
    "logistics|Shuttle Train Pricing",
    "logistics|Seasonal Surge Pricing",
    "logistics|Capacity as Leverage",
    "usda|Report Calendar as Market Structure",
    "insurance|Revenue Floor as Strategy Enabler",
    "lender|Marketing Loan Requirements",
  ],
  crossRefs: [
    {
      sourceActor: "producer",
      strategy: "Flat Price / Cash Contract",
      effects: [
        {"targetActor":"country-elevator","type":"opportunity","description":"Elevator locks in origination. Can immediately hedge the other side and capture basis margin with zero flat price risk."},
        {"targetActor":"broker","type":"signal","description":"Broker sees client locking in — aggregate producer selling tells them how much supply is priced vs. unpriced in the region."},
      ],
    },
    {
      sourceActor: "producer",
      strategy: "Basis Contract",
      effects: [
        {"targetActor":"country-elevator","type":"opportunity","description":"Elevator has the grain committed but the farmer hasn't set futures yet. Elevator can manage basis position knowing supply is locked. Also earns fees if the farmer takes too long to set the board."},
        {"targetActor":"speculator","type":"signal","description":"Aggregate unpriced basis contracts represent latent selling pressure — when farmers eventually set the board, it adds sell-side volume to futures."},
      ],
    },
    {
      sourceActor: "producer",
      strategy: "Hedge-to-Arrive (HTA)",
      effects: [
        {"targetActor":"country-elevator","type":"constraint","description":"Elevator has a futures commitment but no basis locked — they're exposed to basis risk until the farmer agrees to a basis level or delivers."},
        {"targetActor":"broker","type":"opportunity","description":"HTAs often require rolling if delivery is deferred. Each roll generates commission and requires advisory."},
      ],
    },
    {
      sourceActor: "producer",
      strategy: "Delayed Pricing / Price Later",
      effects: [
        {"targetActor":"country-elevator","type":"opportunity","description":"Elevator has the physical grain in-house and charges storage fees. They also have an unpriced position they must manage — but the storage revenue is guaranteed."},
        {"targetActor":"country-elevator","type":"constraint","description":"Elevator's space is occupied by unpriced grain, limiting capacity for other origination."},
        {"targetActor":"lender","type":"pressure","description":"Grain delivered but not priced means no revenue booked. Lender may view this as a risk to loan repayment timeline."},
      ],
    },
    {
      sourceActor: "producer",
      strategy: "Withholding / Supply Timing",
      effects: [
        {"targetActor":"country-elevator","type":"constraint","description":"Elevator can't originate what isn't delivered. If enough producers hold, the elevator's throughput drops and they may need to raise basis to attract supply."},
        {"targetActor":"processor","type":"pressure","description":"If local producers withhold, processors must bid basis up or source from farther away, increasing raw material cost."},
        {"targetActor":"terminal-elevator","type":"constraint","description":"Reduced interior flow means less grain reaching terminals, potentially tightening export-position supply."},
      ],
    },
    {
      sourceActor: "producer",
      strategy: "Scale-Up Selling",
      effects: [
        {"targetActor":"country-elevator","type":"signal","description":"Predictable selling pattern. Experienced elevators know that rallies will bring in producer sales at known increments — they can anticipate and pre-position."},
        {"targetActor":"speculator","type":"pressure","description":"Scale-up selling creates reliable resistance levels in the market — every rally runs into farmer selling, which can cap upside and frustrate momentum strategies."},
      ],
    },
    {
      sourceActor: "producer",
      strategy: "Revenue Protection Crop Insurance",
      effects: [
        {"targetActor":"lender","type":"opportunity","description":"High RP coverage de-risks the loan. Lenders can extend more credit or on better terms when insurance assignment is in place."},
        {"targetActor":"country-elevator","type":"signal","description":"When RP guarantees are high, producers may be less aggressive sellers — they're protected on the downside, so they can afford to wait. Elevator should expect slower origination."},
        {"targetActor":"speculator","type":"signal","description":"The February price discovery window for RP creates predictable activity in corn and soybean futures. Funds position around this."},
      ],
    },
    {
      sourceActor: "producer",
      strategy: "Re-Own with Call Options",
      effects: [
        {"targetActor":"country-elevator","type":"opportunity","description":"Producer sold the cash grain — elevator has it. The re-own is happening on paper via options, so the elevator's physical position is clean."},
        {"targetActor":"broker","type":"opportunity","description":"Call option purchase generates commission. Advisory on strike selection and timing adds value."},
      ],
    },
    {
      sourceActor: "country-elevator",
      strategy: "Basis Posting / Manipulation",
      effects: [
        {"targetActor":"producer","type":"signal","description":"Posted basis IS the market signal to the farmer. A strong basis says 'sell now.' A weak basis says 'hold or go elsewhere.' Farmers who watch basis are reading the elevator's supply needs in real time."},
        {"targetActor":"processor","type":"signal","description":"If nearby elevators are posting strong basis, it signals tight local supply — processors may need to compete harder for grain."},
        {"targetActor":"feeder","type":"signal","description":"Basis levels at local elevators tell feedlots what they'll pay for grain. Strong basis means expensive feed."},
      ],
    },
    {
      sourceActor: "country-elevator",
      strategy: "Targeted Bidding",
      effects: [
        {"targetActor":"producer","type":"opportunity","description":"Producers in the targeted geography get above-market bids. Those paying attention and positioned to deliver can capture the premium."},
        {"targetActor":"country-elevator","type":"pressure","description":"Competing elevators see aggressive bids pulling 'their' farmers. They must decide whether to match, accept the lost volume, or find other sources."},
        {"targetActor":"logistics","type":"signal","description":"Targeted bids often signal a logistics event — a shuttle loading, vessel deadline — that the logistics provider can price around."},
      ],
    },
    {
      sourceActor: "country-elevator",
      strategy: "Storage and Carry Capture",
      effects: [
        {"targetActor":"producer","type":"constraint","description":"When elevators fill space with owned grain earning carry, less commercial storage is available for delayed-pricing contracts. Producers may face storage charges or be forced to sell."},
        {"targetActor":"speculator","type":"signal","description":"Commercial storage filling up is visible in Commitments of Traders data. It signals the physical market is in carry-capture mode, which implies adequate nearby supply."},
      ],
    },
    {
      sourceActor: "country-elevator",
      strategy: "Destination Optimization",
      effects: [
        {"targetActor":"processor","type":"pressure","description":"When the elevator routes grain to export instead of the local processor because Gulf basis is better, the processor loses supply and must bid higher."},
        {"targetActor":"terminal-elevator","type":"opportunity","description":"More grain flowing to terminals when export basis is strong. Terminals benefit from increased throughput."},
        {"targetActor":"exporter","type":"opportunity","description":"Interior grain flowing toward export position increases available supply at Gulf, potentially easing export basis."},
      ],
    },
    {
      sourceActor: "country-elevator",
      strategy: "Quality Blending",
      effects: [
        {"targetActor":"producer","type":"constraint","description":"Producers delivering off-spec grain get discounted. But the elevator profits by blending it up to spec — the discount charged exceeds the blending cost. Producers sometimes feel the discount is unfair."},
        {"targetActor":"processor","type":"opportunity","description":"Blended grain meets processor specs at potentially lower basis than pure high-quality lots. Processors benefit from the elevator doing the quality management."},
      ],
    },
    {
      sourceActor: "country-elevator",
      strategy: "Drying Margin Capture",
      effects: [
        {"targetActor":"producer","type":"pressure","description":"Wet corn gets a moisture discount that may exceed the elevator's actual drying cost. The producer pays a premium for the elevator's drying infrastructure, especially during harvest crunch."},
      ],
    },
    {
      sourceActor: "terminal-elevator",
      strategy: "Barge Position Management",
      effects: [
        {"targetActor":"country-elevator","type":"constraint","description":"When terminals lock up barge capacity, interior elevators may struggle to move grain to river. Interior basis weakens because grain can't flow out."},
        {"targetActor":"exporter","type":"opportunity","description":"Terminals with secured barge positions can offer reliable delivery to Gulf — exporters pay a premium for certainty."},
        {"targetActor":"logistics","type":"opportunity","description":"Barge companies benefit from forward commitments — guaranteed utilization at contracted rates."},
      ],
    },
    {
      sourceActor: "terminal-elevator",
      strategy: "River Logistics Arbitrage",
      effects: [
        {"targetActor":"country-elevator","type":"pressure","description":"Low water events widen the interior-to-Gulf spread. Interior elevators see their selling basis to terminals weaken because transportation cost spiked."},
        {"targetActor":"exporter","type":"pressure","description":"Gulf basis spikes during river disruptions. Exporters must either pay up or miss vessel slots."},
        {"targetActor":"speculator","type":"opportunity","description":"River disruptions create spread trading opportunities between delivery months and between geographies."},
      ],
    },
    {
      sourceActor: "trading-house",
      strategy: "Information-Advantage Pricing",
      effects: [
        {"targetActor":"producer","type":"pressure","description":"Trading houses price ahead of public information. By the time USDA confirms what the houses already knew, the market has moved. Producers selling at 'market price' are often selling into a price the houses already positioned for."},
        {"targetActor":"speculator","type":"pressure","description":"Funds running models on public data are always behind the houses' private information. The houses are the informed counterparty in many trades."},
        {"targetActor":"country-elevator","type":"constraint","description":"Independent elevators selling to trading houses are pricing against a counterparty with superior information. The house knows what the grain is worth at destination better than the elevator does."},
      ],
    },
    {
      sourceActor: "trading-house",
      strategy: "Origin Arbitrage",
      effects: [
        {"targetActor":"exporter","type":"pressure","description":"When houses shift sourcing from US to Brazil, US export demand drops, Gulf basis weakens, and US exporters lose business."},
        {"targetActor":"producer","type":"pressure","description":"Origin switching means US producers are competing globally. When Brazilian corn is cheap, US producers face weaker basis even if CBOT futures hold."},
        {"targetActor":"terminal-elevator","type":"constraint","description":"Reduced US export flow means less throughput at terminals. They lose volume when the houses route supply elsewhere."},
      ],
    },
    {
      sourceActor: "trading-house",
      strategy: "Policy and Trade Flow Anticipation",
      effects: [
        {"targetActor":"speculator","type":"opportunity","description":"Policy changes (export bans, tariffs) create massive volatility events. Funds that position correctly can profit enormously — but the houses are usually positioned first."},
        {"targetActor":"producer","type":"pressure","description":"Trade policy changes (e.g., China tariffs on US soybeans in 2018) can crush basis overnight. Producers with unpriced grain take the hit."},
        {"targetActor":"exporter","type":"constraint","description":"Export bans or tariffs in origin countries disrupt committed vessel schedules. Phytosanitary bans in destination countries strand grain in transit."},
      ],
    },
    {
      sourceActor: "processor",
      strategy: "Crush / Grind / Ethanol Spread Management",
      effects: [
        {"targetActor":"speculator","type":"opportunity","description":"The crush spread is a tradeable instrument. Speculators can trade the same spread without processing a single bean. Processor hedging activity creates the liquidity."},
        {"targetActor":"feeder","type":"signal","description":"When processors lock in favorable crush margins and run hard, soybean meal supply increases, which can soften meal prices for feedlots."},
      ],
    },
    {
      sourceActor: "processor",
      strategy: "Basis Bidding for Steady Flow",
      effects: [
        {"targetActor":"country-elevator","type":"pressure","description":"Processors bidding directly to farmers for delivery can bypass the elevator entirely. Elevators near processing plants compete for the same supply."},
        {"targetActor":"producer","type":"opportunity","description":"Processor bids give farmers another outlet, creating basis competition between the processor and the elevator. More bidders = better basis for the farmer."},
      ],
    },
    {
      sourceActor: "processor",
      strategy: "Feedstock Substitution",
      effects: [
        {"targetActor":"producer","type":"pressure","description":"When an ethanol plant switches from corn to sorghum, local corn demand drops and basis weakens for corn producers. Sorghum producers benefit."},
        {"targetActor":"speculator","type":"signal","description":"Substitution economics create inter-commodity spread opportunities. When substitution thresholds are hit, relative prices adjust."},
      ],
    },
    {
      sourceActor: "feeder",
      strategy: "Least-Cost Ration Optimization",
      effects: [
        {"targetActor":"producer","type":"pressure","description":"Feedlots constantly threatening to substitute away from any single grain. This caps how much any grain can rally before demand destruction kicks in."},
        {"targetActor":"processor","type":"signal","description":"DDG and soybean meal demand from feedlots fluctuates with ration optimization. When corn is cheap, DDGs lose value. When corn is expensive, DDGs gain."},
      ],
    },
    {
      sourceActor: "feeder",
      strategy: "Ingredient Substitution Arbitrage",
      effects: [
        {"targetActor":"speculator","type":"signal","description":"Feed substitution is one of the fundamental mechanisms that links grain markets. Extreme corn/wheat ratios trigger substitution that snaps the ratio back. Speculators trade around these thresholds."},
        {"targetActor":"country-elevator","type":"signal","description":"When feedlots switch from corn to wheat, corn basis weakens in feed-deficit areas. Elevators near livestock concentrations see this first."},
      ],
    },
    {
      sourceActor: "exporter",
      strategy: "Export Basis Trading",
      effects: [
        {"targetActor":"terminal-elevator","type":"opportunity","description":"Strong export demand pulls Gulf basis up, which strengthens terminal basis, increasing the margin terminals earn on interior grain."},
        {"targetActor":"country-elevator","type":"opportunity","description":"Export demand ripples inland — Gulf basis strength pulls interior basis up, giving elevators better sell-side basis to terminals."},
        {"targetActor":"producer","type":"opportunity","description":"Active export demand strengthens the entire basis chain from Gulf to farm gate. Producers benefit even if futures prices don't move."},
      ],
    },
    {
      sourceActor: "exporter",
      strategy: "Vessel Slot Optimization",
      effects: [
        {"targetActor":"terminal-elevator","type":"pressure","description":"Exporters scrambling to fill a vessel deadline bid up Gulf basis and demand immediate delivery — terminals with grain on hand capture premium."},
        {"targetActor":"country-elevator","type":"pressure","description":"Urgent export demand pulls grain quickly through the system. Elevators near logistics arteries get bid aggressively."},
        {"targetActor":"logistics","type":"opportunity","description":"Urgent vessel loading means premium freight rates for barge and rail. Logistics providers capture surge pricing."},
      ],
    },
    {
      sourceActor: "speculator",
      strategy: "Trend Following / Momentum",
      effects: [
        {"targetActor":"producer","type":"signal","description":"Fund buying on momentum pushes futures up, which pushes cash prices up. Producers who haven't priced benefit from the rally — but the smart ones use it as a selling opportunity."},
        {"targetActor":"country-elevator","type":"signal","description":"Fund buying rallies trigger producer selling (scale-up sellers hit targets). Elevators see deliveries pick up when funds push prices up."},
        {"targetActor":"processor","type":"pressure","description":"Fund-driven rallies raise raw material costs for processors who haven't forward-covered. Processors may be forced to buy at elevated levels to keep plants running."},
      ],
    },
    {
      sourceActor: "speculator",
      strategy: "USDA Report Positioning",
      effects: [
        {"targetActor":"producer","type":"pressure","description":"Report-day volatility can spike or crash prices. Producers with unpriced grain or open positions can get whipsawed. The volatility benefits those who are prepared and punishes those who aren't."},
        {"targetActor":"broker","type":"opportunity","description":"Report days generate massive trading volume and commission revenue. Advisory calls before and after reports are peak engagement."},
      ],
    },
    {
      sourceActor: "speculator",
      strategy: "Calendar Spread Trading",
      effects: [
        {"targetActor":"country-elevator","type":"signal","description":"Spread levels between delivery months reflect storage economics. When spreads are in full carry, it signals adequate supply. When spreads invert, it signals tightness. Elevators read these spreads to decide whether to store or sell."},
        {"targetActor":"producer","type":"signal","description":"Old crop / new crop spreads signal market expectations for supply transition. A wide spread between July and December corn tells producers the market sees very different conditions ahead."},
      ],
    },
    {
      sourceActor: "logistics",
      strategy: "Shuttle Train Pricing",
      effects: [
        {"targetActor":"country-elevator","type":"constraint","description":"Shuttle discounts incentivize building shuttle-capable elevators (75+ car loading). This concentrates grain flow and disadvantages smaller elevators that can't load shuttles — they pay higher per-car rates and lose competitive position."},
        {"targetActor":"producer","type":"constraint","description":"The shuttle system concentrates grain handling at larger, more distant elevators. Farmers near small elevators face wider basis because the elevator's freight costs are higher."},
        {"targetActor":"trading-house","type":"opportunity","description":"Trading houses can build or acquire shuttle facilities, capturing the freight discount and controlling the flow. Infrastructure becomes competitive advantage."},
      ],
    },
    {
      sourceActor: "logistics",
      strategy: "Capacity as Leverage",
      effects: [
        {"targetActor":"country-elevator","type":"pressure","description":"When the railroad rations cars, the elevator can't move grain. Basis widens because supply is physically trapped. The railroad's allocation decision directly determines elevator profitability."},
        {"targetActor":"terminal-elevator","type":"pressure","description":"Rail disruptions starve terminals of supply, reducing throughput and potentially causing them to miss downstream commitments."},
        {"targetActor":"exporter","type":"pressure","description":"Logistics bottlenecks at origin ripple to the port. If grain can't reach the Gulf, vessel slots go unfilled and export commitments are at risk."},
        {"targetActor":"producer","type":"pressure","description":"When logistics capacity is tight, the cost gets passed back to the farmer as weaker basis. The farmer is the end of the chain — they absorb what they can't pass back."},
      ],
    },
    {
      sourceActor: "usda",
      strategy: "Report Calendar as Market Structure",
      effects: [
        {"targetActor":"speculator","type":"opportunity","description":"Reports are the primary volatility catalyst. Funds position ahead of reports, trade the reaction, and manage the aftermath. The report calendar IS the speculator's event calendar."},
        {"targetActor":"producer","type":"signal","description":"USDA numbers change the market's view of value. A bearish WASDE can drop prices 20 cents in minutes. Producers with unpriced grain need to understand the report calendar or they're trading blind."},
        {"targetActor":"trading-house","type":"opportunity","description":"Houses position ahead of reports using private information. If they already know production is short, they're positioned before USDA confirms it."},
        {"targetActor":"broker","type":"opportunity","description":"Peak advisory and trading activity around every report. Clients call for guidance, execute trades, adjust hedges."},
      ],
    },
    {
      sourceActor: "insurance",
      strategy: "Revenue Floor as Strategy Enabler",
      effects: [
        {"targetActor":"producer","type":"opportunity","description":"High RP coverage is a license to forward-sell aggressively. The insurance catches yield risk, freeing the farmer to focus on price risk management."},
        {"targetActor":"lender","type":"opportunity","description":"Insurance de-risks the loan. Lenders often require insurance assignment and may offer better terms with higher coverage levels."},
        {"targetActor":"country-elevator","type":"signal","description":"High insurance guarantees may make producers less aggressive sellers in the short term — they're protected, so they can afford to wait. Elevator should expect slower origination and may need to raise basis."},
      ],
    },
    {
      sourceActor: "lender",
      strategy: "Marketing Loan Requirements",
      effects: [
        {"targetActor":"producer","type":"constraint","description":"Required forward pricing limits the farmer's flexibility. They may be forced to price when the lender says, not when the market says."},
        {"targetActor":"country-elevator","type":"signal","description":"Lender-forced selling creates predictable supply flow. Elevators near heavily leveraged farming areas can anticipate when grain will come to market."},
        {"targetActor":"broker","type":"opportunity","description":"Required hedging programs generate advisory and execution business. The broker helps the farmer meet lender requirements while maximizing flexibility."},
      ],
    },
  ],
};

const failures = [];
const fail = (msg) => failures.push(msg);

const actorById = new Map(ACTORS.map((a) => [a.id, a]));
const commodityKeys = new Set(Object.keys(COMMODITIES));
const effectKeys = new Set(Object.keys(EFFECT_TYPES));

function checkCommodities(label, tags) {
  if (!Array.isArray(tags) || tags.length === 0) return fail(`${label}: commodities missing or empty`);
  for (const t of tags) if (!commodityKeys.has(t)) fail(`${label}: unknown commodity "${t}"`);
}

// --- actors and strategies
if (new Set(ACTORS.map((a) => a.id)).size !== ACTORS.length) fail("duplicate actor ids");
let strategyCount = 0;
for (const a of ACTORS) {
  const names = new Set();
  for (const s of a.strategies) {
    strategyCount++;
    if (names.has(s.name)) fail(`${a.id}: duplicate strategy name "${s.name}"`);
    names.add(s.name);
    checkCommodities(`${a.id} / ${s.name}`, s.commodities);
  }
}

// --- dynamics
for (const d of SYSTEM_DYNAMICS) checkCommodities(`dynamic "${d.name}"`, d.commodities);

// --- cross-references
let effectCount = 0;
let dangling = 0;
const pairs = new Set();
for (const r of CROSS_REFERENCES) {
  const key = r.sourceActor + "|" + r.strategy;
  if (pairs.has(key)) fail(`duplicate cross-ref record ${key}`);
  pairs.add(key);
  const src = actorById.get(r.sourceActor);
  if (!src) { dangling++; fail(`cross-ref source actor "${r.sourceActor}" does not exist`); }
  else if (!src.strategies.some((s) => s.name === r.strategy)) { dangling++; fail(`cross-ref ${key}: no such strategy on ${r.sourceActor}`); }
  for (const e of r.effects) {
    effectCount++;
    if (!actorById.has(e.targetActor)) { dangling++; fail(`cross-ref ${key}: target "${e.targetActor}" does not exist`); }
    if (!effectKeys.has(e.type)) fail(`cross-ref ${key}: unknown effect type "${e.type}"`);
    checkCommodities(`cross-ref ${key} -> ${e.targetActor}`, e.commodities);
  }
}

// every actor participates in at least one cross-ref
for (const a of ACTORS) {
  const out = CROSS_REFERENCES.some((r) => r.sourceActor === a.id);
  const inb = CROSS_REFERENCES.some((r) => r.effects.some((e) => e.targetActor === a.id));
  if (!out && !inb) fail(`actor ${a.id} has no inbound or outbound cross-refs`);
}

// personas reference real actors
for (const [key, p] of Object.entries(PERSONAS)) {
  for (const id of [...p.primaryActors, ...p.secondaryActors]) {
    if (!actorById.has(id)) fail(`persona ${key}: unknown actor "${id}"`);
  }
}

// getInboundEffects must carry commodities through
const inbound = getInboundEffects("producer");
if (!inbound.length || !Array.isArray(inbound[0].commodities) || !inbound[0].commodities.length) {
  fail("getInboundEffects(\"producer\")[0].commodities is not a non-empty array");
}

// --- baseline preservation (structural compare)
for (const id of BASELINE.actorIds) if (!actorById.has(id)) fail(`baseline actor "${id}" removed`);
for (const pair of BASELINE.strategies) {
  const [id, name] = pair.split("|");
  const a = actorById.get(id);
  if (!a || !a.strategies.some((s) => s.name === name)) fail(`baseline strategy "${pair}" removed or renamed`);
}
for (const br of BASELINE.crossRefs) {
  const cur = CROSS_REFERENCES.find((r) => r.sourceActor === br.sourceActor && r.strategy === br.strategy);
  if (!cur) { fail(`baseline cross-ref ${br.sourceActor}|${br.strategy} removed`); continue; }
  for (const be of br.effects) {
    const match = cur.effects.some(
      (e) => e.targetActor === be.targetActor && e.type === be.type && e.description === be.description
    );
    if (!match) fail(`baseline effect ${br.sourceActor}|${br.strategy} -> ${be.targetActor} (${be.type}) removed or altered`);
  }
}

// --- Cargill perspective: named actors, no anonymous "ABCD" voice
for (const id of ["trading-house", "adm", "bunge", "ldc"]) {
  const a = actorById.get(id);
  if (!a) fail(`required actor "${id}" is missing`);
  else if (typeof a.company !== "string" || !a.company) fail(`actor ${id} has no company field`);
}
for (const a of ACTORS) if (a.role.includes("ABCD itself")) fail(`actor ${a.id} role still reads as "ABCD itself"`);
for (const [key, p] of Object.entries(PERSONAS)) if (p.role.includes("ABCD itself")) fail(`persona ${key} role still reads as "ABCD itself"`);

// demo fixture used by the Phase 3 walkthrough: Cargill -> Bunge, pressure, corn
const fixture = CROSS_REFERENCES.some(
  (r) => r.sourceActor === "trading-house" && r.effects.some((e) => e.targetActor === "bunge" && e.type === "pressure" && e.commodities.includes("corn"))
);
if (!fixture) fail('demo fixture missing: no trading-house effect on bunge with type "pressure" tagged "corn"');

// --- competitor cardinality (mandatory)
for (const id of ["adm", "bunge", "ldc"]) {
  if (!actorById.has(id)) { fail(`actor "${id}" is missing; competitor cardinality cannot be checked`); continue; }
  const toHouse = new Set(
    CROSS_REFERENCES.filter((r) => r.sourceActor === id && r.effects.some((e) => e.targetActor === "trading-house")).map((r) => r.strategy)
  );
  if (toHouse.size < 2) fail(`${id}: needs >=2 distinct strategies with an effect on trading-house (has ${toHouse.size})`);
  const fromHouse = CROSS_REFERENCES.some((r) => r.sourceActor === "trading-house" && r.effects.some((e) => e.targetActor === id));
  if (!fromHouse) fail(`${id}: no trading-house strategy has an effect targeting it`);
}

for (const f of failures) console.log("FAIL", f);
console.log(`check-data: actors ${ACTORS.length} strategies ${strategyCount} xrefs ${CROSS_REFERENCES.length} effects ${effectCount} dangling ${dangling}`);
process.exit(failures.length ? 1 : 0);
