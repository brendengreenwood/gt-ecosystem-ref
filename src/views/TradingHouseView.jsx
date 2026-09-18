import { PERSONAS } from "../data/personas";
import { ACTORS, DATA_TYPE_STYLES } from "../data/actors";

export function TheHouseView({ isMobile }) {
  const house = PERSONAS["trading-house-org"];

  return (
    <div style={{ animation: "fadeIn var(--duration-slow) var(--ease-out)" }}>
      <div style={{
        padding: isMobile ? 20 : 32,
        background: `linear-gradient(135deg, ${house.color}22 0%, transparent 60%)`,
        border: `1px solid ${house.color}44`,
        borderRadius: 12,
        marginBottom: isMobile ? 24 : 32,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <span style={{ fontSize: isMobile ? 36 : 48 }}>{house.icon}</span>
          <div>
            <h2 style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: isMobile ? 26 : 34,
              fontWeight: 400,
              margin: 0,
              color: house.accent,
            }}>{house.title}</h2>
            <div style={{
              fontSize: 13,
              fontFamily: "'Source Serif 4', Georgia, serif",
              color: "color-mix(in oklch, var(--foreground) 50%, transparent)",
              marginTop: 4,
            }}>{house.tagline}</div>
          </div>
        </div>

        <p style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: isMobile ? 15 : 16,
          lineHeight: 1.8,
          color: "color-mix(in oklch, var(--foreground) 85%, transparent)",
          margin: "0 0 24px",
        }}>{house.role}</p>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 20,
        }}>
          <div>
            <div style={{
              fontSize: 9,
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "color-mix(in oklch, var(--foreground) 35%, transparent)",
              marginBottom: 8,
            }}>The Goal</div>
            <p style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 14,
              lineHeight: 1.7,
              color: "color-mix(in oklch, var(--foreground) 70%, transparent)",
              margin: 0,
            }}>{house.goal}</p>
          </div>
          <div>
            <div style={{
              fontSize: 9,
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "color-mix(in oklch, var(--foreground) 35%, transparent)",
              marginBottom: 8,
            }}>World View</div>
            <p style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 14,
              lineHeight: 1.7,
              color: "color-mix(in oklch, var(--foreground) 70%, transparent)",
              margin: 0,
            }}>{house.worldView}</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: isMobile ? 24 : 32 }}>
        <div style={{
          fontSize: 9,
          fontFamily: "'JetBrains Mono', monospace",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "color-mix(in oklch, var(--foreground) 35%, transparent)",
          marginBottom: 12,
        }}>The Information Edge</div>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 10,
        }}>
          {house.dataAccess.map((data, i) => {
            const style = DATA_TYPE_STYLES[data.type];
            return (
              <div key={i} style={{
                padding: "12px 16px",
                background: style.bg,
                border: `1px solid ${style.color}33`,
                borderRadius: "calc(var(--radius) * 2)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{
                    fontSize: 9,
                    fontFamily: "'JetBrains Mono', monospace",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "2px 6px",
                    borderRadius: "var(--radius)",
                    background: "color-mix(in oklch, var(--shadow-color) 30%, transparent)",
                    color: style.color,
                  }}>{style.label}</span>
                  <span style={{
                    fontFamily: "'Newsreader', Georgia, serif",
                    fontSize: 14,
                    color: "var(--foreground)",
                  }}>{data.label}</span>
                </div>
                <p style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "color-mix(in oklch, var(--foreground) 60%, transparent)",
                  margin: 0,
                }}>{data.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: isMobile ? 24 : 32 }}>
        <div style={{
          fontSize: 9,
          fontFamily: "'JetBrains Mono', monospace",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "color-mix(in oklch, var(--foreground) 35%, transparent)",
          marginBottom: 12,
        }}>Strategic Decisions</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {house.decisions.map((decision, i) => (
            <div key={i} style={{
              padding: "12px 16px",
              background: "color-mix(in oklch, var(--foreground) 3%, transparent)",
              border: "1px solid color-mix(in oklch, var(--foreground) 6%, transparent)",
              borderRadius: "calc(var(--radius) * 2)",
            }}>
              <span style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 15,
                color: house.accent,
              }}>{decision.name}</span>
              <span style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: 14,
                color: "color-mix(in oklch, var(--foreground) 50%, transparent)",
              }}> — {decision.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{
          fontSize: 9,
          fontFamily: "'JetBrains Mono', monospace",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "color-mix(in oklch, var(--foreground) 35%, transparent)",
          marginBottom: 12,
        }}>The Organization</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {house.relationships.map((rel, idx) => {
            const relPartner = PERSONAS[rel.partner];
            if (!relPartner) return null;
            return (
              <div key={idx} style={{
                padding: "14px 18px",
                background: `${relPartner.color}15`,
                border: `1px solid ${relPartner.color}33`,
                borderRadius: "calc(var(--radius) * 2)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 22 }}>{relPartner.icon}</span>
                  <span style={{
                    fontFamily: "'Newsreader', Georgia, serif",
                    fontSize: 16,
                    color: relPartner.accent,
                  }}>{relPartner.title}</span>
                  <span style={{
                    fontSize: 9,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "color-mix(in oklch, var(--foreground) 30%, transparent)",
                  }}>↓ reports to the house</span>
                </div>
                <p style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "color-mix(in oklch, var(--foreground) 70%, transparent)",
                  margin: 0,
                }}>{rel.dynamic}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function TradingHouseView({ selectedPersona, onSelectPersona, isMobile }) {
  return (
    <div style={{ animation: "fadeIn var(--duration-slow) var(--ease-out)" }}>
      <div style={{ marginBottom: isMobile ? 20 : 28 }}>
        <h2 style={{
          fontFamily: "'Newsreader', 'DM Serif Display', Georgia, serif",
          fontSize: isMobile ? 24 : 28,
          fontWeight: 400,
          color: "var(--foreground)",
          margin: "0 0 8px",
        }}>Trading House View</h2>
        <p style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: isMobile ? 14 : 14.5,
          lineHeight: 1.7,
          color: "color-mix(in oklch, var(--foreground) 50%, transparent)",
          margin: 0,
        }}>
          How Cargill sees and operates on the ecosystem. The Merchant is the role this reference is built to onboard; the Originator is its closest counterpart. Cargill and Risk are the context they operate inside.
        </p>
      </div>

      <PersonaBar
        selectedPersona={selectedPersona}
        onSelect={onSelectPersona}
        isMobile={isMobile}
      />

      {selectedPersona ? (
        <PersonaDashboard personaId={selectedPersona} isMobile={isMobile} />
      ) : (
        <div style={{
          padding: isMobile ? 24 : 40,
          background: "color-mix(in oklch, var(--foreground) 2%, transparent)",
          border: "1px dashed color-mix(in oklch, var(--border) 65%, transparent)",
          borderRadius: 12,
          textAlign: "center",
        }}>
          <div style={{
            fontSize: 32,
            marginBottom: 12,
            opacity: 0.5,
          }}>🌾 📡</div>
          <p style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: 15,
            color: "color-mix(in oklch, var(--foreground) 50%, transparent)",
            margin: 0,
          }}>
            Select a role above to see how they view the ecosystem
          </p>
        </div>
      )}
    </div>
  );
}

