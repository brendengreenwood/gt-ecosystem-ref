import { COMMODITIES } from "../data/actors";
import { PERSONAS } from "../data/personas";
import { EFFECT_TYPES } from "../data/cross-references";

function Chip({ label, color, selected, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      style={{
        background: selected ? color + "33" : "rgba(255,255,255,0.03)",
        border: `1px solid ${selected ? color : "rgba(255,255,255,0.1)"}`,
        borderRadius: 3,
        padding: "3px 9px",
        cursor: "pointer",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: selected ? "#E8E4DC" : "rgba(232,228,220,0.55)",
        transition: "all 0.15s ease",
      }}
    >{label}</button>
  );
}

function Group({ title, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <span style={{
        fontSize: 9,
        fontFamily: "'JetBrains Mono', monospace",
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        color: "rgba(255,255,255,0.3)",
        marginRight: 2,
      }}>{title}</span>
      {children}
    </div>
  );
}

export default function FilterBar({ filters, onChange, showEffectType, isMobile }) {
  const { commodity, lens, effectType } = filters;
  const anySet = commodity || lens || effectType;
  const toggle = (key, value) => onChange({ ...filters, [key]: filters[key] === value ? null : value });

  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "center",
      gap: isMobile ? 10 : 20,
      flexWrap: "wrap",
      padding: "12px 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      marginBottom: 20,
    }}>
      <Group title="Commodity">
        {Object.entries(COMMODITIES).map(([k, c]) => (
          <Chip key={k} label={c.label} color={c.color} selected={commodity === k} onClick={() => toggle("commodity", k)} />
        ))}
      </Group>
      <Group title="Lens">
        {Object.entries(PERSONAS).map(([k, p]) => (
          <Chip key={k} label={p.shortTitle} color={p.color} selected={lens === k} onClick={() => toggle("lens", k)} />
        ))}
      </Group>
      {showEffectType && (
        <Group title="Effect">
          {Object.entries(EFFECT_TYPES).map(([k, e]) => (
            <Chip key={k} label={e.label} color={e.color} selected={effectType === k} onClick={() => toggle("effectType", k)} />
          ))}
        </Group>
      )}
      {anySet && (
        <button
          type="button"
          onClick={() => onChange({ commodity: null, lens: null, effectType: null })}
          style={{
            background: "none",
            border: "none",
            padding: "3px 6px",
            cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(232,228,220,0.5)",
            textDecoration: "underline",
          }}
        >Clear</button>
      )}
    </div>
  );
}
