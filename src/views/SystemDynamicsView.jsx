import { useState } from "react";
import { SYSTEM_DYNAMICS } from "../data/system-dynamics";

export function SystemDynamicsView({ isMobile, filters = {} }) {
  const dynamics = SYSTEM_DYNAMICS.filter(d => !filters.commodity || d.commodities.includes(filters.commodity));
  return (
    <div style={{ animation: "fadeIn var(--duration-slow) var(--ease-out)" }}>
      <h2 style={{
        fontFamily: "var(--font-sans)",
        fontSize: isMobile ? 24 : 28,
        fontWeight: 400,
        color: "var(--foreground)",
        margin: "0 0 8px",
      }}>System Dynamics</h2>
      <p style={{
        fontFamily: "var(--font-sans)",
        fontSize: isMobile ? 14 : 14.5,
        lineHeight: 1.7,
        color: "color-mix(in oklch, var(--foreground) 50%, transparent)",
        margin: "0 0 28px",
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
        {dynamics.map((d) => (
          <DynamicCard key={d.name} dynamic={d} />
        ))}
      </div>
    </div>
  );
}

function DynamicCard({ dynamic }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: open ? "color-mix(in oklch, var(--foreground) 4%, transparent)" : "color-mix(in oklch, var(--foreground) 2%, transparent)",
        border: `1px solid ${open ? "color-mix(in oklch, var(--border) 65%, transparent)" : "color-mix(in oklch, var(--foreground) 5%, transparent)"}`,
        borderRadius: "calc(var(--radius) * 2)",
        padding: "14px 18px",
        cursor: "pointer",
        transition: "background-color var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{
          fontFamily: "var(--font-sans)",
          fontSize: 16,
          fontWeight: 400,
          color: "var(--foreground)",
          margin: 0,
        }}>{dynamic.name}</h3>
        <span style={{
          color: "color-mix(in oklch, var(--foreground) 25%, transparent)",
          fontSize: 16,
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform var(--duration-base) var(--ease-out)",
        }}>+</span>
      </div>
      {open && (
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14.5,
          lineHeight: 1.75,
          color: "color-mix(in oklch, var(--foreground) 75%, transparent)",
          margin: "12px 0 0",
        }}>{dynamic.description}</p>
      )}
    </div>
  );
}
