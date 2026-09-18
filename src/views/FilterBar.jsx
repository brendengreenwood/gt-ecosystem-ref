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
        minHeight: "var(--control-h-sm)",
        background: selected ? "var(--secondary)" : "var(--card)",
        border: `1px solid ${selected ? color : "var(--border)"}`,
        borderRadius: "calc(var(--radius) * 1.5)",
        padding: "0 10px",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        fontWeight: selected ? 600 : 500,
        color: selected ? "var(--foreground)" : "var(--muted-foreground)",
        transition: "background-color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)",
      }}
    >{label}</button>
  );
}

function Group({ title, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <span style={{
        fontSize: 12,
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        color: "var(--muted-foreground)",
        marginRight: 4,
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
      gap: isMobile ? 12 : 20,
      flexWrap: "wrap",
      padding: isMobile ? 12 : 14,
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "calc(var(--radius) * 2)",
      boxShadow: "var(--shadow-sm)",
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
            minHeight: "var(--control-h-sm)",
            background: "transparent",
            border: "1px solid transparent",
            borderRadius: "calc(var(--radius) * 1.5)",
            padding: "0 10px",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            fontWeight: 500,
            color: "var(--muted-foreground)",
          }}
        >Clear</button>
      )}
    </div>
  );
}
