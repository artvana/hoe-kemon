'use client'

import { useState } from 'react'
import { HoekemonData } from '@/lib/types'
import { TYPE_COLOURS, TYPE_TEXT_COLOURS } from '@/lib/typeColours'

interface HoekemonCardProps {
  data: HoekemonData
  spriteUrl: string | null
  forCapture?: boolean
}

// Map Gen 1 types to available template files
const TYPE_TEMPLATE: Record<string, string> = {
  Normal:   'neutral',
  Fire:     'fire',
  Water:    'water',
  Grass:    'grass',
  Electric: 'electric',
  Ice:      'neutral',
  Fighting: 'fighting',
  Poison:   'psychic',
  Ground:   'fighting',
  Flying:   'neutral',
  Psychic:  'psychic',
  Bug:      'grass',
  Rock:     'neutral',
  Ghost:    'psychic',
  Dragon:   'water',
}

function lighten(hex: string, t = 0.5) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.min(255,r+Math.round((255-r)*t))},${Math.min(255,g+Math.round((255-g)*t))},${Math.min(255,b+Math.round((255-b)*t))})`
}

function Energy({ type, size = 16 }: { type: string; size?: number }) {
  const bg = TYPE_COLOURS[type] ?? '#A8A878'
  const fg = TYPE_TEXT_COLOURS[type] ?? '#000'
  const l = lighten(bg, 0.45)
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `radial-gradient(circle at 38% 35%, ${l}, ${bg} 70%)`,
      border: '1.5px solid rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
    }}>
      <span style={{ fontSize: size * 0.36, fontWeight: 'bold', color: fg, fontFamily: 'Arial, sans-serif', lineHeight: 1 }}>
        {type[0]}
      </span>
    </div>
  )
}

function Colorless({ size = 13 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'radial-gradient(circle at 38% 35%, #fff, #ccc 65%, #999)',
      border: '1.5px solid rgba(0,0,0,0.35)',
    }} />
  )
}

// Waiting-state placeholder: mystery silhouette on dark background
function SpritePlaceholder({ typeColour }: { typeColour: string }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(160deg,#1a1208 0%,#090604 60%,#141008 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>
      {/* Silhouette blob */}
      <div style={{
        width: 72, height: 80,
        background: typeColour,
        opacity: 0.3,
        borderRadius: '40% 40% 35% 35% / 50% 50% 45% 45%',
        filter: 'blur(6px)',
        animation: 'silhouette-pulse 2s ease-in-out infinite',
      }} />
      <span style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 6, color: typeColour, opacity: 0.5, letterSpacing: 2,
        animation: 'blink 1.4s step-end infinite',
      }}>???</span>
    </div>
  )
}

export default function HoekemonCard({ data, spriteUrl, forCapture = false }: HoekemonCardProps) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, o: 0 })

  const hp = (data.hp % 10 !== 9) ? 69 : data.hp
  const retreat = Math.max(1, Math.min(4, Math.round(data.stats.nerve / 30)))
  const template = TYPE_TEMPLATE[data.type1] ?? 'neutral'
  const typeColour = TYPE_COLOURS[data.type1] ?? '#A8A878'

  const VT = `'VT323', monospace`
  const PS2 = `'Press Start 2P', monospace`
  const BOLD = `'Nunito', 'Arial Black', sans-serif`

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (forCapture) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setTilt({ rx: -(y - 50) / 6, ry: (x - 50) / 6, mx: x, my: y, o: 0.5 })
  }

  function handleMouseLeave() {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50, o: 0 })
  }

  function energyCost(power: number) {
    return Math.max(1, Math.min(3, Math.round(power / 35)))
  }

  // Card is sized to match the template PNG (474×659) scaled ×1.055 → 500×695
  // All absolute positions derived from visual inspection of template at native size × 1.055
  const card = (
    <div
      onMouseMove={forCapture ? undefined : handleMouseMove}
      onMouseLeave={forCapture ? undefined : handleMouseLeave}
      style={{
        width: 500,
        height: 695,
        borderRadius: 14,
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `url('/card-templates/${template}.png')`,
        backgroundSize: '100% 100%',
        boxShadow: forCapture ? 'none' : '0 10px 40px rgba(0,0,0,0.4)',
        transform: forCapture ? 'none' : `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: forCapture ? 'none' : 'transform 0.12s ease-out',
        cursor: forCapture ? 'default' : 'pointer',
        userSelect: 'none',
      }}
    >

      {/* ── HEADER — name + HP (type symbol already on template) ── */}
      <div style={{
        position: 'absolute', top: 10, left: 18, right: 44,
        display: 'flex', alignItems: 'flex-end', gap: 6,
      }}>
        {/* Stage label */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1, minWidth: 0 }}>
          <span style={{
            fontFamily: PS2, fontSize: 5.5,
            color: 'rgba(0,0,0,0.55)', fontStyle: 'italic', lineHeight: 1,
          }}>
            Basic HOE-KÉMON
          </span>
          <span style={{
            fontFamily: BOLD,
            fontSize: 24,
            fontWeight: 800,
            fontStyle: 'italic',
            color: '#111',
            lineHeight: 1.05,
            letterSpacing: '-0.3px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {data.name}
          </span>
        </div>

        {/* HP */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
          <span style={{ fontFamily: BOLD, fontSize: 22, fontWeight: 800, color: '#C00', lineHeight: 1 }}>{hp}</span>
          <span style={{ fontFamily: PS2, fontSize: 5.5, color: '#C00', marginBottom: 3 }}>HP</span>
        </div>
      </div>

      {/* ── ILLUSTRATION BOX — overlaid on the white rectangle in template ── */}
      {/* Template white rectangle: ~x=28-446, y=56-333 at native 474×659 → scaled: x=30-470, y=59-351 */}
      <div style={{
        position: 'absolute',
        top: 59, left: 30, right: 30,
        height: 292,
        overflow: 'hidden',
        borderRadius: 2,
      }}>
        {spriteUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/sprite/image?url=${encodeURIComponent(spriteUrl)}`}
            alt={data.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'contain',
              padding: '6px',
              boxSizing: 'border-box',
            }}
          />
        ) : (
          <SpritePlaceholder typeColour={typeColour} />
        )}

        {/* Level — bottom-left of illustration */}
        <div style={{
          position: 'absolute', bottom: 6, left: 8,
          fontFamily: PS2, fontSize: 5, color: 'rgba(255,255,255,0.7)',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
        }}>
          Lv.{data.level}
        </div>
      </div>

      {/* ── SPECIES BAR — gold bar below illustration ── */}
      {/* Gold bar at native y=333-352 → scaled y=351-371 */}
      <div style={{
        position: 'absolute',
        top: 353, left: 30, right: 30,
        height: 19,
        display: 'flex', alignItems: 'center',
      }}>
        <span style={{
          fontFamily: VT, fontSize: 13, fontStyle: 'italic',
          color: '#3a2800',
          whiteSpace: 'nowrap', overflow: 'hidden',
        }}>
          {data.type1} HOE-KÉMON&nbsp;&nbsp;HT: {data.height}&nbsp;&nbsp;WT: {data.weight}
        </span>
      </div>

      {/* ── ATTACKS ── */}
      {/* Content area starts at native y=352 → scaled y=372 */}
      <div style={{ position: 'absolute', top: 376, left: 26, right: 26 }}>
        {data.attacks.slice(0, 2).map((atk, i) => (
          <div key={i}>
            {i > 0 && (
              <div style={{ height: 1, background: 'rgba(0,0,0,0.15)', margin: '4px 0' }} />
            )}
            <div style={{ display: 'flex', alignItems: 'center', padding: '5px 2px', gap: 7 }}>
              <div style={{ display: 'flex', gap: 3, flexShrink: 0, minWidth: 48 }}>
                {Array.from({ length: energyCost(atk.power) }).map((_, j) => (
                  <Energy key={j} type={atk.type} size={16} />
                ))}
              </div>
              <span style={{
                fontFamily: VT, fontSize: 18, fontWeight: 'bold',
                color: '#111', flex: 1, lineHeight: 1,
              }}>
                {atk.name}
                {atk.superEffective && (
                  <span style={{ fontFamily: PS2, fontSize: 5, color: '#C00', marginLeft: 5, verticalAlign: 'middle' }}>✦</span>
                )}
              </span>
              <span style={{ fontFamily: BOLD, fontSize: 20, fontWeight: 800, color: '#111', flexShrink: 0, lineHeight: 1 }}>
                {atk.power}
              </span>
            </div>
          </div>
        ))}

        {/* Pokédex entry — between attacks and weakness line */}
        <div style={{
          marginTop: 8,
          padding: '5px 4px',
          borderTop: '1px solid rgba(0,0,0,0.1)',
        }}>
          <span style={{
            fontFamily: VT, fontSize: 13, fontStyle: 'italic',
            color: '#2a2a2a', lineHeight: 1.4, display: 'block',
          }}>
            {data.pokedexEntry}
          </span>
        </div>
      </div>

      {/* ── WEAKNESS / RESISTANCE / RETREAT values ── */}
      {/* Labels pre-printed on template at native y≈548 → scaled y≈578 */}
      {/* Values go just below those labels */}
      <div style={{
        position: 'absolute',
        top: 596, left: 26, right: 26,
        display: 'flex',
      }}>
        {/* Weakness */}
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: VT, fontSize: 13, color: '#111' }}>{data.weakness}</span>
        </div>
        {/* Resistance */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ fontFamily: VT, fontSize: 16, color: '#111' }}>—</span>
        </div>
        {/* Retreat cost */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 3, alignItems: 'center' }}>
          {Array.from({ length: retreat }).map((_, j) => <Colorless key={j} size={13} />)}
        </div>
      </div>

      {/* ── WHITE BOX AT BOTTOM (pokédex entry / illus / card no.) ── */}
      {/* Bottom white rectangle at native y≈579-638 → scaled y≈611-673 */}
      <div style={{
        position: 'absolute',
        top: 620, left: 30, right: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: VT, fontSize: 10, color: 'rgba(0,0,0,0.4)' }}>Illus. Prof. Oak</span>
        <span style={{ fontFamily: VT, fontSize: 10, color: 'rgba(0,0,0,0.35)' }}>LV.{data.level} #069</span>
        <span style={{ fontFamily: VT, fontSize: 10, color: 'rgba(0,0,0,0.4)' }}>69/069 ✦</span>
      </div>

      {/* ── Holographic shimmer ── */}
      {!forCapture && tilt.o > 0 && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 14, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.2) 0%, transparent 55%),
            linear-gradient(${105 + tilt.ry * 2}deg, transparent 25%, rgba(150,200,255,0.1) 40%, rgba(255,150,220,0.1) 55%, transparent 75%)
          `,
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
