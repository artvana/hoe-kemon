'use client'

import { useState } from 'react'
import { HoekemonData } from '@/lib/types'
import { TYPE_COLOURS, TYPE_TEXT_COLOURS } from '@/lib/typeColours'

interface HoekemonCardProps {
  data: HoekemonData
  spriteUrl: string | null
  forCapture?: boolean
}

function lighten(hex: string, t = 0.5) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.min(255, r + Math.round((255 - r) * t))},${Math.min(255, g + Math.round((255 - g) * t))},${Math.min(255, b + Math.round((255 - b) * t))})`
}

function Energy({ type, size = 18 }: { type: string; size?: number }) {
  const bg = TYPE_COLOURS[type] ?? '#A8A878'
  const fg = TYPE_TEXT_COLOURS[type] ?? '#000'
  const l = lighten(bg, 0.45)
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `radial-gradient(circle at 38% 35%, ${l}, ${bg} 70%)`,
      border: '1.5px solid rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontSize: size * 0.36, fontWeight: 'bold', color: fg, fontFamily: 'Arial, sans-serif', lineHeight: 1 }}>
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
      border: '1.5px solid rgba(0,0,0,0.4)',
    }} />
  )
}

export default function HoekemonCard({ data, spriteUrl, forCapture = false }: HoekemonCardProps) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, o: 0 })

  // Enforce the bit
  const hp = (data.hp % 10 !== 9) ? 69 : data.hp
  const retreat = Math.max(1, Math.min(4, Math.round(data.stats.nerve / 30)))

  const VT = `'VT323', monospace`
  const PS2 = `'Press Start 2P', monospace`

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (forCapture) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setTilt({ rx: -(y - 50) / 5, ry: (x - 50) / 5, mx: x, my: y, o: 0.45 })
  }

  function handleMouseLeave() {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50, o: 0 })
  }

  function energyCost(power: number) {
    return Math.max(1, Math.min(3, Math.round(power / 35)))
  }

  const card = (
    <div
      onMouseMove={forCapture ? undefined : handleMouseMove}
      onMouseLeave={forCapture ? undefined : handleMouseLeave}
      style={{
        width: 500,
        height: 700,
        borderRadius: 12,
        background: '#2D5A1B',   // outer green border
        padding: 8,
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        transform: forCapture ? 'none' : `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: forCapture ? 'none' : 'transform 0.12s ease-out',
        cursor: forCapture ? 'default' : 'pointer',
      }}
    >
      {/* ── Cream gap layer ── */}
      <div style={{ width: '100%', height: '100%', background: '#F5E6C8', padding: 3, boxSizing: 'border-box' }}>

        {/* ── Inner green border ── */}
        <div style={{
          width: '100%', height: '100%',
          border: '2px solid #2D5A1B',
          background: '#F5E6C8',
          padding: '6px 8px',
          boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column',
          gap: 5,
          overflow: 'hidden',
        }}>

          {/* ── HEADER: stage · name · HP · type ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {/* Stage badge — silver octagon */}
            <div style={{
              clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
              background: 'linear-gradient(180deg, #e0e0e0 0%, #c8c8c8 50%, #b0b0b0 100%)',
              padding: '4px 9px',
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: PS2, fontSize: 6, color: '#3a3a3a', fontStyle: 'italic', letterSpacing: '-0.3px' }}>BASIC</span>
            </div>

            {/* Name */}
            <span style={{
              fontFamily: PS2, fontSize: 12, color: '#111',
              flex: 1, lineHeight: 1.1, letterSpacing: '-0.5px',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {data.name}
            </span>

            {/* HP number + label */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, flexShrink: 0 }}>
              <span style={{ fontFamily: PS2, fontSize: 20, color: '#CC0000', lineHeight: 1 }}>{hp}</span>
              <span style={{ fontFamily: PS2, fontSize: 6, color: '#CC0000', marginBottom: 2, letterSpacing: '0.05em' }}>HP</span>
            </div>

            {/* Type circle */}
            <Energy type={data.type1} size={22} />
          </div>

          {/* ── ILLUSTRATION ── */}
          {/* green border → gold accent (inset shadow) → cream gap → image */}
          <div style={{
            flexShrink: 0,
            border: '2px solid #2D5A1B',
            boxShadow: 'inset 0 0 0 2px #C8A850',
            padding: 3,
            background: '#F5E6C8',
            boxSizing: 'border-box',
          }}>
            <div style={{
              height: 258,
              background: '#EDE5CF',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {spriteUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/sprite/image?url=${encodeURIComponent(spriteUrl)}`}
                  alt={data.name}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, #ddd6b0 25%, #ece4c0 50%, #ddd6b0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }} />
              )}
            </div>
          </div>

          {/* ── SPECIES / DIMENSIONS STRIP ── */}
          <div style={{
            flexShrink: 0,
            borderTop: '1px solid #2D5A1B',
            borderBottom: '1px solid #2D5A1B',
            padding: '3px 5px',
          }}>
            <span style={{ fontFamily: VT, fontSize: 13, color: '#2a2a2a', fontStyle: 'italic' }}>
              {data.type1} Pokémon&nbsp;&nbsp;Ht: {data.height}&nbsp;&nbsp;Wt: {data.weight}
            </span>
          </div>

          {/* ── ATTACKS ── */}
          <div style={{ flexShrink: 0 }}>
            {data.attacks.slice(0, 2).map((atk, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '6px 4px', gap: 8 }}>
                  {/* Energy cost */}
                  <div style={{ display: 'flex', gap: 3, flexShrink: 0, width: 58 }}>
                    {Array.from({ length: energyCost(atk.power) }).map((_, j) => (
                      <Energy key={j} type={atk.type} size={17} />
                    ))}
                  </div>
                  {/* Attack name */}
                  <span style={{ fontFamily: VT, fontSize: 17, fontWeight: 'bold', color: '#111', flex: 1, lineHeight: 1 }}>
                    {atk.name}
                  </span>
                  {/* Damage */}
                  <span style={{ fontFamily: VT, fontSize: 21, fontWeight: 'bold', color: '#111', minWidth: 36, textAlign: 'right', lineHeight: 1 }}>
                    {atk.power}
                  </span>
                </div>
                {i < data.attacks.slice(0, 2).length - 1 && (
                  <div style={{ height: 1, background: '#2D5A1B', opacity: 0.25, margin: '0 4px' }} />
                )}
              </div>
            ))}
          </div>

          {/* ── WEAKNESS / RESISTANCE / RETREAT COST ── */}
          <div style={{ display: 'flex', flexShrink: 0, borderTop: '1px solid #2D5A1B' }}>
            {/* Weakness */}
            <div style={{ flex: 1, padding: '4px 6px', borderRight: '1px solid #2D5A1B', minWidth: 0 }}>
              <div style={{ fontFamily: VT, fontSize: 11, color: '#666', marginBottom: 2 }}>weakness</div>
              <span style={{ fontFamily: VT, fontSize: 12, color: '#111', lineHeight: 1.2, display: 'block', wordBreak: 'break-word' }}>
                {data.weakness}
              </span>
            </div>
            {/* Resistance */}
            <div style={{ flex: 1, padding: '4px 6px', borderRight: '1px solid #2D5A1B' }}>
              <div style={{ fontFamily: VT, fontSize: 11, color: '#666', marginBottom: 2 }}>resistance</div>
              <span style={{ fontFamily: VT, fontSize: 16, color: '#111' }}>—</span>
            </div>
            {/* Retreat cost */}
            <div style={{ flex: 1, padding: '4px 6px' }}>
              <div style={{ fontFamily: VT, fontSize: 11, color: '#666', marginBottom: 2 }}>retreat cost</div>
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {Array.from({ length: retreat }).map((_, j) => <Colorless key={j} size={14} />)}
              </div>
            </div>
          </div>

          {/* ── POKÉDEX ENTRY ── */}
          <div style={{ background: '#EDD9A3', padding: '7px 9px', flex: 1, minHeight: 55 }}>
            <span style={{ fontFamily: VT, fontSize: 14, fontStyle: 'italic', color: '#2a2a2a', lineHeight: 1.45, display: 'block' }}>
              {data.pokedexEntry}
            </span>
          </div>

          {/* ── FOOTER ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: VT, fontSize: 10, color: '#888' }}>69/069 ●</span>
            <span style={{ fontFamily: VT, fontSize: 10, color: '#888' }}>Illus. Prof. Oak</span>
            <span style={{ fontFamily: VT, fontSize: 10, color: '#888' }}>©2024 HOE-KEMON</span>
          </div>

        </div>
      </div>

      {/* ── Holographic shimmer overlay — skipped during capture ── */}
      {!forCapture && tilt.o > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: 12,
          background: `radial-gradient(ellipse at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.18) 0%, transparent 60%), linear-gradient(${105 + tilt.ry * 2}deg, transparent 25%, rgba(150,200,255,0.12) 40%, rgba(255,150,220,0.12) 55%, transparent 75%)`,
          pointerEvents: 'none',
        }} />
      )}
    </div>
  )

  if (forCapture) return card

  return (
    <div style={{ transform: 'scale(var(--card-scale,1))', transformOrigin: 'top center' }}>
      <style>{`
        :root { --card-scale: 1 }
        @media (max-width: 520px) { :root { --card-scale: .72 } }
        @media (max-width: 380px) { :root { --card-scale: .62 } }
      `}</style>
      {card}
    </div>
  )
}
