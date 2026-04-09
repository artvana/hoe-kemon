'use client'

import { HoekemonData } from '@/lib/types'
import { TYPE_COLOURS, TYPE_TEXT_COLOURS } from '@/lib/typeColours'

interface HoekemonCardProps {
  data: HoekemonData
  spriteUrl: string | null
  forCapture?: boolean
}

function darkenHex(hex: string, amount = 0.55): string {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * amount)
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * amount)
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * amount)
  return `rgb(${r},${g},${b})`
}

function lightenHex(hex: string, amount = 0.45): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.min(255, r + Math.round((255 - r) * amount))},${Math.min(255, g + Math.round((255 - g) * amount))},${Math.min(255, b + Math.round((255 - b) * amount))})`
}

function EnergySymbol({ type }: { type: string }) {
  const bg = TYPE_COLOURS[type] ?? '#A8A878'
  const fg = TYPE_TEXT_COLOURS[type] ?? '#000'
  return (
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: bg,
        border: '1.5px solid rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 4, color: fg, lineHeight: 1 }}>
        {type[0]}
      </span>
    </div>
  )
}

export default function HoekemonCard({ data, spriteUrl, forCapture = false }: HoekemonCardProps) {
  const type1Colour = TYPE_COLOURS[data.type1] ?? '#A8A878'
  const borderColour = darkenHex(type1Colour)
  const illoBg = lightenHex(type1Colour)
  const retreatCost = Math.max(1, Math.min(4, Math.round(data.stats.drama / 30)))
  const headerText = TYPE_TEXT_COLOURS[data.type1] ?? '#000'

  const card = (
    <div
      style={{
        width: 500,
        height: 700,
        borderRadius: 16,
        background: '#F5E6C8',
        border: `10px solid ${borderColour}`,
        boxSizing: 'border-box',
        padding: 4,
        fontFamily: "'Press Start 2P', monospace",
        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          border: `2px solid ${borderColour}`,
          boxSizing: 'border-box',
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
        }}
      >
        {/* ─── HEADER: stage / name / HP / type ─── */}
        <div
          style={{
            background: type1Colour,
            borderRadius: 4,
            padding: '5px 8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: `1px solid ${borderColour}`,
          }}
        >
          {/* Left: stage + name */}
          <div>
            <div style={{ fontSize: 5, color: headerText, opacity: 0.75, marginBottom: 2 }}>
              Basic Pokémon
            </div>
            <div style={{ fontSize: 10, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
              {data.name.toUpperCase()}
            </div>
          </div>
          {/* Right: HP + type pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: 16, color: '#CC0000', fontWeight: 'bold' }}>{data.hp}</span>
              <span style={{ fontSize: 6, color: '#CC0000' }}>HP</span>
            </div>
            <div style={{ display: 'flex', gap: 3 }}>
              <EnergySymbol type={data.type1} />
              {data.type2 && <EnergySymbol type={data.type2} />}
            </div>
          </div>
        </div>

        {/* ─── ILLUSTRATION BOX ─── */}
        <div
          style={{
            border: `3px solid ${borderColour}`,
            background: illoBg,
            height: 185,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            // classic unlimited-print drop shadow
            boxShadow: `5px 5px 0 ${darkenHex(type1Colour, 0.35)}`,
          }}
        >
          {spriteUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={spriteUrl}
              alt={data.name}
              style={{
                width: '85%',
                height: '85%',
                objectFit: 'contain',
                imageRendering: 'pixelated',
                mixBlendMode: 'multiply', // white background becomes transparent
              }}
            />
          ) : (
            <div
              style={{
                width: 140,
                height: 140,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 25%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.4) 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                borderRadius: 4,
              }}
            />
          )}
          <span
            style={{
              position: 'absolute',
              bottom: 4,
              right: 8,
              fontFamily: "'VT323', monospace",
              fontSize: 12,
              fontStyle: 'italic',
              color: 'rgba(0,0,0,0.45)',
            }}
          >
            Illus. Prof. Oak
          </span>
        </div>

        {/* ─── SPECIES LINE ─── */}
        <div
          style={{
            background: 'rgba(237,217,163,0.6)',
            borderTop: `1px solid ${borderColour}`,
            borderBottom: `1px solid ${borderColour}`,
            padding: '4px 6px',
          }}
        >
          <span style={{ fontFamily: "'VT323', monospace", fontSize: 13, color: '#333' }}>
            {data.type1} Pokémon. Ht: {data.height}. Wt: {data.weight}.
          </span>
        </div>

        {/* ─── CATCH PHRASE ─── */}
        <div style={{ padding: '0 2px' }}>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: 13, color: '#555', fontStyle: 'italic' }}>
            {data.catchPhrase}
          </span>
        </div>

        {/* ─── ATTACKS ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
          {data.attacks.map((atk, i) => (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '4px 2px', gap: 6 }}>
                <EnergySymbol type={atk.type} />
                <span
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 6,
                    color: '#1a1a1a',
                    flex: 1,
                    lineHeight: 1.5,
                  }}
                >
                  {atk.superEffective && (
                    <span style={{ color: '#CC0000', marginRight: 3 }}>★</span>
                  )}
                  {atk.name}
                </span>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: '#1a1a1a', fontWeight: 'bold' }}>
                  {atk.power}
                </span>
              </div>
              {i < data.attacks.length - 1 && (
                <div style={{ height: 1, background: `${borderColour}44` }} />
              )}
            </div>
          ))}
        </div>

        {/* ─── WEAKNESS / RESISTANCE / RETREAT ─── */}
        <div
          style={{
            display: 'flex',
            border: `1px solid ${borderColour}`,
            background: 'rgba(0,0,0,0.04)',
          }}
        >
          {[
            {
              label: 'Weakness',
              value: (
                <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: TYPE_COLOURS[data.weakness] ?? '#C03028' }}>
                  {data.weakness} ×2
                </span>
              ),
            },
            {
              label: 'Resistance',
              value: <span style={{ fontFamily: "'VT323', monospace", fontSize: 16 }}>—</span>,
            },
            {
              label: 'Retreat Cost',
              value: (
                <div style={{ display: 'flex', gap: 2 }}>
                  {Array.from({ length: retreatCost }).map((_, j) => (
                    <div
                      key={j}
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: '#A8A878',
                        border: '1px solid rgba(0,0,0,0.3)',
                      }}
                    />
                  ))}
                </div>
              ),
            },
          ].map((col, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: '4px 5px',
                borderRight: i < 2 ? `1px solid ${borderColour}` : undefined,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <span style={{ fontSize: 5, color: '#666' }}>{col.label}</span>
              {col.value}
            </div>
          ))}
        </div>

        {/* ─── POKÉDEX ENTRY ─── */}
        <div
          style={{
            background: '#EDD9A3',
            border: `1px solid ${borderColour}`,
            padding: '5px 8px',
          }}
        >
          <span
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: 13,
              fontStyle: 'italic',
              color: '#444',
              lineHeight: 1.4,
              display: 'block',
            }}
          >
            {data.pokedexEntry}
          </span>
        </div>

        {/* ─── FOOTER ─── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 2 }}>
          {['HOE-KDEX No.069', '©1999 Prof. Oak', '✦ THIRST VERSION ✦'].map((t, i) => (
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
