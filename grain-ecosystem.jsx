import { useState } from "react";

/*
 * GRAIN TRADING ECOSYSTEM
 * 
 * Confidence notes (honest assessment):
 * - Producer strategies: HIGH confidence. Well-documented, lots of educational material.
 * - Speculator/fund strategies: HIGH confidence. Standard financial literature.
 * - Elevator/originator: MEDIUM confidence. Reconstructed from adjacent knowledge, 
 *   not from practitioner playbooks. Broad strokes correct, daily-reality details may be off.
 * - Processor operations: MEDIUM confidence. Public info on crush/ethanol margins, 
 *   but forward coverage and procurement specifics are proprietary.
 * - Trading house operations: LOW-MEDIUM confidence. Journalistic sources + inference.
 *   The ABCD firms don't publish how they work.
 * - Logistics pricing: MEDIUM confidence. Barge/rail dynamics are observable, 
 *   but specific tariff structures and allocation mechanics are industry-internal.
 * - Institutional actors (USDA, insurance, lenders): HIGH confidence on mechanics, 
 *   MEDIUM on how they actually influence trader behavior in practice.
 */

const CONFIDENCE = {
  high: { label: "High confidence", color: "#6B8F63" },
  medium: { label: "Medium confidence", color: "#C49B20" },
  low: { label: "Lower confidence", color: "#C8463C" },
};

const TIERS = [
  {
    id: "physical",
    label: "Physical Chain",
    subtitle: "Actors who touch the grain",
  },
  {
    id: "financial",
    label: "Financial Layer",
    subtitle: "Actors who trade the paper",
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    subtitle: "Actors who move and store the grain",
  },
  {
    id: "institutional",
    label: "Institutional Forces",
    subtitle: "Actors who shape the playing field",
  },
];

