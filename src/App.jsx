import { useState, useEffect } from "react";
import { ACTORS, TIERS } from "./data/actors";
import { TheHouseView, TradingHouseView } from "./views/TradingHouseView";
import { ActorCard, ActorDetail, MobileActorSelector, listActors } from "./views/ActorView";
import { SystemDynamicsView } from "./views/SystemDynamicsView";
import FilterBar from "./views/FilterBar";
import { Icon, appIcons } from "./icons";
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
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("gt-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("gt-theme", theme);
  }, [theme]);

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
      background: "var(--background)",
      color: "var(--foreground)",
      fontFamily: "var(--font-sans)",
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: color-mix(in oklch, var(--border) 65%, transparent); border-radius: 2px; }
        button { font-family: inherit; }

        .nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: var(--control-h);
          background: transparent;
          border: 1px solid transparent;
          border-radius: calc(var(--radius) * 1.5);
          padding: 0 12px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: color var(--duration-fast) var(--ease-out), background-color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
          color: var(--muted-foreground);
          white-space: nowrap;
        }
        .nav-btn:hover { color: var(--foreground); background: var(--muted); }
        .nav-btn:active { transform: scale(0.97); }
        .nav-btn.active {
          color: var(--primary-foreground);
          background: var(--primary);
          border-color: color-mix(in oklch, var(--primary) 80%, var(--border));
          box-shadow: var(--shadow-sm);
        }
      `}</style>

      <header style={{ padding: isMobile ? "16px" : "22px 28px", borderBottom: "1px solid var(--border)", background: "var(--card)", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 650, letterSpacing: "-0.01em" }}>Grain Trading Reference</div>
              {!isMobile && <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 3 }}>Cargill merchant onboarding · {ACTORS.length} actors · {STRATEGY_COUNT} strategies</div>}
            </div>
            <button
              type="button"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              style={{ width: 38, height: 38, display: "grid", placeItems: "center", border: "1px solid var(--border)", borderRadius: "calc(var(--radius) * 1.5)", background: "var(--background)", color: "var(--foreground)", cursor: "pointer", boxShadow: "var(--shadow-sm)" }}
            >
              <Icon path={theme === "dark" ? appIcons.light : appIcons.dark} size={18} />
            </button>
          </div>
          <nav aria-label="Primary" style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 1 }}>
            <button className={`nav-btn ${view === "the-house" ? "active" : ""}`} aria-pressed={view === "the-house"} onClick={() => setView("the-house")}><Icon path={appIcons.overview} size={17} />The House</button>
            <button className={`nav-btn ${view === "trading-house" ? "active" : ""}`} aria-pressed={view === "trading-house"} onClick={() => setView("trading-house")}><Icon path={appIcons.roles} size={17} />Roles</button>
            <button className={`nav-btn ${view === "actors" ? "active" : ""}`} aria-pressed={view === "actors"} onClick={() => setView("actors")}><Icon path={appIcons.ecosystem} size={17} />Ecosystem</button>
            <button className={`nav-btn ${view === "dynamics" ? "active" : ""}`} aria-pressed={view === "dynamics"} onClick={() => setView("dynamics")}><Icon path={appIcons.dynamics} size={17} />System Dynamics</button>
          </nav>
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
                      fontFamily: "var(--font-sans)",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      color: "color-mix(in oklch, var(--foreground) 25%, transparent)",
                      padding: "0 0 6px",
                      marginBottom: 4,
                    }}>
                      {tier.label}
                      <span style={{ display: "block", fontSize: 8, letterSpacing: "0.08em", color: "color-mix(in oklch, var(--border) 98%, transparent)", marginTop: 1 }}>{tier.subtitle}</span>
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
          borderTop: "1px solid color-mix(in oklch, var(--foreground) 5%, transparent)",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          gap: 12,
        }}>
          <div style={{
            fontSize: 11,
            fontFamily: "var(--font-sans)",
            color: "color-mix(in oklch, var(--foreground) 25%, transparent)",
            lineHeight: 1.6,
            maxWidth: isMobile ? "100%" : 500,
          }}>
            Confidence flags indicate data quality, not importance. "Lower confidence" means the information is reconstructed from adjacent sources rather than direct practitioner knowledge.
          </div>
          <div style={{
            fontSize: 11,
            fontFamily: "var(--font-sans)",
            color: "color-mix(in oklch, var(--foreground) 20%, transparent)",
          }}>
            v2 · ecosystem view
          </div>
        </div>
      </main>
    </div>
  );
}
