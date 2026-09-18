import { useState, useEffect } from "react";
import { ACTORS, TIERS } from "./data/actors";
import { TheHouseView, TradingHouseView } from "./views/TradingHouseView";
import { ActorCard, ActorDetail, MobileActorSelector, listActors } from "./views/ActorView";
import { SystemDynamicsView } from "./views/SystemDynamicsView";
import FilterBar from "./views/FilterBar";
import { SYSTEM_DYNAMICS } from "./data/system-dynamics";

const STRATEGY_COUNT = ACTORS.reduce((n, a) => n + a.strategies.length, 0);
const NO_FILTERS = { commodity: null, lens: null, effectType: null };

export default function App() {
  const [view, setView] = useState("the-house");
  const [selectedActor, setSelectedActor] = useState("producer");
  const [selectedPersona, setSelectedPersona] = useState("merchant");
  const [isMobile, setIsMobile] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [filters, setFilters] = useState(NO_FILTERS);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const actor = ACTORS.find(a => a.id === selectedActor);
  const listed = listActors(filters, selectedActor);

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

      <header style={{ padding: isMobile ? "24px 16px 0" : "40px 28px 0", maxWidth: 1100, margin: "0 auto" }}>
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
          fontSize: isMobile ? 28 : 38,
          fontWeight: 400,
          margin: "0 0 8px",
          letterSpacing: "-0.01em",
          lineHeight: 1.15,
        }}>The Ecosystem</h1>
        <p style={{
          fontSize: isMobile ? 14 : 15,
          color: "rgba(232,228,220,0.45)",
          margin: "0 0 24px",
          maxWidth: 600,
          lineHeight: 1.6,
        }}>
          How grain gets priced, who prices it, and why they make the moves they make.
          {!isMobile && <span style={{ color: "rgba(232,228,220,0.3)" }}> {ACTORS.length} actors. {SYSTEM_DYNAMICS.length} system dynamics. {STRATEGY_COUNT} strategies.</span>}
        </p>

        <div style={{ display: "flex", gap: 20, borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 0 }}>
          <button className={`nav-btn ${view === "the-house" ? "active" : ""}`} onClick={() => setView("the-house")}>The House</button>
          <button className={`nav-btn ${view === "trading-house" ? "active" : ""}`} onClick={() => setView("trading-house")}>Roles</button>
          <button className={`nav-btn ${view === "actors" ? "active" : ""}`} onClick={() => setView("actors")}>Ecosystem</button>
          <button className={`nav-btn ${view === "dynamics" ? "active" : ""}`} onClick={() => setView("dynamics")}>System Dynamics</button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "20px 16px 48px" : "24px 28px 64px" }}>
        {(view === "actors" || view === "dynamics") && (
          <FilterBar
            filters={filters}
            onChange={setFilters}
            showEffectType={view === "actors"}
            isMobile={isMobile}
          />
        )}
        {view === "the-house" ? (
          <TheHouseView isMobile={isMobile} />
        ) : view === "trading-house" ? (
          <TradingHouseView
            selectedPersona={selectedPersona}
            onSelectPersona={setSelectedPersona}
            isMobile={isMobile}
          />
        ) : view === "dynamics" ? (
          <SystemDynamicsView isMobile={isMobile} filters={filters} />
        ) : isMobile ? (
          <div>
            <MobileActorSelector
              selectedActor={selectedActor}
              onSelect={setSelectedActor}
              isOpen={selectorOpen}
              onToggle={() => setSelectorOpen(!selectorOpen)}
              filters={filters}
            />
            {actor && <ActorDetail actor={actor} isMobile={isMobile} filters={filters} />}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
            <nav style={{
              width: 260,
              flexShrink: 0,
              position: "sticky",
              top: 20,
              maxHeight: "calc(100vh - 40px)",
              overflowY: "auto",
              paddingRight: 8,
            }}>
              {TIERS.map(tier => {
                const rows = listed.filter(r => r.actor.tier === tier.id);
                if (rows.length === 0) return null;
                return (
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
                      {rows.map(({ actor: a, outsideLens, dimmed }) => (
                        <ActorCard
                          key={a.id}
                          actor={a}
                          isActive={selectedActor === a.id}
                          onClick={() => setSelectedActor(a.id)}
                          isMobile={false}
                          outsideLens={outsideLens}
                          dimmed={dimmed}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>

            <div style={{ flex: 1, minWidth: 0 }} key={selectedActor}>
              {actor && <ActorDetail actor={actor} isMobile={isMobile} filters={filters} />}
            </div>
          </div>
        )}

        <div style={{
          marginTop: isMobile ? 32 : 48,
          paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          gap: 12,
        }}>
          <div style={{
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            color: "rgba(232,228,220,0.25)",
            lineHeight: 1.6,
            maxWidth: isMobile ? "100%" : 500,
          }}>
            Confidence flags indicate data quality, not importance. "Lower confidence" means the information is reconstructed from adjacent sources rather than direct practitioner knowledge.
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