const ACTORS = [
  {
    id: "producer",
    name: "Producer / Farmer",
    icon: "🌾",
    tier: "physical",
    confidence: "high",
    color: "#B8860B",
    accent: "#DAA520",
    role: "Grows the grain. The origin point of the entire chain. Ranges from 500-acre family operations to 50,000-acre corporate farms. Their decisions about when and how to sell ripple through the whole system.",
    goal: "Maximize revenue per bushel while ensuring costs are covered. Survive bad years. Capitalize on good ones. Manage cash flow against loan payments and input costs.",
    infoAdvantage: "First to know their own crop conditions — emergence, stand count, disease pressure, yield estimates. They know their cost of production precisely. Local knowledge of neighbors' situations and likely selling behavior.",
    constraints: "Weather (the unhedgeable risk). Storage capacity. Cash flow timing — loan payments, input bills, and land rent don't wait for good prices. Emotional attachment to price targets. Limited market sophistication in many cases.",
    relationships: [
      { actor: "Country Elevator", nature: "Primary buyer. The farmer negotiates basis here. Relationship quality matters — reliable farmers get better bids." },
      { actor: "Crop Insurance", nature: "Sets the revenue floor that determines how aggressively the farmer can forward-price." },
      { actor: "Lenders", nature: "Loan covenants and cash needs force selling at suboptimal times. The bank is an invisible hand on timing." },
      { actor: "Input Suppliers", nature: "Seed, fertilizer, chemical costs set the breakeven floor. Prepay discounts create cash flow pressure." },
    ],
    strategies: [
      { name: "Flat Price / Cash Contract", description: "Lock in a specific price for immediate or future delivery. Simplest form — complete certainty. No upside, no downside.", risk: "low", timing: "Any time", tradeoff: "Certainty vs. missed rallies" },
      { name: "Basis Contract", description: "Lock in the local basis but leave the futures price open. Set the board later when you think futures have peaked. Separates the two price components so you can optimize each independently.", risk: "medium", timing: "Pre-harvest or at delivery", tradeoff: "Basis certainty vs. futures exposure" },
      { name: "Hedge-to-Arrive (HTA)", description: "Lock in the futures price but leave basis open. Useful when futures are high but local basis is weak and might improve. Mirror image of a basis contract.", risk: "medium", timing: "Pre-harvest", tradeoff: "Futures certainty vs. basis risk" },
      { name: "Minimum Price Contract", description: "Guarantees a price floor via an embedded put option while allowing upside participation. You pay a premium — either explicitly or through wider basis.", risk: "low", timing: "Pre or post-harvest", tradeoff: "Downside protection vs. premium cost" },
      { name: "Delayed Pricing / Price Later", description: "Deliver grain now, defer pricing. The elevator stores it on your behalf for a fee. Useful at harvest when you must move grain but hate the price.", risk: "high", timing: "At harvest", tradeoff: "Flexibility vs. storage cost and continued price risk" },
      { name: "Scale-Up Selling", description: "Incrementally price grain at predetermined levels as the market rises — sell in thirds or fifths. Disciplined, systematic. Avoids the trap of calling the top.", risk: "low", timing: "Over growing season", tradeoff: "Discipline vs. leaving money on the table" },
      { name: "Target Pricing", description: "Set price targets based on cost of production plus desired margin. Execute when hit, regardless of sentiment. Removes emotion.", risk: "low", timing: "Any time", tradeoff: "Rationality vs. targets may never be hit" },
      { name: "Cost-of-Production Floor", description: "Establish breakeven and only forward contract above it. Never sell at a loss voluntarily. The baseline discipline everything else builds on.", risk: "low", timing: "Pre-season planning", tradeoff: "Safety vs. possible inaction in down markets" },
      { name: "Re-Own with Call Options", description: "Sell cash grain, then buy calls to maintain upside exposure without physical storage. Revenue is locked but you still participate in rallies. Elegant but costs premium.", risk: "medium", timing: "Post-harvest", tradeoff: "Upside participation vs. option premium" },
      { name: "Revenue Protection Crop Insurance", description: "Functions as a put option on revenue. The guaranteed floor influences how aggressively you can price grain — it's the foundation everything else sits on.", risk: "low", timing: "Pre-season sign-up", tradeoff: "Safety net vs. premium expense" },
      { name: "Portfolio Pricing Across Crop Years", description: "Blend old crop, new crop, and second-year-out pricing to smooth revenue volatility. Treats the farm as an ongoing business, not a series of annual bets.", risk: "medium", timing: "Multi-year", tradeoff: "Revenue smoothing vs. complexity" },
      { name: "Withholding / Supply Timing", description: "Hold grain off the market to avoid depressing basis during peak delivery, or release to capture seasonal rallies. Requires storage capacity and patience.", risk: "medium", timing: "Post-harvest", tradeoff: "Better price vs. storage cost and time value of money" },
    ]
  },
  {
    id: "country-elevator",
    name: "Country Elevator",
    icon: "🏗️",
    tier: "physical",
    confidence: "medium",
    color: "#4A6741",
    accent: "#6B8F63",
    role: "First aggregation point. Buys grain from local producers, stores it, and sells to terminal elevators, processors, or exporters. The critical middleman. Can be a farmer co-op, an independent, or a facility owned by a major trading house. A single elevator might handle 2-10 million bushels per year.",
    goal: "Capture margin between the price paid to farmers (local basis) and the price received from downstream buyers (destination basis). Manage basis exposure, not flat price risk. Keep the facility full enough to cover fixed costs but not so full you can't take delivery.",
    infoAdvantage: "Sees local supply in real time — who's delivering, how much, what quality, how fast. Knows which farmers are under cash pressure and likely to sell. Knows local crop conditions from driving past fields daily. Understands their own logistics constraints (how many trucks, rail car allocation, barge access).",
    constraints: "Physical storage capacity. Rail car availability and allocation. Barge access (if river-located). Capital for inventory. Thin margins — a few cents per bushel on huge volume. Quality management (moisture, test weight, foreign material). Counterparty risk on forward contracts.",
    relationships: [
      { actor: "Producer", nature: "Primary supplier. Posts bids to attract grain. Relationship quality affects supply reliability." },
      { actor: "Terminal Elevator", nature: "Sells to terminal elevators at destination basis. The spread between local and destination basis is the core margin." },
      { actor: "Processor", nature: "Direct sales to local processors (ethanol plants, feed mills) when basis is favorable." },
      { actor: "Trading Houses", nature: "May be owned by one. If independent, sells to them as one of several downstream options." },
      { actor: "Logistics Providers", nature: "Rail car allocation, barge availability, and truck scheduling directly determine what they can move and when." },
    ],
    strategies: [
      { name: "Basis Posting / Manipulation", description: "Post basis levels to control grain flow. Widen basis to slow deliveries when storage is full. Tighten to attract grain when you need to fill commitments. The primary lever.", risk: "medium", timing: "Continuous", tradeoff: "Volume control vs. margin compression" },
      { name: "Targeted Bidding", description: "Post specific bid prices aimed at particular geographies, delivery windows, or producer segments to fill a specific need — a rail shuttle, an export vessel, a processor's pipeline. Surgical: higher than market for a narrow window to pull grain from exactly where you need it.", risk: "medium", timing: "Event-driven / commitment deadlines", tradeoff: "Filling commitments precisely vs. overpaying" },
      { name: "Accumulation / Premium Basis", description: "Offer premium basis during tight-supply windows to attract grain ahead of competitors. The elevator equivalent of a bidding war, funded by downstream margin.", risk: "medium", timing: "Tight supply periods", tradeoff: "Securing supply vs. thinner margins" },
      { name: "Storage and Carry Capture", description: "Buy cash grain and sell futures, earning the carry when the forward curve is in contango. The spread between delivery months minus actual storage costs is pure margin. The bread and butter of elevator economics.", risk: "low", timing: "When futures curve is in carry", tradeoff: "Predictable margin vs. opportunity cost of space" },
      { name: "Inverted Basis Posting", description: "Make posted basis worse for producers to slow deliveries during logistics bottlenecks or when storage is full. A flow-management lever that doesn't require changing futures positions.", risk: "low", timing: "Logistics bottlenecks", tradeoff: "Flow management vs. producer relationships" },
      { name: "Origination Hedging", description: "Systematically hedge purchased grain by selling futures immediately upon acquisition. The goal: never be exposed to flat price risk. Only basis risk, which is more predictable and manageable.", risk: "low", timing: "At every purchase", tradeoff: "Risk elimination vs. missed directional opportunity" },
      { name: "Multi-Point Basis Management", description: "Manage basis exposure across multiple elevator locations simultaneously. One location long, another short — optimizing across the network is where scale pays off.", risk: "medium", timing: "Continuous", tradeoff: "Network optimization vs. operational complexity" },
      { name: "Quality Blending", description: "Buy different quality lots (varying moisture, test weight, damage levels) and blend them to meet contract specifications. Capture the quality premium by turning discount grain into spec grain.", risk: "low", timing: "At delivery/storage", tradeoff: "Quality margin vs. blending risk and tracking complexity" },
      { name: "Drying Margin Capture", description: "Buy wet corn at a moisture discount, dry it, and sell at the dry price. The margin is the drying charge minus actual drying cost. Significant during fall harvest when much corn comes in wet.", risk: "low", timing: "Harvest", tradeoff: "Drying profit vs. energy costs and shrink" },
      { name: "Destination Optimization", description: "Route grain to the highest-value destination — export terminal, local processor, feed lot, ethanol plant — based on current basis differentials at each. The same bushel of corn can be worth different amounts depending on where it goes.", risk: "medium", timing: "Continuous", tradeoff: "Revenue maximization vs. logistics complexity and commitment fulfillment" },
      { name: "Relationship / Loyalty Pricing", description: "Offer preferential basis to high-volume, reliable delivery partners. A farmer who delivers clean grain on time is worth a penny or two per bushel. Pricing in counterparty quality.", risk: "low", timing: "Ongoing", tradeoff: "Reliable supply vs. margin concession" },
    ]
  },
  {
    id: "terminal-elevator",
    name: "Terminal / River Elevator",
    icon: "🚢",
    tier: "physical",
    confidence: "medium",
    color: "#3A5A6E",
    accent: "#5A8A9E",
    role: "Large-scale aggregation and transshipment points, typically at rivers (Mississippi, Illinois, Ohio), rail hubs, or port facilities. Receives grain from country elevators and ships to processors or export terminals. Handles millions of bushels. Often the point where grain transitions from domestic logistics to export logistics.",
    goal: "Maximize throughput and capture the spread between interior basis (buy side) and Gulf/export basis (sell side). Manage logistics to keep grain moving — an idle terminal is a money-losing terminal.",
    infoAdvantage: "Sees aggregate flow from a wide catchment area. Knows barge and vessel line-up schedules. Has visibility into export demand timing. Understands river conditions and their impact on freight rates.",
    constraints: "Barge availability and river conditions (low water = reduced loads = higher freight). Vessel scheduling at export terminals. Throughput capacity. Capital intensity — these are massive operations.",
    relationships: [
      { actor: "Country Elevator", nature: "Primary supplier. Buys from country elevators at interior basis." },
      { actor: "Exporter", nature: "Primary customer. Sells to export firms at Gulf basis or directly loads vessels." },
      { actor: "Logistics Providers", nature: "Deeply intertwined. Barge companies are often partners or even the same entity." },
    ],
    strategies: [
      { name: "Gulf Basis Trading", description: "The core business: buy at interior basis, sell at Gulf basis, capture the spread. The spread must exceed freight and handling costs to be profitable.", risk: "medium", timing: "Continuous", tradeoff: "Spread margin vs. freight volatility" },
      { name: "Barge Position Management", description: "Securing barge capacity when freight is cheap and using it when freight spikes. Barge positions have their own market — barge freight is tradeable and volatile, especially during low-water events.", risk: "medium", timing: "Seasonal / event-driven", tradeoff: "Freight savings vs. commitment risk" },
      { name: "Throughput Maximization", description: "Keeping grain moving through the facility as fast as possible. Revenue per bushel is thin, so volume is everything. Idle capacity is lost money.", risk: "low", timing: "Continuous", tradeoff: "Volume vs. quality control and bottlenecks" },
      { name: "River Logistics Arbitrage", description: "Exploit price dislocations created by river conditions — low water on the Mississippi tightens supply at Gulf, widening the interior-to-Gulf spread. Terminals with alternative logistics (rail) can capture premium.", risk: "medium", timing: "River events", tradeoff: "Event profit vs. operational stress" },
    ]
  },
  {
    id: "trading-house",
    name: "Trading House (ABCDs)",
    icon: "🌐",
    tier: "physical",
    confidence: "low",
    color: "#8B6914",
    accent: "#B8960E",
    role: "The apex predators: ADM, Bunge, Cargill, Louis Dreyfus (and increasingly COFCO, Viterra/Glencore). They operate across the entire chain — origination, storage, processing, logistics, trading, and export. Present in every major origin and destination globally. They don't just trade grain; they ARE the infrastructure in many regions.",
    goal: "Capture margin everywhere along the chain simultaneously. Use global information advantage to price ahead of the market. Optimize across origins (US, Brazil, Argentina, Ukraine, Australia) and destinations (China, EU, Middle East, Africa). The goal isn't to be right about price direction — it's to be right about relative value.",
    infoAdvantage: "This is their moat. Global origination networks see supply conditions across every major producing region. Satellite imagery and crop modeling. Vessel tracking shows trade flows in real time. Relationships with importers reveal demand before it's public. Internal logistics networks (elevators, ports, barges, vessels) provide execution speed. They see the whole board while everyone else sees their corner.",
    constraints: "Regulatory scrutiny. Reputation risk. Capital allocation across a massive global operation. Organizational complexity — coordinating across dozens of countries and business units. Occasionally get caught on the wrong side of policy changes (export bans, tariffs).",
    relationships: [
      { actor: "Everyone", nature: "They interact with every actor in the system. They own country elevators, terminal elevators, processing plants, port facilities, barge lines, and vessel fleets. They trade on exchanges. They originate from producers and sell to importers." },
    ],
    strategies: [
      { name: "Information-Advantage Pricing", description: "Using global origination networks, satellite imagery, vessel tracking, and logistics visibility to price ahead of publicly available information. When they know Brazilian second-crop corn is short before the USDA does, they've already positioned.", risk: "varies", timing: "Continuous", tradeoff: "Superior returns vs. massive infrastructure investment" },
      { name: "Origin Arbitrage", description: "Switching supply sources based on relative value. If US corn is expensive vs. Brazilian corn delivered to the same destination, shift the flow. This is why they need to be in every origin — optionality is the product.", risk: "medium", timing: "When origin spreads diverge", tradeoff: "Optimization vs. commitment to origin-country relationships" },
      { name: "Integrated Chain Margin Capture", description: "Capturing margin at every step: origination spread + storage carry + logistics margin + processing margin + export margin. Even if each step is thin, the stack adds up. And they can shift margin between steps for tax or regulatory optimization.", risk: "low", timing: "Continuous", tradeoff: "Total margin vs. enormous operational complexity" },
      { name: "Freight and Logistics as a Profit Center", description: "Own or control enough logistics (vessels, barges, port capacity) that freight itself becomes a tradeable, profitable asset, not just a cost. Chartering vessels, trading freight futures, timing shipments.", risk: "medium", timing: "Continuous", tradeoff: "Logistics profit vs. capital tied up in physical assets" },
      { name: "Policy and Trade Flow Anticipation", description: "Positioning ahead of trade policy changes — tariffs, export bans, import quotas, phytosanitary rules. Their government relations and on-the-ground presence give early signals.", risk: "high", timing: "Event-driven", tradeoff: "First-mover advantage vs. political risk" },
    ]
  },
  {
    id: "processor",
    name: "Processor",
    icon: "⚙️",
    tier: "physical",
    confidence: "medium",
    color: "#7A5C3A",
    accent: "#9E7A52",
    role: "Transforms raw grain into higher-value products. Includes soybean crushers (meal + oil), corn wet and dry millers (starch, sweeteners, ethanol), flour millers (wheat), feed mills, and malters (barley). Ethanol plants alone consume ~40% of the US corn crop. Their demand is large, predictable, and relatively inelastic in the short term.",
    goal: "Protect processing margin — the spread between raw material cost and finished product revenue. They don't care much about the absolute price of corn; they care about the crush margin, the grind margin, or the ethanol margin. Secure reliable supply at predictable basis to keep plants running.",
    infoAdvantage: "They know their own forward sales book — how much product they've sold forward and at what price, which tells them exactly what they can afford to pay for raw material. They understand processing economics (extraction rates, co-product values) better than anyone. They see downstream demand signals before the grain market does.",
    constraints: "Plant capacity and run rates — an idle plant loses money fast. Forward product sales commitments that must be covered. Quality specifications for raw material. Energy costs (significant for ethanol and wet milling). Co-product markets (DDGs, soybean meal) that have their own supply/demand dynamics.",
    relationships: [
      { actor: "Country Elevator", nature: "Primary grain supplier for many processors. Negotiate basis contracts for steady delivery." },
      { actor: "Producer", nature: "Some processors buy direct from farmers, especially large local operations." },
      { actor: "Livestock Feeders", nature: "Key customer for soybean meal, DDGs, and other co-products." },
      { actor: "Exporter", nature: "Soybean meal and oil are major export commodities. Processors sell to export channels." },
    ],
    strategies: [
      { name: "Crush / Grind / Ethanol Spread Management", description: "The core strategy. Buy raw material and sell finished products on futures to lock in processing margin. For soybeans: buy bean futures, sell meal and oil futures. For corn ethanol: buy corn, sell ethanol and DDGs. The absolute prices don't matter — only the spread.", risk: "medium", timing: "Continuous", tradeoff: "Margin certainty vs. giving up windfall margins in favorable markets" },
      { name: "Forward Coverage", description: "Maintaining a rolling window of forward grain purchases to ensure the plant always has supply. Typically 2-8 weeks of coverage, sometimes longer. Too little coverage risks running out; too much ties up capital and basis risk.", risk: "medium", timing: "Continuous", tradeoff: "Supply security vs. capital commitment and basis risk" },
      { name: "Basis Bidding for Steady Flow", description: "Post basis bids designed to attract a consistent flow of grain — not too much, not too little. Adjust basis up when coverage gets thin, down when you're well-covered. More about flow management than opportunistic buying.", risk: "low", timing: "Continuous", tradeoff: "Steady supply vs. margin on raw material" },
      { name: "Co-Product Optimization", description: "DDGs, soybean meal, corn oil, glycerin — co-products have their own markets and sometimes the co-product is more valuable per unit than the primary product. Optimizing the product mix can shift the effective cost of the raw material.", risk: "low", timing: "Market-dependent", tradeoff: "Revenue optimization vs. product quality constraints" },
      { name: "Feedstock Substitution", description: "When possible, switch feedstocks based on relative cost. Some ethanol plants can run sorghum instead of corn. Some feed mills can substitute grains. This creates cross-commodity pricing pressure.", risk: "medium", timing: "When substitution ratios favor switching", tradeoff: "Cost savings vs. efficiency loss and quality variation" },
      { name: "Tolling Arrangements", description: "Process someone else's grain for a fee rather than buying raw material and selling product. Eliminates price risk entirely — you're just selling capacity. Less common but used when margin is negative or volatile.", risk: "low", timing: "When outright margins are unfavorable", tradeoff: "Guaranteed income vs. giving up margin upside" },
    ]
  },
  {
    id: "feeder",
    name: "Livestock Feeder",
    icon: "🐄",
    tier: "physical",
    confidence: "medium",
    color: "#6B4226",
    accent: "#8B6240",
    role: "Cattle feedlots, hog operations, and poultry integrators. Major grain consumers — livestock consumes roughly a third of US corn and most domestic soybean meal. Their grain buying is driven by animal nutritional needs and the livestock price cycle, creating a different demand pattern than processors or exporters.",
    goal: "Minimize feed cost per unit of animal gain while maintaining performance. Lock in feed costs when livestock forward sales are profitable — the goal is to lock the entire margin (livestock revenue minus feed cost minus other costs), not to speculate on grain.",
    infoAdvantage: "Deep understanding of feed ration economics — exactly how much energy and protein each animal needs and which grain/ingredient combination delivers it cheapest. Know their own placement schedules and forward livestock commitments. See livestock market signals before grain traders do.",
    constraints: "Animal nutritional requirements are non-negotiable — you can substitute ingredients but not below minimum thresholds. Livestock price cycles are long (cattle: 10-12 years) and volatile. Cash flow is lumpy. Feed storage capacity on-site.",
    relationships: [
      { actor: "Country Elevator", nature: "Local grain supplier. Negotiate basis for delivery." },
      { actor: "Processor", nature: "Buy DDGs, soybean meal, and other feed ingredients." },
      { actor: "Producer", nature: "Sometimes buy grain direct from local farmers." },
    ],
    strategies: [
      { name: "Least-Cost Ration Optimization", description: "Continuously reformulate feed rations based on current ingredient prices. When corn gets expensive relative to wheat, wheat goes in the ration. When DDGs are cheap, they replace corn and meal. Linear programming models optimize this daily.", risk: "low", timing: "Continuous", tradeoff: "Feed cost savings vs. animal performance variation" },
      { name: "Feed/Livestock Margin Locking", description: "When livestock forward prices are profitable, simultaneously lock in feed costs via futures or forward purchases. The entire feeding margin is locked — don't speculate on either side independently.", risk: "low", timing: "When feeding margins are favorable", tradeoff: "Margin certainty vs. potential for better margins later" },
      { name: "Forward Grain Buying", description: "Purchase grain for future delivery when prices are favorable relative to expected livestock revenue. Typically buy 2-6 months forward for cattle feedlots, shorter for hog operations.", risk: "medium", timing: "When grain is relatively cheap", tradeoff: "Price protection vs. over-commitment if livestock prices drop" },
      { name: "Ingredient Substitution Arbitrage", description: "Aggressively switch between feed ingredients based on relative value. Corn, wheat, barley, sorghum, DDGs, soybean meal, canola meal — all substitutable within limits. Creates cross-commodity pricing pressure that grain traders need to understand.", risk: "low", timing: "When substitution ratios hit triggers", tradeoff: "Cost reduction vs. ration consistency and logistics" },
    ]
  },
  {
    id: "exporter",
    name: "Exporter",
    icon: "🚢",
    tier: "physical",
    confidence: "medium",
    color: "#2E5A5A",
    accent: "#4A8A8A",
    role: "Ships grain from the US to international buyers. Often the trading houses wearing a different hat, but also independent export firms. The key interface between domestic and international markets. Export demand is what ultimately connects US basis to global supply/demand fundamentals.",
    goal: "Fill vessel slots profitably. Buy grain at interior basis, transport to port, and sell FOB or CIF to international buyers at a price that covers all costs plus margin. Manage the time gap between booking a vessel and sourcing the grain.",
    infoAdvantage: "Sees international demand signals — Chinese buying patterns, EU import needs, Middle East tenders. Knows vessel availability and ocean freight rates. Understands trade policy in importing countries. Export sales are reported weekly by USDA, but the exporter knows their own book before the report.",
    constraints: "Vessel scheduling is rigid and expensive — missing a loading window is catastrophic. Port capacity and congestion. Trade policy risk (tariffs, phytosanitary bans). Ocean freight volatility. Currency risk on international sales. Phytosanitary and quality requirements vary by destination.",
    relationships: [
      { actor: "Terminal Elevator", nature: "Buys from terminal elevators at Gulf or PNW basis." },
      { actor: "Trading Houses", nature: "Most major exporters ARE trading houses. Independent exporters compete with them." },
      { actor: "Logistics Providers", nature: "Vessel chartering, port operations, barge logistics to port." },
    ],
    strategies: [
      { name: "FOB / CIF Pricing", description: "Sell grain either FOB (buyer arranges ocean freight) or CIF (seller includes freight and insurance). CIF captures more margin but takes on freight risk. The choice depends on the buyer's preference and relative freight rates.", risk: "medium", timing: "At sale", tradeoff: "Margin capture vs. freight exposure" },
      { name: "Export Basis Trading", description: "The core play: buy at interior basis, transport to export position, sell at Gulf/PNW basis. The export basis premium must exceed logistics costs. When export demand surges, Gulf basis strengthens, pulling interior basis up with it.", risk: "medium", timing: "When export demand is active", tradeoff: "Spread profit vs. logistics execution risk" },
      { name: "Vessel Slot Optimization", description: "Matching grain sourcing to vessel loading schedules. Grain must arrive at port in the right quality, quantity, and timing to fill a vessel. Mismatches are extremely expensive — demurrage charges, quality claims, missed sailings.", risk: "high", timing: "Vessel scheduling windows", tradeoff: "Efficient loading vs. sourcing cost pressure" },
      { name: "Destination Arbitrage", description: "Routing US grain to whichever international market offers the best netback after freight. Japan, Mexico, Colombia, China, the EU — each has different pricing, quality requirements, and freight costs.", risk: "medium", timing: "When destination spreads diverge", tradeoff: "Revenue optimization vs. relationship commitments" },
    ]
  },
  {
    id: "speculator",
    name: "Speculator / Fund Manager",
    icon: "📊",
    tier: "financial",
    confidence: "high",
    color: "#5B4A8A",
    accent: "#7B68AE",
    role: "Managed futures funds, CTAs, hedge funds, index funds, and individual speculators. Provide liquidity to the futures market. Don't handle physical grain. Their capital flows can dominate short-term price action — when funds buy, prices move, regardless of fundamentals. Represent ~70-80% of open interest in grain futures.",
    goal: "Profit from price movement via directional bets, spread relationships, or volatility. Index funds passively track commodity indices. CTAs follow systematic rules. Macro funds take discretionary positions based on global themes.",
    infoAdvantage: "Quantitative models, speed of execution, capital scale. Some funds use alternative data (satellite imagery, vessel tracking, point-of-sale data). Index funds have no informational edge — they're providing passive exposure and earning the risk premium (or not).",
    constraints: "No physical delivery capability — must close positions before expiry. Margin requirements. Fund mandates and risk limits. Regulatory position limits. Sensitive to drawdowns — a bad month can trigger redemptions that force position liquidation regardless of view.",
    relationships: [
      { actor: "Everyone (indirectly)", nature: "Their buying and selling moves futures prices, which affects basis calculations for every physical actor." },
      { actor: "Commodity Brokers", nature: "Execute through brokers. Broker research and flow information matters." },
    ],
    strategies: [
      { name: "Calendar Spread Trading", description: "Trade the price difference between old crop and new crop months (e.g., July vs. December corn). Exploits supply transition expectations. Lower margin requirements than outright positions.", risk: "medium", timing: "Growing season / crop transition", tradeoff: "Lower risk vs. limited profit potential" },
      { name: "Crush Spread", description: "Buy soybeans, sell soybean meal and oil futures simultaneously to capture the processing margin. Can trade it as a pure financial play or as a view on processor economics.", risk: "medium", timing: "When crush margin is extreme", tradeoff: "Processing margin capture vs. three-legged execution risk" },
      { name: "Inter-Commodity Spreads", description: "Trade corn-wheat, corn-soybean, or other grain ratios based on substitution economics. When the corn/soybean ratio gets extreme, acreage shifts follow. When corn/wheat diverges, feed ration substitution kicks in.", risk: "medium", timing: "When ratios hit extremes", tradeoff: "Mean reversion potential vs. structural shifts" },
      { name: "Spatial Arbitrage", description: "Exploit price differences between exchanges — CBOT vs. Matif wheat, CBOT vs. DCE soybeans. Requires understanding trade flows, freight, and currency.", risk: "medium", timing: "When geographic spreads diverge", tradeoff: "Arbitrage profit vs. execution friction and currency risk" },
      { name: "USDA Report Positioning", description: "Position ahead of WASDE, Prospective Plantings, Quarterly Stocks, Crop Progress. The consensus-vs-reality gap creates volatility events. Some trade the event, some trade the aftermath.", risk: "high", timing: "Report calendar", tradeoff: "Event capture vs. getting run over in a fast market" },
      { name: "Seasonal Pattern Trading", description: "Exploit historical seasonal tendencies — corn tends to rally June/July on weather premium, sell off at harvest. Strong historical tendencies but not guaranteed in any given year.", risk: "medium", timing: "Seasonal windows", tradeoff: "Historical edge vs. 'this time it's different'" },
      { name: "Options Volatility Strategies", description: "Trade implied vs. realized volatility using straddles, strangles, butterflies. Volatility spikes during growing season and around USDA reports. Sell rich vol, buy cheap vol.", risk: "high", timing: "Around volatility events", tradeoff: "Volatility edge vs. unlimited risk on naked positions" },
      { name: "Trend Following / Momentum", description: "Systematic strategies following sustained price moves via moving averages, breakouts, or managed futures approaches. Grain markets trend well due to supply inelasticity.", risk: "medium", timing: "When trends establish", tradeoff: "Trend capture vs. whipsaw in choppy markets" },
      { name: "Mean Reversion", description: "Bet that extreme prices return to historical norms. Works in grains because production responds to price (high prices → more planting → more supply → lower prices). The fundamental governor.", risk: "medium", timing: "At price extremes", tradeoff: "Historical gravity vs. 'the market can stay irrational longer than you can stay solvent'" },
      { name: "Collar / Fence Strategies", description: "Buy a put, sell a call (or vice versa) to bound risk. Zero-cost collars let the sold option fund the purchased one. Limits both downside and upside.", risk: "low", timing: "When protecting positions", tradeoff: "Defined risk vs. capped upside" },
    ]
  },
  {
    id: "broker",
    name: "Commodity Broker",
    icon: "📞",
    tier: "financial",
    confidence: "medium",
    color: "#5A5A7A",
    accent: "#7A7A9A",
    role: "Facilitates trades between producers, elevators, and the futures market. Provides market intelligence, execution, and advisory. Ranges from full-service brokerages advising farmers on marketing plans to execution-only firms serving institutional traders. Some are independent, some are part of larger financial firms.",
    goal: "Generate commissions and retain clients through quality advice and execution. Build long-term relationships with producers and commercial hedgers. Some brokers also proprietary trade.",
    infoAdvantage: "Sees order flow — knows what their clients are doing and how the aggregate client base is positioned. Aggregated insight across many producers reveals local selling patterns. Market color from the trading floor / electronic markets.",
    constraints: "Regulatory requirements (NFA registration, compliance). Commission pressure from discount online brokers. Liability for advice given. Dependent on client activity for revenue.",
    relationships: [
      { actor: "Producer", nature: "Advises on marketing plans and executes futures/options hedges on their behalf." },
      { actor: "Country Elevator", nature: "Executes hedges for smaller elevators that don't have their own trading desk." },
      { actor: "Speculator", nature: "Executes for fund clients. Provides research." },
    ],
    strategies: [
      { name: "Advisory Marketing Programs", description: "Provide structured marketing recommendations to producer clients — when to sell, how much, which tools to use. The broker's track record on these programs is their primary sales tool.", risk: "low", timing: "Ongoing", tradeoff: "Client retention vs. liability for bad recommendations" },
      { name: "Order Flow Aggregation Insight", description: "Aggregate client activity to understand positioning and sentiment across their book. Not trading against clients, but understanding the temperature of the market from the inside.", risk: "low", timing: "Continuous", tradeoff: "Market intelligence vs. confidentiality obligations" },
    ]
  },
  {
    id: "logistics",
    name: "Logistics Provider",
    icon: "🚂",
    tier: "infrastructure",
    confidence: "medium",
    color: "#6A4E3A",
    accent: "#8A6E5A",
    role: "Railroads (BNSF, Union Pacific, CSX, Norfolk Southern), barge companies, and trucking firms. They move the grain. Their capacity constraints and pricing directly CREATE basis differentials — logistics is not just a cost, it's a market-shaping force. A single river closure or rail disruption can rearrange basis patterns across an entire region.",
    goal: "Maximize revenue per unit of capacity. Keep assets (rail cars, barges, trucks) utilized. Price to demand — surge pricing during peak movement seasons, discounted rates during slow periods.",
    infoAdvantage: "Know their own capacity constraints and bottleneck points. See aggregate demand for transportation before the market prices it in. Understand seasonal patterns from years of data.",
    constraints: "Physical infrastructure (track, locks, river depth). Equipment availability — rail cars and barges are finite. Weather (frozen rivers, flooded tracks). Regulatory requirements. Labor.",
    relationships: [
      { actor: "Country Elevator", nature: "Provides rail cars and barge access. Rail car allocation is a constant negotiation." },
      { actor: "Terminal Elevator", nature: "Barge companies and railroads are the arteries connecting interior to export." },
      { actor: "Trading Houses", nature: "Major trading houses often own or long-term charter their own logistics assets to avoid depending on third parties." },
    ],
    strategies: [
      { name: "Shuttle Train Pricing", description: "Offer discounted rail rates for 75-110 car unit trains (shuttles) that load and unload efficiently. The discount incentivizes elevators to build shuttle-capable facilities, which concentrates grain flow to the railroad's preferred network.", risk: "low", timing: "Contract-based", tradeoff: "Volume guarantee vs. lower per-car revenue" },
      { name: "Seasonal Surge Pricing", description: "Raise freight rates during peak demand (harvest, export surges) and offer incentives during off-peak. The secondary market for rail car leases and barge freight has its own supply/demand dynamics.", risk: "low", timing: "Seasonal", tradeoff: "Revenue maximization vs. pushing customers to alternatives" },
      { name: "Capacity as Leverage", description: "When capacity is tight, the logistics provider effectively determines which grain moves and which sits. This is market-making power — the ability to say 'I can get your grain to the Gulf this month, but it'll cost you.'", risk: "medium", timing: "Tight capacity periods", tradeoff: "Margin capture vs. regulatory and relationship risk" },
    ]
  },
  {
    id: "usda",
    name: "USDA",
    icon: "🏛️",
    tier: "institutional",
    confidence: "high",
    color: "#3A5A3A",
    accent: "#5A8A5A",
    role: "Not a market participant but the single most powerful market-shaping force. Their reports move markets more than almost anything else. Sets crop insurance parameters, administers farm programs, conducts inspections, and maintains the statistical foundation that the entire market prices off of. WASDE, Prospective Plantings, Crop Progress, Quarterly Grain Stocks, Export Sales — these are the market's heartbeat.",
    goal: "Provide accurate, impartial information about agricultural markets. Administer farm safety net programs. Promote US agricultural exports.",
    infoAdvantage: "Conducts surveys and uses methodology no private entity replicates at scale. Their production estimates become the market's reference point whether they're right or wrong. The market trades off USDA numbers even when private estimates disagree.",
    constraints: "Bureaucratic pace. Political pressure on programs. Budget constraints. Methodology can lag reality (satellite technology vs. phone surveys).",
    relationships: [
      { actor: "Everyone", nature: "Every actor in the grain market watches USDA reports. Report release dates are marked on every trader's calendar. Their numbers ARE the baseline everyone prices off of." },
    ],
    strategies: [
      { name: "Report Calendar as Market Structure", description: "USDA doesn't have 'strategies' per se, but their report calendar creates a structural rhythm that every other actor trades around. The January final production estimate, February Ag Outlook, March Prospective Plantings, June Acreage, weekly Crop Progress June-November, monthly WASDE — each creates a volatility event the market revolves around.", risk: "n/a", timing: "Fixed calendar", tradeoff: "Market transparency vs. the report itself becoming a volatility catalyst" },
    ]
  },
  {
    id: "insurance",
    name: "Crop Insurance",
    icon: "🛡️",
    tier: "institutional",
    confidence: "high",
    color: "#4A4A6A",
    accent: "#6A6A9A",
    role: "Federal crop insurance (administered by RMA, sold by private companies) provides revenue and yield protection. Revenue Protection (RP) is the dominant product — it guarantees a minimum revenue per acre based on futures prices during a discovery period. This is not a background feature; it fundamentally shapes how producers price grain.",
    goal: "Provide a safety net that stabilizes farm income. For the insurance companies: manage the underwriting book profitably (the government provides reinsurance).",
    infoAdvantage: "Insurance agents know the coverage levels, APH yields, and risk profile of their clients. Aggregate data reveals regional production capacity.",
    constraints: "Program rules are set annually. Price discovery windows (February for corn/soybeans) are fixed. Coverage levels chosen in spring before the crop is planted.",
    relationships: [
      { actor: "Producer", nature: "The insurance guarantee is the foundation of the farmer's pricing strategy. High RP coverage = more freedom to forward-price aggressively." },
      { actor: "Speculator", nature: "The February and October price discovery windows create predictable market dynamics — February corn and soybean futures activity spikes during the price-setting period." },
    ],
    strategies: [
      { name: "Revenue Floor as Strategy Enabler", description: "Crop insurance doesn't have trading strategies, but the revenue guarantee it provides enables every other producer strategy. A farmer with 85% RP coverage can forward-sell aggressively knowing the insurance catches them if yields collapse. Without insurance, most producers would be too conservative to price much grain forward.", risk: "n/a", timing: "Pre-season", tradeoff: "Enables risk-taking vs. premium cost reduces profitability in good years" },
    ]
  },
  {
    id: "lender",
    name: "Lender / Farm Credit",
    icon: "🏦",
    tier: "institutional",
    confidence: "medium",
    color: "#5A4A3A",
    accent: "#7A6A5A",
    role: "Farm Credit System, commercial banks, and ag lending institutions. Provide operating loans, land loans, and equipment financing. Their loan covenants and cash flow requirements are an invisible but powerful force on grain pricing — they determine WHEN farmers must sell, often overriding the farmer's own market view.",
    goal: "Maintain a performing loan portfolio. Ensure borrowers can service debt. In tough years, they're managing distress; in good years, they're competing for business.",
    infoAdvantage: "See the financial health of individual farm operations. Aggregate data reveals regional financial stress levels. Know which operations are cash-strapped and likely to sell grain under pressure.",
    constraints: "Regulatory capital requirements. Interest rate risk. Concentration risk in ag-dependent portfolios. Reputation — aggressive collection in farm country is toxic.",
    relationships: [
      { actor: "Producer", nature: "Loan payment schedules force grain sales. Lenders sometimes require forward contracting as a loan condition. They're the invisible hand on the sell button." },
      { actor: "Crop Insurance", nature: "Insurance assignment — lenders are often the assignee on crop insurance policies, ensuring they get paid if there's a loss." },
    ],
    strategies: [
      { name: "Marketing Loan Requirements", description: "Requiring borrowers to forward-price a percentage of expected production as a loan condition. This forces producer selling into specific windows and creates predictable supply flow that elevators can anticipate.", risk: "n/a", timing: "At loan origination", tradeoff: "Loan security vs. constraining the farmer's marketing flexibility" },
    ]
  },
];

