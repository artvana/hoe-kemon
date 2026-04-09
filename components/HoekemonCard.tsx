'use client'

import { HoekemonData } from '@/lib/types'
import { TYPE_COLOURS, TYPE_TEXT_COLOURS } from '@/lib/typeColours'

interface HoekemonCardProps {
  data: HoekemonData
  spriteUrl: string | null
  forCapture?: boolean
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function TypePill({ type }: { type: string }) {
  return (
    <span
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 5,
        background: TYPE_COLOURS[type] ?? '#A8A878',
        color: TYPE_TEXT_COLOURS[type] ?? '#000',
        padding: '2px 6px',
        display: 'inline-block',
        lineHeight: 1.8,
        marginLeft: 4,
      }}
    >
      {type.toUpperCase()}
    </span>
  )
}

export default function HoekemonCard({ data, spriteUrl, forCapture = false }: HoekemonCardProps) {
  const type1Colour = TYPE_COLOURS[data.type1] ?? '#A8A878'
  const retreatCost = Math.min(4, Math.round(data.stats.drama / 30))

  const card = (
    <div
      style={{
        width: 500,
        height: 700,
        borderRadius: 12,
        background: '#F5E6C8',
        border: '8px solid #2D5A1B',
        padding: 4,
        boxSizing: 'border-box',
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      {/* Inner border */}
      <div
        style={{
          width: '100%',
          height: '100%',
          border: '2px solid #2D5A1B',
          boxSizing: 'border-box',
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {/* ─── HEADER ─── */}
        <div
          style={{
            background: hexToRgba(type1Colour, 0.25),
            borderBottom: '1px solid #2D5A1B',
            padding: '6px 4px 8px',
          }}
        >
          {/* Name + HP */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 9, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
              {data.name.toUpperCase()}
            </span>
            <span style={{ fontSize: 9, color: '#1a1a1a' }}>
              ♥ HP {data.hp}
            </span>
          </div>
          {/* Stage + types */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 4,
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: 13,
                color: '#555',
              }}
            >
              Basic Pokémon
            </span>
            <TypePill type={data.type1} />
            {data.type2 && <TypePill type={data.type2} />}
          </div>
        </div>

        {/* ─── ILLUSTRATION BOX ─── */}
        <div
          style={{
            border: '2px solid #2D5A1B',
            outline: '2px solid #C8A850',
            outlineOffset: -4,
            background: `radial-gradient(ellipse at center, ${hexToRgba(type1Colour, 0.18)} 0%, #F5E6C8 70%)`,
            height: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {spriteUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={spriteUrl}
              alt={data.name}
              style={{
                width: 160,
                height: 160,
                objectFit: 'contain',
                imageRendering: 'pixelated',
              }}
            />
          ) : (
            <div
              style={{
                width: 160,
                height: 160,
                background: 'linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }}
            />
          )}
          <span
            style={{
              position: 'absolute',
              bottom: 4,
              right: 8,
              fontFamily: "'VT323', monospace",
              fontSize: 11,
              fontStyle: 'italic',
              color: '#777',
            }}
          >
            Illus. Prof. Oak
          </span>
        </div>

        {/* ─── SPECIES BOX ─── */}
        <div
          style={{
            borderTop: '1px solid #999',
            borderBottom: '1px solid #999',
            background: 'rgba(237,217,163,0.5)',
            padding: '5px 4px',
          }}
        >
          <span
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: 13,
              color: '#333',
            }}
          >
            {data.name}, the {data.type1} Pokémon.{' '}
            Length: {data.height}.{' '}
            Wt: {data.weight}.
          </span>
        </div>

        {/* ─── ATTACKS ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {data.attacks.map((atk, i) => (
            <div key={i}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '5px 2px',
                  gap: 6,
                }}
              >
                {/* Type circle */}
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: TYPE_COLOURS[atk.type] ?? '#A8A878',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 4,
                      color: TYPE_TEXT_COLOURS[atk.type] ?? '#000',
                    }}
                  >
                    {atk.type[0]}
                  </span>
                </div>
                {/* Name */}
                <span
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 6,
                    color: '#1a1a1a',
                    flex: 1,
                  }}
                >
                  {atk.superEffective && (
                    <span style={{ color: '#CC0000', marginRight: 3 }}>★</span>
                  )}
                  {atk.name}
                </span>
                {/* Power */}
                <span
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 6,
                    color: '#1a1a1a',
                  }}
                >
                  {atk.power}
                </span>
              </div>
              {i < data.attacks.length - 1 && (
                <div style={{ height: 1, background: '#ccc' }} />
              )}
            </div>
          ))}
        </div>

        {/* ─── WEAKNESS / RESISTANCE / RETREAT ─── */}
        <div
          style={{
            display: 'flex',
            border: '1px solid #999',
            marginTop: 2,
          }}
        >
          {[
            {
              label: 'Weakness',
              value: (
                <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: TYPE_COLOURS[data.weakness] ?? '#C03028' }}>
                  {data.weakness}
                </span>
              ),
            },
            {
              label: 'Resistance',
              value: (
                <span style={{ fontFamily: "'VT323', monospace", fontSize: 16 }}>—</span>
              ),
            },
            {
              label: 'Retreat',
              value: (
                <span style={{ fontFamily: "'VT323', monospace", fontSize: 16 }}>
                  {'●'.repeat(Math.max(1, retreatCost))}
                </span>
              ),
            },
          ].map((col, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: '4px 6px',
                borderRight: i < 2 ? '1px solid #999' : undefined,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <span style={{ fontSize: 5, color: '#555' }}>{col.label}</span>
              {col.value}
            </div>
          ))}
        </div>

        {/* ─── POKÉDEX ENTRY ─── */}
        <div
          style={{
            background: '#EDD9A3',
            borderTop: '1px solid #999',
            padding: '6px 8px',
            flex: 1,
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 4,
          }}
        >
          {['HOE-KDEX No.069', '©1999 Prof. Oak', '✦ THIRST VERSION ✦'].map(
            (t, i) => (
              <span key={i} style={{ fontSize: 5, color: '#888' }}>
                {t}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  )

  if (forCapture) return card

  return (
    <div
      style={{
        transform: 'scale(var(--card-scale, 1))',
      }}
    >
      <style>{`
        :root { --card-scale: 1; }
        @media (max-width: 520px) { :root { --card-scale: 0.85; } }
      `}</style>
      {card}
    </div>
  )
}
