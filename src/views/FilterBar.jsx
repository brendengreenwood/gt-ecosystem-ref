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
        background: selected ? `color-mix(in oklch, ${color} 20%, transparent)` : "color-mix(in oklch, var(--foreground) 3%, transparent)",
        border: `1px solid ${selected ? color : "color-mix(in oklch, var(--border) 65%, transparent)"}`,
        borderRadius: "var(--radius)",
        padding: "3px 9px",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: 10,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: selected ? "var(--foreground)" : "color-mix(in oklch, var(--foreground) 55%, transparent)",
        transition: "background-color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)",
      }}
    >{label}</button>
  );
}

function Group({ title, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <span style={{
        fontSize: 9,
        fontFamily: "var(--font-sans)",
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        color: "color-mix(in oklch, var(--foreground) 30%, transparent)",
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
      borderBottom: "1px solid color-mix(in oklch, var(--foreground) 5%, transparent)",
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
            fontFamily: "var(--font-sans)",
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "color-mix(in oklch, var(--foreground) 50%, transparent)",
            textDecoration: "underline",
          }}
        >Clear</button>
      )}
    </div>
  );
}
