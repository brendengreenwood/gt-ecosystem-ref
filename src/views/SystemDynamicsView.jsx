import { useState } from "react";
import { SYSTEM_DYNAMICS } from "../data/system-dynamics";
import { Icon, appIcons } from "../icons";

export function SystemDynamicsView({ isMobile, filters = {} }) {
  const dynamics = SYSTEM_DYNAMICS.filter(d => !filters.commodity || d.commodities.includes(filters.commodity));
  return (
    <div style={{ animation: "fadeIn var(--duration-slow) var(--ease-out)" }}>
      <div className="editorial-folio" style={{ marginBottom: 16 }}>{String(dynamics.length).padStart(2, "0")} forces shaping the market</div>
      <h2 className="editorial-display" style={{
        fontFamily: "var(--font-sans)",
        color: "var(--foreground)",
        margin: "0 0 20px",
      }}>System Dynamics</h2>
      <p className="editorial-deck" style={{
        fontFamily: "var(--font-sans)",
        color: "var(--muted-foreground)",
        margin: "0 0 48px",
      }}>
        The forces that shape how all the actors interact. These are the rules of the game.
      </p>
      {dynamics.length === 0 && (
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          fontStyle: "italic",
          color: "color-mix(in oklch, var(--foreground) 40%, transparent)",
          margin: 0,
        }}>No system dynamics for this filter.</p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {dynamics.map((d, index) => (
          <DynamicCard key={d.name} dynamic={d} index={index} />
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
        background: open ? "var(--surface-1)" : "transparent",
        borderTop: "1px solid var(--border)",
        padding: "22px 0",
        cursor: "pointer",
        transition: "background-color var(--duration-base) var(--ease-out), color var(--duration-base) var(--ease-out)",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "48px minmax(0, 1fr) 24px", gap: 16, alignItems: "center" }}>
        <span className="editorial-folio">{String(index + 1).padStart(2, "0")}</span>
        <h3 style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(1.2rem, 2vw, 1.75rem)",
          fontWeight: 650,
          letterSpacing: "-0.025em",
          color: "var(--foreground)",
          margin: 0,
        }}>{dynamic.name}</h3>
        <span style={{
          color: "var(--muted-foreground)",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform var(--duration-base) var(--ease-out)",
        }}><Icon path={appIcons.chevron} size={18} /></span>
      </div>
      {open && (
        <p className="editorial-copy" style={{
          fontFamily: "var(--font-sans)",
          color: "var(--fg-75)",
          margin: "18px 40px 2px 64px",
        }}>{dynamic.description}</p>
      )}
    </div>
  );
}