const SYSTEM_DYNAMICS = [
  {
    name: "Basis Is the Heartbeat",
    description: "Every transaction in the physical grain chain involves basis — the difference between local cash price and the futures reference. Basis reflects local supply/demand, storage economics, transportation costs, and quality. It's the signal that coordinates the entire system. When basis strengthens, it's the market saying 'we need grain here.' When it weakens, it's saying 'we have enough.'",
  },
  {
    name: "Information Asymmetry Drives Margin",
    description: "Whoever knows more captures more. The trading houses see the whole board. Elevators see their local market. Producers see their own farm. This information hierarchy maps almost directly to the margin hierarchy. The most profitable thing in grain trading isn't being right about price — it's knowing something before the price reflects it.",
  },
  {
    name: "Logistics Constraints Create Pricing Power",
    description: "Grain is heavy and cheap per unit. Transportation costs are a huge fraction of the final price. Whoever controls logistics infrastructure — rail car allocations, barge access, port capacity — effectively controls basis in their region. A single river closure rearranges basis across half the country.",
  },
  {
    name: "Time Pressure Creates Opportunity",
    description: "Harvest forces producers to sell (limited storage, cash needs, wet grain deterioration). Vessel schedules force exporters to buy (demurrage is expensive). Loan payments force selling on specific dates. These non-negotiable deadlines create predictable stress points where counterparties can extract margin from those under pressure.",
  },
  {
    name: "Crop Insurance Sets the Floor",
    description: "Revenue Protection crop insurance is the foundation the whole producer marketing system sits on. It functions as a government-subsidized put option. The coverage level determines how aggressively a producer can forward-price. It also influences aggregate selling behavior — in years when the insurance guarantee is high, producers may be less aggressive sellers, tightening physical supply.",
  },
  {
    name: "Substitution Economics Link Markets",
    description: "Corn, wheat, and barley compete in feed rations. Corn and soybeans compete for acreage. Soybean oil and palm oil compete in food processing. Ethanol and gasoline compete as motor fuel. These substitution relationships mean no grain trades in isolation — extreme prices in one commodity create responsive demand or supply shifts in others.",
  },
  {
    name: "USDA Reports as Volatility Catalysts",
    description: "USDA reports are the agreed-upon truth. Even when private estimates disagree, the market reprices to USDA numbers on release day. This creates a rhythm: positions build ahead of reports, volatility spikes on release, then the market digests and repositions. The report calendar is as fundamental to grain trading as the growing season itself.",
  },
  {
    name: "Weather Is the Unhedgeable Risk",
    description: "Supply is fundamentally determined by weather during a roughly 60-day critical window (pollination for corn, pod fill for soybeans). No financial instrument fully hedges this. Crop insurance mitigates the revenue impact but doesn't eliminate the physical supply shock. Weather is why grain markets have fat tails and why trend-following strategies work — supply shocks are large, binary, and persistent.",
  },
  {
    name: "The Carry / Inverse Cycle",
    description: "When supply is ample, futures curves are in contango (carry) — forward months trade at a premium to nearby, reflecting storage costs. This rewards storage and patience. When supply is tight, curves invert (backwardation) — nearby months trade at a premium, incentivizing immediate delivery. The shape of the curve determines which strategies are viable at any given time.",
  },
  {
    name: "Scale Begets Scale",
    description: "The trading houses' advantage compounds: more origins → better information → better pricing → more volume → more logistics leverage → more origins. Smaller players survive by specializing in local relationships, niche markets, or specific crops where scale matters less. The system has a strong power law — a handful of firms control the majority of global grain flow.",
  },
];

