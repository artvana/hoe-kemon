'use client'

import { HoekemonData } from '@/lib/types'
import { TYPE_COLOURS, TYPE_TEXT_COLOURS } from '@/lib/typeColours'

interface HoekemonCardProps {
  data: HoekemonData
  spriteUrl: string | null
  forCapture?: boolean
}

// ─── colour helpers ────────────────────────────────────────────────────────────

function darkenHex(hex: string, amount = 0.55): string {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * amount)
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * amount)
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * amount)
  return `rgb(${r},${g},${b})`
}

function lightenHex(hex: string, t = 0.55): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.min(255, r + Math.round((255 - r) * t))},${Math.min(255, g + Math.round((255 - g) * t))},${Math.min(255, b + Math.round((255 - b) * t))})`
}

// ─── Energy symbol (TCG-style coloured circle) ────────────────────────────────

function Energy({ type, size = 16 }: { type: string; size?: number }) {
  const bg = TYPE_COLOURS[type] ?? '#A8A878'
  const fg = TYPE_TEXT_COLOURS[type] ?? '#000'
  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, ${lightenHex(bg, 0.5)}, ${bg})`,
        border: `${size > 12 ? 1.5 : 1}px solid rgba(0,0,0,0.55)`,
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: size * 0.28,
        color: fg,
        lineHeight: 1,
      }}>
        {type[0]}
      </span>
    </div>
  )
}

// ─── Colorless retreat dot ────────────────────────────────────────────────────

function Colorless({ size = 12 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 35% 35%, #ddd, #aaa)',
      border: '1px solid rgba(0,0,0,0.4)',
      flexShrink: 0,
    }} />
  )
}

// ─── Card ────────────────────────────────────────────────────────────────────

