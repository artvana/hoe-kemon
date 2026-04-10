'use client'

import { HoekemonData } from '@/lib/types'
import { TYPE_COLOURS, TYPE_TEXT_COLOURS } from '@/lib/typeColours'

interface HoekemonCardProps {
  data: HoekemonData
  spriteUrl: string | null
  forCapture?: boolean
}

// ─── colour helpers ───────────────────────────────────────────────────────────

function darken(hex: string, t = 0.55) {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * t)
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * t)
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * t)
  return `rgb(${r},${g},${b})`
}
function lighten(hex: string, t = 0.5) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.min(255,r+Math.round((255-r)*t))},${Math.min(255,g+Math.round((255-g)*t))},${Math.min(255,b+Math.round((255-b)*t))})`
}

// ─── Energy symbol ────────────────────────────────────────────────────────────

function Energy({ type, size = 18 }: { type: string; size?: number }) {
  const bg    = TYPE_COLOURS[type] ?? '#A8A878'
  const fg    = TYPE_TEXT_COLOURS[type] ?? '#000'
  const light = lighten(bg, 0.5)
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `radial-gradient(circle at 38% 35%, ${light}, ${bg} 70%, ${darken(bg, 0.7)})`,
      border: `${Math.max(1, size * 0.1)}px solid rgba(0,0,0,0.55)`,
      boxShadow: `inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.3)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontSize: size * 0.38, fontWeight: 'bold', color: fg, fontFamily: 'Arial, sans-serif', lineHeight: 1 }}>
        {type[0]}
      </span>
    </div>
  )
}