const riskColor = (risk) => {
  switch (risk) {
    case "low": return { bg: "rgba(75, 160, 75, 0.12)", text: "#4BA04B", border: "rgba(75, 160, 75, 0.3)" };
    case "medium": return { bg: "rgba(210, 170, 50, 0.12)", text: "#C49B20", border: "rgba(210, 170, 50, 0.3)" };
    case "high": return { bg: "rgba(200, 70, 60, 0.12)", text: "#C8463C", border: "rgba(200, 70, 60, 0.3)" };
    default: return { bg: "rgba(140, 140, 160, 0.12)", text: "#8C8CA0", border: "rgba(140, 140, 160, 0.3)" };
  }
};

function ActorCard({ actor, onClick, isActive }) {
  const conf = CONFIDENCE[actor.confidence];
  return (
    <button
      onClick={onClick}
      style={{
        background: isActive ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isActive ? actor.accent + "66" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 6,
        padding: "14px 16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        textAlign: "left",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 20 }}>{actor.icon}</span>
        <span style={{
          fontFamily: "'Newsreader', 'DM Serif Display', Georgia, serif",
          fontSize: 15,
          color: isActive ? "#E8E4DC" : "rgba(232,228,220,0.75)",
          fontWeight: 400,
        }}>{actor.name}</span>
      </div>
      <div style={{
        fontSize: 9,
        fontFamily: "'JetBrains Mono', monospace",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: conf.color,
        marginLeft: 30,
      }}>
        {actor.strategies?.length || 0} strategies · {conf.label}
      </div>
    </button>
  );
}

function StrategyRow({ strategy, index }) {
  const [open, setOpen] = useState(false);
  const rc = riskColor(strategy.risk);
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: open ? "rgba(255,255,255,0.04)" : "transparent",
        border: `1px solid ${open ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`,
        borderRadius: 5,
        padding: "12px 16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 15,
            color: "#E8E4DC",
          }}>{strategy.name}</span>
          {strategy.risk && strategy.risk !== "n/a" && (
            <span style={{
              fontSize: 9,
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              padding: "1px 7px",
              borderRadius: 3,
              background: rc.bg,
              color: rc.text,
              border: `1px solid ${rc.border}`,
            }}>{strategy.risk}</span>
          )}
        </div>
        <span style={{
          color: "rgba(255,255,255,0.25)",
          fontSize: 16,
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
          flexShrink: 0,
        }}>+</span>
      </div>
      {open && (
        <div style={{ marginTop: 10 }}>
          <p style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: 14,
            lineHeight: 1.7,
            color: "rgba(232,228,220,0.75)",
            margin: 0,
          }}>{strategy.description}</p>
          {(strategy.timing || strategy.tradeoff) && (
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              {strategy.timing && (
                <div>
                  <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)" }}>Timing</div>
                  <div style={{ fontSize: 13, color: "rgba(232,228,220,0.65)", fontFamily: "'Source Serif 4', Georgia, serif", marginTop: 2 }}>{strategy.timing}</div>
                </div>
              )}
              {strategy.tradeoff && (
                <div>
                  <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)" }}>Core Tradeoff</div>
                  <div style={{ fontSize: 13, color: "rgba(232,228,220,0.65)", fontFamily: "'Source Serif 4', Georgia, serif", marginTop: 2 }}>{strategy.tradeoff}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ActorDetail({ actor }) {
  const conf = CONFIDENCE[actor.confidence];
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <span style={{ fontSize: 28 }}>{actor.icon}</span>
          <h2 style={{
            fontFamily: "'Newsreader', 'DM Serif Display', Georgia, serif",
            fontSize: 28,
            fontWeight: 400,
            margin: 0,
            color: actor.accent,
          }}>{actor.name}</h2>
        </div>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "3px 10px",
          borderRadius: 3,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          marginBottom: 16,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: conf.color }} />
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: conf.color, letterSpacing: "0.05em" }}>
            {conf.label} — data quality flag
          </span>
        </div>
      </div>

      {/* Profile sections */}
      {[
        { label: "Role", content: actor.role },
        { label: "Primary Goal", content: actor.goal },
        { label: "Information Advantage", content: actor.infoAdvantage },
        { label: "Constraints", content: actor.constraints },
      ].map(section => (
        <div key={section.label} style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 9,
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.35)",
            marginBottom: 6,
          }}>{section.label}</div>
          <p style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: 14.5,
            lineHeight: 1.75,
            color: "rgba(232,228,220,0.8)",
            margin: 0,
          }}>{section.content}</p>
        </div>
      ))}

      {/* Relationships */}
      {actor.relationships && actor.relationships.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{
            fontSize: 9,
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.35)",
            marginBottom: 10,
          }}>Key Relationships</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {actor.relationships.map((rel, i) => (
              <div key={i} style={{
                padding: "10px 14px",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 5,
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: actor.accent,
                }}>→ {rel.actor}</span>
                <p style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "rgba(232,228,220,0.65)",
                  margin: "4px 0 0",
                }}>{rel.nature}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategies */}
      {actor.strategies && actor.strategies.length > 0 && (
        <div>
          <div style={{
            fontSize: 9,
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.35)",
            marginBottom: 10,
          }}>Pricing Strategies ({actor.strategies.length})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {actor.strategies.map((s, i) => (
              <StrategyRow key={s.name} strategy={s} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SystemDynamicsView() {
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <h2 style={{
        fontFamily: "'Newsreader', 'DM Serif Display', Georgia, serif",
        fontSize: 28,
        fontWeight: 400,
        color: "#E8E4DC",
        margin: "0 0 8px",
      }}>System Dynamics</h2>
      <p style={{
        fontFamily: "'Source Serif 4', Georgia, serif",
        fontSize: 14.5,
        lineHeight: 1.7,
        color: "rgba(232,228,220,0.5)",
        margin: "0 0 28px",
      }}>
        The forces that shape how all the actors interact. These are the rules of the game — understanding them matters more than memorizing individual strategies.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {SYSTEM_DYNAMICS.map((d, i) => (
          <DynamicCard key={d.name} dynamic={d} index={i} />
        ))}
      </div>
    </div>
  );
}

function DynamicCard({ dynamic, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: open ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.015)",
        border: `1px solid ${open ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}`,
        borderRadius: 6,
        padding: "14px 18px",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontSize: 16,
          fontWeight: 400,
          color: "#E8E4DC",
          margin: 0,
        }}>{dynamic.name}</h3>
        <span style={{
          color: "rgba(255,255,255,0.25)",
          fontSize: 16,
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
        }}>+</span>
      </div>
      {open && (
        <p style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: 14.5,
          lineHeight: 1.75,
          color: "rgba(232,228,220,0.75)",
          margin: "12px 0 0",
        }}>{dynamic.description}</p>
      )}
    </div>
  );
}

