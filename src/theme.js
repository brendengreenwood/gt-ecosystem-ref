export const riskColor = (risk) => {
  const mix = (v, p) => `color-mix(in oklch, ${v} ${p}%, transparent)`;
  const of = (v) => ({ bg: mix(v, 12), text: v, border: mix(v, 30) });
  switch (risk) {
    case "low": return of("var(--success-400)");
    case "medium": return of("var(--warning-400)");
    case "high": return of("var(--error-400)");
    default: return of("var(--neutral-400)");
  }
};