function Colorless({ size = 14 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'radial-gradient(circle at 38% 35%, #fff, #ccc 65%, #999)',
      border: '1px solid rgba(0,0,0,0.4)',
      boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.8)',
    }} />
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export default function HoekemonCard({ data, spriteUrl, forCapture = false }: HoekemonCardProps) {
  const tc  = TYPE_COLOURS[data.type1] ?? '#A8A878'
  const tcD = darken(tc, 0.45)
  const tcL = lighten(tc, 0.55)

  // Retreat cost from nerve (boldness/activity stat)
  const retreat   = Math.max(1, Math.min(4, Math.round(data.stats.nerve / 30)))
  const costCount = (p: number) => Math.max(1, Math.min(3, Math.round(p / 40)))

  const body     = `Arial, 'Helvetica Neue', sans-serif`
  const namefont = `'Gill Sans', 'Optima', 'Trebuchet MS', Arial, sans-serif`

  const card = (
    // ── Outer card shell — SOLID type colour, like a real Gen 1 card ──────────
    <div style={{
      width: 500, height: 700,
      borderRadius: 16,
      background: tc,
      padding: '9px 9px 11px',
      boxSizing: 'border-box',
      // Layered border: outer highlight + inner dark edge — matches Base Set stamped border
      boxShadow: [
        '0 14px 44px rgba(0,0,0,0.6)',
        `inset 0 2px 0 ${lighten(tc, 0.65)}`,
        `inset 0 -2px 0 ${darken(tc, 0.35)}`,
        `inset 2px 0 0 ${lighten(tc, 0.4)}`,
        `inset -2px 0 0 ${darken(tc, 0.35)}`,
      ].join(', '),
      border: `3px solid ${darken(tc, 0.5)}`,
      position: 'relative',
    }}>

      {/* ── Thin gold inner border — matches the stamped inner frame ── */}
      <div style={{
        position: 'absolute', inset: 6,
        borderRadius: 12,
        border: `2px solid ${lighten(tc, 0.45)}`,
        pointerEvents: 'none', zIndex: 10,
      }} />

      {/* ── Parchment interior ─────────────────────────────────────────────── */}
      <div style={{
        width: '100%', height: '100%',
        borderRadius: 8,
        background: '#FEF3CC',      // authentic Base Set yellow-cream
        boxSizing: 'border-box',
        padding: '8px 10px 6px',
        display: 'flex', flexDirection: 'column', gap: 5,
        overflow: 'hidden',
      }}>

        {/* ── HEADER: stage · name · HP · type ─────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46, flexShrink: 0 }}>
          {/* Stage badge + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
            <div style={{
              background: tc, border: `2px solid ${tcD}`,
              borderRadius: 4, padding: '2px 7px', flexShrink: 0,
            }}>
              <span style={{ fontFamily: body, fontSize: 7.5, fontWeight: 900, color: TYPE_TEXT_COLOURS[data.type1] ?? '#fff', letterSpacing: '0.06em' }}>BASIC</span>
            </div>
            <span style={{
              fontFamily: namefont, fontSize: 22, fontWeight: 800,
              color: '#111', letterSpacing: '-0.03em', lineHeight: 1,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {data.name}
            </span>
          </div>

          {/* HP + type energies */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, marginLeft: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <span style={{ fontFamily: body, fontSize: 21, fontWeight: 900, color: '#CC0000', lineHeight: 1 }}>{data.hp}</span>
              <span style={{ fontFamily: body, fontSize: 7.5, fontWeight: 900, color: '#CC0000', letterSpacing: '0.04em' }}>HP</span>
            </div>
            <Energy type={data.type1} size={22} />
            {data.type2 && <Energy type={data.type2} size={22} />}
          </div>
        </div>

        {/* ── ILLUSTRATION ──────────────────────────────────────────────────── */}
        <div style={{
          height: 235, flexShrink: 0,
          // Outer art-box frame — thick, type-coloured, beveled like Base Set
          border: `5px solid ${tcD}`,
          borderRadius: 4,
          background: `linear-gradient(145deg, ${tcL} 0%, ${tc} 55%, ${darken(tc, 0.3)} 100%)`,
          padding: 5,
          boxShadow: [
            `inset 3px 3px 0 ${lighten(tc, 0.5)}`,   // inner highlight
            `inset -3px -3px 0 ${darken(tc, 0.35)}`,  // inner shadow
            `4px 4px 0 ${darken(tc, 0.4)}`,            // drop shadow
          ].join(', '),
          position: 'relative',
        }}>
          {/* Art canvas */}
          <div style={{
            width: '100%', height: '100%',
            borderRadius: 2,
            background: lighten(tc, 0.78),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {spriteUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={spriteUrl} alt={data.name}
                style={{ width: '94%', height: '94%', objectFit: 'contain', mixBlendMode: 'multiply' }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                background: `linear-gradient(90deg, ${lighten(tc,0.5)} 25%, ${lighten(tc,0.85)} 50%, ${lighten(tc,0.5)} 75%)`,
                backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
              }} />
            )}
          </div>

          {/* Illus. credit */}
          <span style={{
            position: 'absolute', bottom: 7, right: 9,
            fontFamily: body, fontSize: 9.5, fontStyle: 'italic',
            color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 3px rgba(0,0,0,0.75)',
          }}>Illus. Prof. Oak</span>
        </div>

        {/* ── SPECIES LINE ──────────────────────────────────────────────────── */}
        <div style={{
          background: `linear-gradient(90deg, ${lighten(tc, 0.6)}, #FEF3CC 65%)`,
          borderTop: `1.5px solid ${tcD}`, borderBottom: `1.5px solid ${tcD}`,
          padding: '3px 8px', flexShrink: 0,
        }}>
          <span style={{ fontFamily: body, fontSize: 10.5, fontStyle: 'italic', fontWeight: 'bold', color: '#1a1a1a' }}>
            {data.type1} Pokémon&nbsp;·&nbsp;Ht:&nbsp;{data.height}&nbsp;·&nbsp;Wt:&nbsp;{data.weight}
          </span>
        </div>

        {/* ── CATCHPHRASE ───────────────────────────────────────────────────── */}
        <div style={{ padding: '1px 4px', flexShrink: 0 }}>
          <span style={{ fontFamily: body, fontSize: 9.5, fontStyle: 'italic', color: '#555', lineHeight: 1.3 }}>
            {data.catchPhrase}
          </span>
        </div>

        {/* ── ATTACKS ───────────────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {data.attacks.map((atk, i) => (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '4px 4px', gap: 6 }}>
                {/* energy cost */}
                <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                  {Array.from({ length: costCount(atk.power) }).map((_, j) => (
                    <Energy key={j} type={atk.type} size={15} />
                  ))}
                </div>
                {/* name */}
                <span style={{ fontFamily: body, fontSize: 10.5, fontWeight: 'bold', color: '#111', flex: 1, lineHeight: 1.2 }}>
                  {atk.superEffective && <span style={{ color: '#CC0000', marginRight: 3 }}>★</span>}
                  {atk.name}
                </span>
                {/* damage */}
                <span style={{ fontFamily: body, fontSize: 19, fontWeight: 900, color: '#111', minWidth: 32, textAlign: 'right', lineHeight: 1 }}>
                  {atk.power}
                </span>
              </div>
              {i < data.attacks.length - 1 && (
                <div style={{ height: 1, background: `${tcD}33`, margin: '0 4px' }} />
              )}
            </div>
          ))}
        </div>

        {/* ── WEAKNESS / RESISTANCE / RETREAT ───────────────────────────────── */}
        <div style={{ display: 'flex', flexShrink: 0, borderTop: `1.5px solid ${tcD}`, borderBottom: `1.5px solid ${tcD}` }}>
          {[
            { label: 'weakness', content: (
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Energy type={data.weakness} size={15} />
                <span style={{ fontFamily: body, fontSize: 11, fontWeight: 'bold' }}>×2</span>
              </div>
            )},
            { label: 'resistance', content: <span style={{ fontFamily: body, fontSize: 13 }}>—</span> },
            { label: 'retreat cost', content: (
              <div style={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: retreat }).map((_, j) => <Colorless key={j} size={13} />)}
              </div>
            )},
          ].map((col, i) => (
            <div key={i} style={{ flex: 1, padding: '4px 7px', borderRight: i < 2 ? `1px solid ${tcD}33` : undefined }}>
              <div style={{ fontFamily: body, fontSize: 6.5, color: '#777', marginBottom: 3, textTransform: 'lowercase', letterSpacing: '0.05em' }}>{col.label}</div>
              {col.content}
            </div>
          ))}
        </div>

        {/* ── POKÉDEX ENTRY ─────────────────────────────────────────────────── */}
        <div style={{
          background: lighten(tc, 0.84),
          border: `1px solid ${tcD}44`,
          borderRadius: 3, padding: '5px 9px', flexShrink: 0,
        }}>
          <span style={{ fontFamily: body, fontSize: 9.5, fontStyle: 'italic', color: '#2a2a2a', lineHeight: 1.5, display: 'block' }}>
            {data.pokedexEntry}
          </span>
        </div>

        {/* ── FOOTER ────────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexShrink: 0, paddingTop: 1 }}>
          {['Illus. Prof. Oak', '©2024 Nintendo / HOE-KEMON', '69/069 ★'].map((t, i) => (
            <span key={i} style={{ fontFamily: body, fontSize: 7, color: '#999' }}>{t}</span>
          ))}
        </div>

      </div>
    </div>
  )

  if (forCapture) return card

  return (
    <div style={{ transform: 'scale(var(--card-scale,1))', transformOrigin: 'top center' }}>
      <style>{`
        :root{--card-scale:1}
        @media(max-width:520px){:root{--card-scale:.72}}
        @media(max-width:380px){:root{--card-scale:.62}}
      `}</style>
      {card}
    </div>
  )
}