export default function HoekemonCard({ data, spriteUrl, forCapture = false }: HoekemonCardProps) {
  const tc = TYPE_COLOURS[data.type1] ?? '#A8A878'
  const tcDark = darkenHex(tc, 0.6)
  const retreat = Math.max(1, Math.min(4, Math.round(data.stats.drama / 30)))

  // attack energy cost: cheaper for low power, more for high
  const energyCost = (power: number) => Math.max(1, Math.min(3, Math.round(power / 40)))

  const card = (
    <div
      style={{
        width: 500,
        height: 700,
        borderRadius: 18,
        // outer border matches type — like Charizard's orange/red frame
        background: `linear-gradient(145deg, ${lightenHex(tc, 0.3)}, ${tc}, ${tcDark})`,
        padding: 10,
        boxSizing: 'border-box',
        fontFamily: "'Press Start 2P', monospace",
        boxShadow: '0 10px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.25)',
        position: 'relative',
      }}
    >
      {/* ── Inner card body (cream) ─────────────────────────────────────────── */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 10,
          background: '#FEF5E0',
          boxSizing: 'border-box',
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          border: '1px solid rgba(0,0,0,0.12)',
        }}
      >

        {/* ── HEADER: stage | name | HP + type ─────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          {/* Left: stage badge + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Stage badge */}
            <div style={{
              background: tc,
              border: `2px solid ${tcDark}`,
              borderRadius: 4,
              padding: '2px 4px',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <span style={{ fontSize: 4, color: TYPE_TEXT_COLOURS[data.type1] ?? '#000', lineHeight: 1.2 }}>BASIC</span>
            </div>
            {/* Name */}
            <span style={{
              fontFamily: "'VT323', monospace",
              fontSize: 28,
              color: '#111',
              lineHeight: 1,
              letterSpacing: 1,
            }}>
              {data.name}
            </span>
          </div>

          {/* Right: HP + type energy */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <span style={{
                fontFamily: "'VT323', monospace",
                fontSize: 26,
                color: '#CC0000',
                lineHeight: 1,
              }}>
                {data.hp}
              </span>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: '#CC0000' }}>HP</span>
            </div>
            <Energy type={data.type1} size={18} />
            {data.type2 && <Energy type={data.type2} size={18} />}
          </div>
        </div>

        {/* ── ILLUSTRATION BOX ─────────────────────────────────────────────── */}
        <div style={{
          borderRadius: 6,
          // gradient frame like the Charizard card's warm glow
          background: `linear-gradient(135deg, ${lightenHex(tc, 0.4)}, ${tc} 40%, ${tcDark})`,
          padding: 6,
          position: 'relative',
          height: 230,
          flexShrink: 0,
          border: `2px solid ${tcDark}`,
          boxShadow: `3px 3px 0 ${darkenHex(tc, 0.4)}, inset 0 1px 0 rgba(255,255,255,0.3)`,
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: 3,
            background: lightenHex(tc, 0.6),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {spriteUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={spriteUrl}
                alt={data.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  imageRendering: 'auto',
                  mixBlendMode: 'multiply',
                }}
              />
            ) : (
              // shimmer while loading
              <div style={{
                width: '100%', height: '100%',
                background: `linear-gradient(90deg, ${lightenHex(tc, 0.5)} 25%, ${lightenHex(tc, 0.75)} 50%, ${lightenHex(tc, 0.5)} 75%)`,
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }} />
            )}
          </div>
          {/* Illustrator credit */}
          <span style={{
            position: 'absolute',
            bottom: 8,
            right: 10,
            fontFamily: "'VT323', monospace",
            fontSize: 11,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.8)',
            textShadow: '0 1px 2px rgba(0,0,0,0.6)',
          }}>
            Illus. Prof. Oak
          </span>
        </div>

        {/* ── SPECIES STRIP ─────────────────────────────────────────────────── */}
        <div style={{
          background: `linear-gradient(90deg, ${lightenHex(tc, 0.7)}, #FEF5E0 60%)`,
          borderTop: `1px solid ${tcDark}`,
          borderBottom: `1px solid ${tcDark}`,
          padding: '4px 8px',
          marginTop: 5,
        }}>
          <span style={{
            fontFamily: "'VT323', monospace",
            fontSize: 14,
            fontStyle: 'italic',
            color: '#333',
          }}>
            {data.type1} Pokémon.&nbsp; Ht: {data.height}.&nbsp; Wt: {data.weight}.
          </span>
        </div>

        {/* ── CATCH PHRASE ─────────────────────────────────────────────────── */}
        <div style={{ padding: '3px 4px' }}>
          <span style={{
            fontFamily: "'VT323', monospace",
            fontSize: 13,
            fontStyle: 'italic',
            color: '#555',
          }}>
            {data.catchPhrase}
          </span>
        </div>

        {/* ── ATTACKS ──────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1, marginTop: 2 }}>
          {data.attacks.map((atk, i) => (
            <div key={i}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '4px 4px',
                gap: 5,
              }}>
                {/* Energy cost circles */}
                <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                  {Array.from({ length: energyCost(atk.power) }).map((_, j) => (
                    <Energy key={j} type={atk.type} size={14} />
                  ))}
                </div>

                {/* Attack name */}
                <span style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 6,
                  color: '#1a1a1a',
                  flex: 1,
                  lineHeight: 1.5,
                }}>
                  {atk.superEffective && (
                    <span style={{ color: '#CC0000', marginRight: 3 }}>★</span>
                  )}
                  {atk.name}
                </span>

                {/* Damage */}
                <span style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: 22,
                  color: '#111',
                  lineHeight: 1,
                  minWidth: 36,
                  textAlign: 'right',
                  fontWeight: 'bold',
                }}>
                  {atk.power}
                </span>
              </div>
              {i < data.attacks.length - 1 && (
                <div style={{ height: 1, background: `${tcDark}33`, margin: '0 4px' }} />
              )}
            </div>
          ))}
        </div>

        {/* ── WEAKNESS / RESISTANCE / RETREAT ───────────────────────────────── */}
        <div style={{
          display: 'flex',
          borderTop: `1px solid ${tcDark}`,
          borderBottom: `1px solid ${tcDark}`,
          marginTop: 2,
          background: 'rgba(0,0,0,0.03)',
        }}>
          {[
            {
              label: 'weakness',
              content: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Energy type={data.weakness} size={14} />
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: 13 }}>×2</span>
                </div>
              ),
            },
            {
              label: 'resistance',
              content: (
                <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: '#555' }}>—</span>
              ),
            },
            {
              label: 'retreat cost',
              content: (
                <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  {Array.from({ length: retreat }).map((_, j) => (
                    <Colorless key={j} size={12} />
                  ))}
                </div>
              ),
            },
          ].map((col, i) => (
            <div key={i} style={{
              flex: 1,
              padding: '4px 6px',
              borderRight: i < 2 ? `1px solid ${tcDark}44` : undefined,
            }}>
              <div style={{ fontSize: 5, color: '#666', marginBottom: 3, textTransform: 'lowercase' }}>{col.label}</div>
              {col.content}
            </div>
          ))}
        </div>

        {/* ── POKÉDEX ENTRY ─────────────────────────────────────────────────── */}
        <div style={{
          background: lightenHex(tc, 0.8),
          border: `1px solid ${tcDark}44`,
          borderRadius: 3,
          padding: '5px 8px',
          marginTop: 3,
        }}>
          <span style={{
            fontFamily: "'VT323', monospace",
            fontSize: 13,
            fontStyle: 'italic',
            color: '#444',
            lineHeight: 1.4,
            display: 'block',
          }}>
            {data.pokedexEntry}
          </span>
        </div>

        {/* ── FOOTER ────────────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: 3,
          marginTop: 2,
        }}>
          {['Illus. Prof. Oak', '©1999 Nintendo / Prof. Oak', 'HOE-KDEX 69/069 ★'].map((t, i) => (
            <span key={i} style={{ fontSize: 5, color: '#888' }}>{t}</span>
          ))}
        </div>

      </div>
    </div>
  )

  if (forCapture) return card

  return (
    <div style={{ transform: 'scale(var(--card-scale, 1))', transformOrigin: 'top center' }}>
      <style>{`
        :root { --card-scale: 1; }
        @media (max-width: 520px) { :root { --card-scale: 0.72; } }
        @media (max-width: 380px) { :root { --card-scale: 0.62; } }
      `}</style>
      {card}
    </div>
  )
}