export default function GrainEcosystem() {
  const [view, setView] = useState("actors"); // "actors" | "dynamics"
  const [selectedActor, setSelectedActor] = useState("producer");

  const actor = ACTORS.find(a => a.id === selectedActor);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1A1916",
      color: "#E8E4DC",
      fontFamily: "'Source Serif 4', Georgia, serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,600;1,6..72,400&family=JetBrains+Mono:wght@300;400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        button { font-family: inherit; }

        .nav-btn {
          background: none;
          border: none;
          padding: 8px 0;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 0.15s ease;
          border-bottom: 1.5px solid transparent;
          color: rgba(232,228,220,0.4);
        }
        .nav-btn:hover { color: rgba(232,228,220,0.7); }
        .nav-btn.active {
          color: #E8E4DC;
          border-bottom-color: #E8E4DC;
        }
      `}</style>

      {/* Header */}
      <header style={{ padding: "40px 28px 0", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          fontSize: 9,
          fontFamily: "'JetBrains Mono', monospace",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "rgba(232,228,220,0.3)",
          marginBottom: 10,
        }}>Grain Trading Reference</div>
        <h1 style={{
          fontFamily: "'Newsreader', 'DM Serif Display', Georgia, serif",
          fontSize: 38,
          fontWeight: 400,
          margin: "0 0 8px",
          letterSpacing: "-0.01em",
          lineHeight: 1.15,
        }}>The Ecosystem</h1>
        <p style={{
          fontSize: 15,
          color: "rgba(232,228,220,0.45)",
          margin: "0 0 24px",
          maxWidth: 600,
          lineHeight: 1.6,
        }}>
          How grain gets priced, who prices it, and why they make the moves they make.
          {" "}<span style={{ color: "rgba(232,228,220,0.3)" }}>12 actors. 10 system dynamics. ~60 strategies.</span>
        </p>

        {/* Nav */}
        <div style={{ display: "flex", gap: 20, borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 0 }}>
          <button className={`nav-btn ${view === "actors" ? "active" : ""}`} onClick={() => setView("actors")}>Actors & Strategies</button>
          <button className={`nav-btn ${view === "dynamics" ? "active" : ""}`} onClick={() => setView("dynamics")}>System Dynamics</button>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 28px 64px" }}>
        {view === "dynamics" ? (
          <SystemDynamicsView />
        ) : (
          <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
            {/* Sidebar */}
            <nav style={{
              width: 260,
              flexShrink: 0,
              position: "sticky",
              top: 20,
              maxHeight: "calc(100vh - 40px)",
              overflowY: "auto",
              paddingRight: 8,
            }}>
              {TIERS.map(tier => (
                <div key={tier.id} style={{ marginBottom: 16 }}>
                  <div style={{
                    fontSize: 9,
                    fontFamily: "'JetBrains Mono', monospace",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "rgba(255,255,255,0.25)",
                    padding: "0 0 6px",
                    marginBottom: 4,
                  }}>
                    {tier.label}
                    <span style={{ display: "block", fontSize: 8, letterSpacing: "0.08em", color: "rgba(255,255,255,0.15)", marginTop: 1 }}>{tier.subtitle}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {ACTORS.filter(a => a.tier === tier.id).map(a => (
                      <ActorCard
                        key={a.id}
                        actor={a}
                        isActive={selectedActor === a.id}
                        onClick={() => setSelectedActor(a.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            {/* Detail */}
            <div style={{ flex: 1, minWidth: 0 }} key={selectedActor}>
              {actor && <ActorDetail actor={actor} />}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 48,
          paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <div style={{
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            color: "rgba(232,228,220,0.25)",
            lineHeight: 1.6,
            maxWidth: 500,
          }}>
            Confidence flags indicate data quality, not importance. "Lower confidence" means the information is reconstructed from adjacent sources rather than direct practitioner knowledge. Treat flagged sections as starting points, not authority.
          </div>
          <div style={{
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            color: "rgba(232,228,220,0.2)",
          }}>
            v2 · ecosystem view
          </div>
        </div>
      </main>
    </div>
  );
}
