import { useState } from "react";
import {
  EFFECT_TYPES,
  getOutboundEffects,
  getInboundEffects,
  getActorName,
  groupEffectsByType
} from "../data/cross-references";
import { ACTORS, CONFIDENCE, TIERS } from "../data/actors";
import { PERSONAS } from "../data/personas";
import { riskColor } from "../theme";

const NO_FILTERS = { commodity: null, lens: null, effectType: null };

// Lens set: the persona's primary ∪ secondary actors. Cargill (trading-house) is always in it.
function lensActorSet(lens) {
  if (!lens || !PERSONAS[lens]) return null;
  const p = PERSONAS[lens];
  return new Set([...p.primaryActors, ...p.secondaryActors, "trading-house"]);
}

function actorHasCommodity(actor, commodity) {
  return !commodity || actor.strategies.some(s => s.commodities.includes(commodity));
}

// Actors to list under the current filters. The selected actor is always kept
// (flagged `outsideLens` when the lens would otherwise hide it).
export function listActors(filters, selectedActor) {
  const set = lensActorSet(filters.lens);
  return ACTORS
    .filter(a => !set || set.has(a.id) || a.id === selectedActor)
    .map(a => ({
      actor: a,
      outsideLens: !!set && !set.has(a.id),
      dimmed: !actorHasCommodity(a, filters.commodity),
    }));
}

// All three dimensions AND-compose. `otherEndpoint` is the effect's far end
// (target for outbound, source for inbound).
function filterEffects(effects, filters, otherEndpoint) {
  const set = lensActorSet(filters.lens);
  return effects.filter(e =>
    (!filters.commodity || e.commodities.includes(filters.commodity)) &&
    (!filters.effectType || e.type === filters.effectType) &&
    (!set || set.has(otherEndpoint(e)))
  );
}

function OutsideLensMark() {
  return (
    <span style={{
      fontSize: 9,
      fontFamily: "'JetBrains Mono', monospace",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: "rgba(232,228,220,0.4)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 2,
      padding: "1px 5px",
    }}>outside lens</span>
  );
}

function EmptyState({ text }) {
  return (
    <p style={{
      fontFamily: "'Source Serif 4', Georgia, serif",
      fontSize: 13,
      fontStyle: "italic",
      color: "rgba(232,228,220,0.4)",
      margin: 0,
    }}>{text}</p>
  );
}

