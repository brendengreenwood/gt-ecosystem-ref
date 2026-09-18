import { PERSONAS } from "../data/personas";
import { ACTORS, DATA_TYPE_STYLES } from "../data/actors";
import { ActorIcon, PersonaIcon } from "../icons";

export function TheHouseView({ isMobile }) {
  const house = PERSONAS["trading-house-org"];

  return (
    <div style={{ animation: "fadeIn var(--duration-slow) var(--ease-out)" }}>
      <div style={{
        padding: isMobile ? "24px 0 28px" : "48px 0 56px",
        borderBottom: "1px solid var(--border)",
        marginBottom: isMobile ? 28 : 48,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <PersonaIcon persona={house} size={isMobile ? 36 : 48} color="var(--primary)" />
          <div>
            <h2 className="editorial-display" style={{
              fontFamily: "var(--font-sans)",
              margin: 0,
              color: "var(--foreground)",
            }}>{house.title}</h2>
            <div style={{
              fontSize: 13,
              fontFamily: "var(--font-sans)",
              color: "color-mix(in oklch, var(--foreground) 50%, transparent)",
              marginTop: 4,
            }}>{house.tagline}</div>
          </div>
        </div>

        <p className="editorial-deck" style={{
          fontFamily: "var(--font-sans)",
          color: "var(--fg-90)",
          margin: "28px 0 36px",
        }}>{house.role}</p>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 20,
        }}>
          <div>
            <div style={{
              fontSize: 9,
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "color-mix(in oklch, var(--foreground) 35%, transparent)",
              marginBottom: 8,
            }}>The Goal</div>
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              lineHeight: 1.7,
              color: "color-mix(in oklch, var(--foreground) 70%, transparent)",
              margin: 0,
            }}>{house.goal}</p>
          </div>
          <div>
            <div style={{
              fontSize: 9,
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "color-mix(in oklch, var(--foreground) 35%, transparent)",
              marginBottom: 8,
            }}>World View</div>
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              lineHeight: 1.7,
              color: "color-mix(in oklch, var(--foreground) 70%, transparent)",
              margin: 0,
            }}>{house.worldView}</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: isMobile ? 24 : 32 }}>
        <div className="editorial-section-label" style={{
          fontSize: 9,
          fontFamily: "var(--font-mono)",
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
                border: `1px solid color-mix(in oklch, ${style.color} 28%, var(--border))`,
                borderRadius: "calc(var(--radius) * 2)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{
                    fontSize: 9,
                    fontFamily: "var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "2px 6px",
                    borderRadius: "var(--radius)",
                    background: "color-mix(in oklch, var(--shadow-color) 30%, transparent)",
                    color: style.color,
                  }}>{style.label}</span>
                  <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    color: "var(--foreground)",
                  }}>{data.label}</span>
                </div>
                <p style={{
                  fontFamily: "var(--font-sans)",
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
        <div className="editorial-section-label" style={{
          fontSize: 9,
          fontFamily: "var(--font-mono)",
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
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                color: house.accent,
              }}>{decision.name}</span>
              <span style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                color: "color-mix(in oklch, var(--foreground) 50%, transparent)",
              }}> — {decision.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="editorial-section-label" style={{
          fontSize: 9,
          fontFamily: "var(--font-mono)",
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
                background: `color-mix(in oklch, ${relPartner.color} 8%, var(--card))`,
                border: `1px solid color-mix(in oklch, ${relPartner.color} 28%, var(--border))`,
                borderRadius: "calc(var(--radius) * 2)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <ActorIcon actor={relPartner} size={22} color="var(--muted-foreground)" />
                  <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 16,
                    color: relPartner.accent,
                  }}>{relPartner.title}</span>
                  <span style={{
                    fontSize: 9,
                    fontFamily: "var(--font-mono)",
                    color: "color-mix(in oklch, var(--foreground) 30%, transparent)",
                  }}>↓ reports to the house</span>
                </div>
                <p style={{
                  fontFamily: "var(--font-sans)",
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
      <div style={{ marginBottom: isMobile ? 28 : 48 }}>
        <div className="editorial-folio" style={{ marginBottom: 16 }}>Cargill field guide · four operating lenses</div>
        <h2 className="editorial-display" style={{
          fontFamily: "var(--font-sans)",
          color: "var(--foreground)",
          margin: "0 0 20px",
        }}>Inside the house</h2>
        <p className="editorial-deck" style={{
          fontFamily: "var(--font-sans)",
          color: "var(--muted-foreground)",
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
            fontFamily: "var(--font-sans)",
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
              background: isActive ? `color-mix(in oklch, ${persona.color} 14%, var(--card))` : isPrimary ? `color-mix(in oklch, ${persona.color} 7%, var(--card))` : "var(--card)",
              border: `1px solid ${isActive ? `color-mix(in oklch, ${persona.color} 40%, transparent)` : restingBorder}`,
              borderRadius: "calc(var(--radius) * 2)",
              padding: isMobile ? "12px 14px" : "14px 20px",
              cursor: "pointer",
              transition: "background-color var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out), color var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out)",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <PersonaIcon persona={persona} size={isMobile ? 20 : 24} color={isActive ? "var(--primary)" : "var(--muted-foreground)"} />
              <span style={{
                fontFamily: "var(--font-sans)",
                fontSize: isMobile ? 15 : 17,
                color: isActive ? persona.accent : isPrimary ? "color-mix(in oklch, var(--foreground) 90%, transparent)" : "color-mix(in oklch, var(--foreground) 75%, transparent)",
                fontWeight: 400,
              }}>{persona.shortTitle}</span>
              {badge && (
                <span style={{
                  fontFamily: "var(--font-mono)",
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
              fontFamily: "var(--font-sans)",
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
      background: `linear-gradient(135deg, color-mix(in oklch, ${persona.color} 7%, var(--card)) 0%, var(--card) 60%)`,
      border: `1px solid color-mix(in oklch, ${persona.color} 28%, var(--border))`,
      borderRadius: "calc(var(--radius) * 2)",
      boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <PersonaIcon persona={persona} size={isMobile ? 28 : 36} color="var(--primary)" />
        <div>
          <h2 className="editorial-title" style={{
            fontFamily: "var(--font-sans)",
            margin: 0,
            color: "var(--foreground)",
          }}>{persona.title}</h2>
          <div style={{
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            color: "color-mix(in oklch, var(--foreground) 40%, transparent)",
            marginTop: 2,
          }}>Your lens on the ecosystem</div>
        </div>
      </div>

      <p className="editorial-deck" style={{
        fontFamily: "var(--font-sans)",
        color: "var(--fg-90)",
        margin: "24px 0 32px",
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
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "color-mix(in oklch, var(--foreground) 35%, transparent)",
            marginBottom: 8,
          }}>Your Goal</div>
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            lineHeight: 1.7,
            color: "color-mix(in oklch, var(--foreground) 70%, transparent)",
            margin: 0,
          }}>{persona.goal}</p>
        </div>
        <div>
          <div style={{
            fontSize: 9,
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "color-mix(in oklch, var(--foreground) 35%, transparent)",
            marginBottom: 8,
          }}>World View</div>
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            lineHeight: 1.7,
            color: "color-mix(in oklch, var(--foreground) 70%, transparent)",
            margin: 0,
          }}>{persona.worldView}</p>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="editorial-section-label" style={{
          fontSize: 9,
          fontFamily: "var(--font-mono)",
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
                border: `1px solid color-mix(in oklch, ${style.color} 28%, var(--border))`,
                borderRadius: "calc(var(--radius) * 2)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 9,
                    fontFamily: "var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "1px 6px",
                    borderRadius: "var(--radius)",
                    background: "color-mix(in oklch, var(--shadow-color) 20%, transparent)",
                    color: style.color,
                  }}>{style.label}</span>
                  <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    color: "var(--foreground)",
                  }}>{data.label}</span>
                </div>
                <p style={{
                  fontFamily: "var(--font-sans)",
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
        <div className="editorial-section-label" style={{
          fontSize: 9,
          fontFamily: "var(--font-mono)",
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
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                color: persona.accent,
              }}>{decision.name}</span>
              <span style={{
                fontFamily: "var(--font-sans)",
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
              <ActorIcon actor={relPartner} size={20} color="var(--muted-foreground)" />
              <div style={{
                fontSize: 9,
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: partnerAccent,
              }}>
                {directionIcon} {rel.partnerType === "actor" ? "Ecosystem: " : ""}{partnerName}
              </div>
            </div>
            <p style={{
              fontFamily: "var(--font-sans)",
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
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: partnerAccent,
                  marginBottom: 4,
                }}>They provide you</div>
                <p style={{
                  fontFamily: "var(--font-sans)",
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
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: persona.accent,
                  marginBottom: 4,
                }}>You provide them</div>
                <p style={{
                  fontFamily: "var(--font-sans)",
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

      <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid color-mix(in oklch, ${persona.color} 22%, var(--border))` }}>
        <div style={{
          fontSize: 10,
          fontFamily: "var(--font-mono)",
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
                border: `1px solid color-mix(in oklch, ${persona.color} 32%, var(--border))`,
                borderRadius: "var(--radius)",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                color: persona.accent,
              }}><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><ActorIcon actor={a} size={14} />{a.name}</span></span>
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
                fontFamily: "var(--font-mono)",
                color: "color-mix(in oklch, var(--foreground) 50%, transparent)",
              }}><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><ActorIcon actor={a} size={14} />{a.name}</span></span>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