function PersonaBar({ selectedPersona, onSelect, isMobile }) {
  return (
    <div style={{
      display: "flex",
      gap: isMobile ? 8 : 12,
      marginBottom: isMobile ? 16 : 24,
      flexWrap: "wrap",
    }}>
      {Object.values(PERSONAS).map(persona => {
        const isActive = selectedPersona === persona.id;
        const isPrimary = persona.audience === "primary";
        const badge = isPrimary ? "Primary user" : persona.audience === "secondary" ? "Secondary user" : null;
        const restingBorder = isPrimary ? `color-mix(in oklch, ${persona.color} 55%, transparent)` : "color-mix(in oklch, var(--border) 52%, transparent)";
        return (
          <button
            key={persona.id}
            aria-pressed={isActive}
            onClick={() => onSelect(isActive ? null : persona.id)}
            style={{
              flex: isMobile ? "1 1 calc(50% - 4px)" : "0 0 auto",
              background: isActive ? `${persona.color}22` : isPrimary ? `${persona.color}0D` : "color-mix(in oklch, var(--foreground) 2%, transparent)",
              border: `1px solid ${isActive ? `color-mix(in oklch, ${persona.color} 40%, transparent)` : restingBorder}`,
              borderRadius: "calc(var(--radius) * 2)",
              padding: isMobile ? "12px 14px" : "14px 20px",
              cursor: "pointer",
              transition: "all var(--duration-base) var(--ease-out)",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: isMobile ? 20 : 24 }}>{persona.icon}</span>
              <span style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: isMobile ? 15 : 17,
                color: isActive ? persona.accent : isPrimary ? "color-mix(in oklch, var(--foreground) 90%, transparent)" : "color-mix(in oklch, var(--foreground) 75%, transparent)",
                fontWeight: 400,
              }}>{persona.shortTitle}</span>
              {badge && (
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: persona.accent,
                  border: `1px solid ${persona.accent}66`,
                  borderRadius: "var(--radius)",
                  padding: "2px 6px",
                  marginLeft: "auto",
                }}>{badge}</span>
              )}
            </div>
            <div style={{
              fontSize: 11,
              fontFamily: "'Source Serif 4', Georgia, serif",
              color: isActive ? "color-mix(in oklch, var(--foreground) 60%, transparent)" : "color-mix(in oklch, var(--foreground) 35%, transparent)",
              marginLeft: isMobile ? 0 : 34,
            }}>
              {persona.tagline}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function PersonaDashboard({ personaId, isMobile }) {
  const persona = PERSONAS[personaId];

  return (
    <div style={{
      animation: "fadeIn var(--duration-slow) var(--ease-out)",
      marginBottom: isMobile ? 24 : 36,
      padding: isMobile ? 16 : 24,
      background: `linear-gradient(135deg, ${persona.color}11 0%, transparent 60%)`,
      border: `1px solid ${persona.color}33`,
      borderRadius: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: isMobile ? 28 : 36 }}>{persona.icon}</span>
        <div>
          <h2 style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: isMobile ? 22 : 28,
            fontWeight: 400,
            margin: 0,
            color: persona.accent,
          }}>{persona.title}</h2>
          <div style={{
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            color: "color-mix(in oklch, var(--foreground) 40%, transparent)",
            marginTop: 2,
          }}>Your lens on the ecosystem</div>
        </div>
      </div>

      <p style={{
        fontFamily: "'Source Serif 4', Georgia, serif",
        fontSize: isMobile ? 14 : 15,
        lineHeight: 1.75,
        color: "color-mix(in oklch, var(--foreground) 80%, transparent)",
        margin: "0 0 20px",
      }}>{persona.role}</p>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? 16 : 20,
        marginBottom: 20,
      }}>
        <div>
          <div style={{
            fontSize: 9,
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "color-mix(in oklch, var(--foreground) 35%, transparent)",
            marginBottom: 8,
          }}>Your Goal</div>
          <p style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: 13,
            lineHeight: 1.7,
            color: "color-mix(in oklch, var(--foreground) 70%, transparent)",
            margin: 0,
          }}>{persona.goal}</p>
        </div>
        <div>
          <div style={{
            fontSize: 9,
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "color-mix(in oklch, var(--foreground) 35%, transparent)",
            marginBottom: 8,
          }}>World View</div>
          <p style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: 13,
            lineHeight: 1.7,
            color: "color-mix(in oklch, var(--foreground) 70%, transparent)",
            margin: 0,
          }}>{persona.worldView}</p>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 9,
          fontFamily: "'JetBrains Mono', monospace",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "color-mix(in oklch, var(--foreground) 35%, transparent)",
          marginBottom: 10,
        }}>Your Data Access</div>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 8,
        }}>
          {persona.dataAccess.map((data, i) => {
            const style = DATA_TYPE_STYLES[data.type];
            return (
              <div key={i} style={{
                padding: "10px 14px",
                background: style.bg,
                border: `1px solid ${style.color}33`,
                borderRadius: "calc(var(--radius) * 2)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 9,
                    fontFamily: "'JetBrains Mono', monospace",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "1px 6px",
                    borderRadius: "var(--radius)",
                    background: "color-mix(in oklch, var(--shadow-color) 20%, transparent)",
                    color: style.color,
                  }}>{style.label}</span>
                  <span style={{
                    fontFamily: "'Newsreader', Georgia, serif",
                    fontSize: 13,
                    color: "var(--foreground)",
                  }}>{data.label}</span>
                </div>
                <p style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: "color-mix(in oklch, var(--foreground) 60%, transparent)",
                  margin: 0,
                }}>{data.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 9,
          fontFamily: "'JetBrains Mono', monospace",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "color-mix(in oklch, var(--foreground) 35%, transparent)",
          marginBottom: 10,
        }}>Key Decisions You Make</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {persona.decisions.map((decision, i) => (
            <div key={i} style={{
              padding: "10px 14px",
              background: "color-mix(in oklch, var(--foreground) 3%, transparent)",
              border: "1px solid color-mix(in oklch, var(--foreground) 6%, transparent)",
              borderRadius: 5,
            }}>
              <span style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 14,
                color: persona.accent,
              }}>{decision.name}</span>
              <span style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: 13,
                color: "color-mix(in oklch, var(--foreground) 50%, transparent)",
              }}> — {decision.description}</span>
            </div>
          ))}
        </div>
      </div>

      {(persona.relationships || [persona.relationship]).map((rel, idx) => {
        const relPartner = rel.partnerType === "actor"
          ? ACTORS.find(a => a.id === rel.partner)
          : PERSONAS[rel.partner];
        if (!relPartner) return null;
        const partnerColor = relPartner.color || relPartner.accent;
        const partnerAccent = relPartner.accent || relPartner.color;
        const directionIcon = rel.direction === "up" ? "↑" : rel.direction === "down" ? "↓" : rel.direction === "out" ? "→" : "↔";
        const partnerName = relPartner.shortTitle || relPartner.name;
        return (
          <div key={idx} style={{
            padding: isMobile ? 14 : 18,
            background: `${partnerColor}15`,
            border: `1px solid ${partnerColor}33`,
            borderRadius: "calc(var(--radius) * 2)",
            marginBottom: idx < (persona.relationships || [persona.relationship]).length - 1 ? 12 : 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>{relPartner.icon}</span>
              <div style={{
                fontSize: 9,
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: partnerAccent,
              }}>
                {directionIcon} {rel.partnerType === "actor" ? "Ecosystem: " : ""}{partnerName}
              </div>
            </div>
            <p style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 14,
              lineHeight: 1.7,
              color: "color-mix(in oklch, var(--foreground) 75%, transparent)",
              margin: "0 0 12px",
            }}>{rel.dynamic}</p>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 10,
            }}>
              <div style={{
                padding: "8px 12px",
                background: "color-mix(in oklch, var(--shadow-color) 20%, transparent)",
                borderRadius: "var(--radius)",
              }}>
                <div style={{
                  fontSize: 9,
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: partnerAccent,
                  marginBottom: 4,
                }}>They provide you</div>
                <p style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: "color-mix(in oklch, var(--foreground) 60%, transparent)",
                  margin: 0,
                }}>{rel.theyProvide}</p>
              </div>
              <div style={{
                padding: "8px 12px",
                background: "color-mix(in oklch, var(--shadow-color) 20%, transparent)",
                borderRadius: "var(--radius)",
              }}>
                <div style={{
                  fontSize: 9,
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: persona.accent,
                  marginBottom: 4,
                }}>You provide them</div>
                <p style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: "color-mix(in oklch, var(--foreground) 60%, transparent)",
                  margin: 0,
                }}>{rel.youProvide}</p>
              </div>
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${persona.color}22` }}>
        <div style={{
          fontSize: 10,
          fontFamily: "'JetBrains Mono', monospace",
          color: "color-mix(in oklch, var(--foreground) 40%, transparent)",
          marginBottom: 8,
        }}>
          <span style={{ color: persona.accent }}>↓</span> Actors most relevant to you are highlighted below
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {persona.primaryActors.map(id => {
            const a = ACTORS.find(x => x.id === id);
            return a ? (
              <span key={id} style={{
                padding: "4px 10px",
                background: "color-mix(in oklch, var(--foreground) 6%, transparent)",
                border: `1px solid ${persona.color}44`,
                borderRadius: "var(--radius)",
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                color: persona.accent,
              }}>{a.icon} {a.name}</span>
            ) : null;
          })}
          {persona.secondaryActors.map(id => {
            const a = ACTORS.find(x => x.id === id);
            return a ? (
              <span key={id} style={{
                padding: "4px 10px",
                background: "color-mix(in oklch, var(--foreground) 2%, transparent)",
                border: "1px solid color-mix(in oklch, var(--border) 52%, transparent)",
                borderRadius: "var(--radius)",
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                color: "color-mix(in oklch, var(--foreground) 50%, transparent)",
              }}>{a.icon} {a.name}</span>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
