import { useState } from "react";
import { SYSTEM_DYNAMICS } from "../data/system-dynamics";

export function SystemDynamicsView({ isMobile }) {
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <h2 style={{
        fontFamily: "'Newsreader', 'DM Serif Display', Georgia, serif",
        fontSize: isMobile ? 24 : 28,
        fontWeight: 400,
        color: "#E8E4DC",
        margin: "0 0 8px",
      }}>System Dynamics</h2>
      <p style={{
        fontFamily: "'Source Serif 4', Georgia, serif",
        fontSize: isMobile ? 14 : 14.5,
        lineHeight: 1.7,
        color: "rgba(232,228,220,0.5)",
        margin: "0 0 28px",
      }}>
        The forces that shape how all the actors interact. These are the rules of the game.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {SYSTEM_DYNAMICS.map((d) => (
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