export function ActorCard({ actor, onClick, isActive, isMobile, outsideLens, dimmed }) {
  const conf = CONFIDENCE[actor.confidence];
  return (
    <button
      onClick={onClick}
      style={{
        background: isActive ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isActive ? actor.accent + "66" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 6,
        padding: isMobile ? "10px 12px" : "14px 16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        textAlign: "left",
        width: "100%",
        opacity: dimmed ? 0.4 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
        <span style={{ fontSize: isMobile ? 18 : 20 }}>{actor.icon}</span>
        <span style={{
          fontFamily: "'Newsreader', 'DM Serif Display', Georgia, serif",
          fontSize: isMobile ? 14 : 15,
          color: isActive ? "#E8E4DC" : "rgba(232,228,220,0.75)",
          fontWeight: 400,
        }}>{actor.name}</span>
        {outsideLens && <OutsideLensMark />}
      </div>
      <div style={{
        fontSize: 9,
        fontFamily: "'JetBrains Mono', monospace",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: conf.color,
        marginLeft: 28,
      }}>
        {actor.strategies?.length || 0} strategies · {conf.label}
      </div>
    </button>
  );
}

function StrategyRow({ strategy, actorId, filters }) {
  const [open, setOpen] = useState(false);
  const rc = riskColor(strategy.risk);
  const effects = filterEffects(getOutboundEffects(actorId, strategy.name), filters, e => e.targetActor);

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
          {effects.length > 0 && (
            <span style={{
              fontSize: 9,
              fontFamily: "'JetBrains Mono', monospace",
              color: "rgba(255,255,255,0.3)",
            }}>
              · {effects.length} effect{effects.length !== 1 ? 's' : ''}
            </span>
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
          {effects.length > 0 && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{
                fontSize: 9,
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.3)",
                marginBottom: 10,
              }}>Effects on Other Actors</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {effects.map((effect, i) => {
                  const et = EFFECT_TYPES[effect.type];
                  return (
                    <div key={i} style={{
                      padding: "8px 12px",
                      background: et.bg,
                      border: `1px solid ${et.border}`,
                      borderRadius: 4,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 11,
                          color: et.color,
                        }}>→ {getActorName(effect.targetActor)}</span>
                        <span style={{
                          fontSize: 9,
                          fontFamily: "'JetBrains Mono', monospace",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          padding: "1px 5px",
                          borderRadius: 2,
                          background: "rgba(0,0,0,0.2)",
                          color: et.color,
                        }}>{et.label}</span>
                      </div>
                      <p style={{
                        fontFamily: "'Source Serif 4', Georgia, serif",
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: "rgba(232,228,220,0.7)",
                        margin: 0,
                      }}>{effect.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AffectedBySection({ actorId, isMobile, filters }) {
  const allInbound = getInboundEffects(actorId);
  const inboundEffects = filterEffects(allInbound, filters, e => e.sourceActor);
  const grouped = groupEffectsByType(inboundEffects);
  const effectTypeOrder = ['opportunity', 'signal', 'constraint', 'pressure'];

  const filterActive = filters.commodity || filters.lens || filters.effectType;
  if (allInbound.length === 0 && !filterActive) return null;

  return (
    <div style={{ marginBottom: isMobile ? 20 : 28 }}>
      <div style={{
        fontSize: 9,
        fontFamily: "'JetBrains Mono', monospace",
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        color: "rgba(255,255,255,0.35)",
        marginBottom: 10,
      }}>Affected By Other Actors</div>
      {inboundEffects.length === 0 && <EmptyState text="No cross-references for this filter." />}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {effectTypeOrder.map(type => {
          const effects = grouped[type];
          if (!effects || effects.length === 0) return null;
          const et = EFFECT_TYPES[type];
          return (
            <div key={type}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: et.color,
                }} />
                <span style={{
                  fontSize: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: et.color,
                }}>{et.label}s ({effects.length})</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {effects.map((effect, i) => (
                  <div key={i} style={{
                    padding: "10px 14px",
                    background: et.bg,
                    border: `1px solid ${et.border}`,
                    borderRadius: 5,
                  }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: 4,
                    }}>
                      From: <span style={{ color: et.color }}>{getActorName(effect.sourceActor)}</span>
                      {" → "}
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>"{effect.strategy}"</span>
                    </div>
                    <p style={{
                      fontFamily: "'Source Serif 4', Georgia, serif",
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: "rgba(232,228,220,0.7)",
                      margin: 0,
                    }}>{effect.description}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ActorDetail({ actor, isMobile, filters = NO_FILTERS }) {
  const conf = CONFIDENCE[actor.confidence];
  const lensSet = lensActorSet(filters.lens);
  const outsideLens = !!lensSet && !lensSet.has(actor.id);
  const strategies = (actor.strategies || []).filter(s => !filters.commodity || s.commodities.includes(filters.commodity));
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ marginBottom: isMobile ? 20 : 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: isMobile ? 24 : 28 }}>{actor.icon}</span>
          <h2 style={{
            fontFamily: "'Newsreader', 'DM Serif Display', Georgia, serif",
            fontSize: isMobile ? 22 : 28,
            fontWeight: 400,
            margin: 0,
            color: actor.accent,
          }}>{actor.name}</h2>
          {outsideLens && <OutsideLensMark />}
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
            {conf.label}
          </span>
        </div>
      </div>

      {[
        { label: "Role", content: actor.role },
        { label: "Primary Goal", content: actor.goal },
        { label: "Information Advantage", content: actor.infoAdvantage },
        { label: "Constraints", content: actor.constraints },
      ].map(section => (
        <div key={section.label} style={{ marginBottom: isMobile ? 16 : 20 }}>
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
            fontSize: isMobile ? 14 : 14.5,
            lineHeight: 1.75,
            color: "rgba(232,228,220,0.8)",
            margin: 0,
          }}>{section.content}</p>
        </div>
      ))}

      {actor.relationships && actor.relationships.length > 0 && (
        <div style={{ marginBottom: isMobile ? 20 : 28 }}>
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

      <AffectedBySection actorId={actor.id} isMobile={isMobile} filters={filters} />

      {actor.strategies && actor.strategies.length > 0 && (
        <div>
          <div style={{
            fontSize: 9,
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.35)",
            marginBottom: 10,
          }}>Pricing Strategies ({strategies.length})</div>
          {strategies.length === 0 && <EmptyState text="No strategies for this filter." />}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {strategies.map((s) => (
              <StrategyRow key={s.name} strategy={s} actorId={actor.id} filters={filters} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function MobileActorSelector({ selectedActor, onSelect, isOpen, onToggle, filters = NO_FILTERS }) {
  const actor = ACTORS.find(a => a.id === selectedActor);
  const listed = listActors(filters, selectedActor);

  return (
    <div style={{ marginBottom: 16 }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8,
          padding: "12px 16px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{actor?.icon}</span>
          <span style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 16,
            color: "#E8E4DC",
          }}>{actor?.name}</span>
        </div>
        <span style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: 12,
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
        }}>▼</span>
      </button>

      {isOpen && (
        <div style={{
          marginTop: 8,
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
          padding: 12,
          maxHeight: "60vh",
          overflowY: "auto",
        }}>
          {TIERS.map(tier => {
            const rows = listed.filter(r => r.actor.tier === tier.id);
            if (rows.length === 0) return null;
            return (
              <div key={tier.id} style={{ marginBottom: 12 }}>
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
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {rows.map(({ actor: a, outsideLens, dimmed }) => (
                    <ActorCard
                      key={a.id}
                      actor={a}
                      isActive={selectedActor === a.id}
                      onClick={() => { onSelect(a.id); onToggle(); }}
                      isMobile={true}
                      outsideLens={outsideLens}
                      dimmed={dimmed}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
