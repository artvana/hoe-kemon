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

// Waiting-state placeholder: mystery silhouette on the type-gradient background
function SpritePlaceholder({ typeColour }: { typeColour: string }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'transparent',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 10,
    }}>
      {/* Body silhouette */}
      <div style={{
        width: 90, height: 110,
        background: typeColour,
        opacity: 0.35,
        borderRadius: '40% 40% 35% 35% / 50% 50% 45% 45%',
        filter: 'blur(8px)',
        animation: 'silhouette-pulse 2s ease-in-out infinite',
      }} />
      <span style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 6,
        color: typeColour,
        opacity: 0.6,
        letterSpacing: 3,
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
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

  const PS2 = `'Press Start 2P', monospace`
  const BOLD = `'Nunito', 'Arial Black', sans-serif`   // 800 italic — name, HP, power
  const CARD = `'Nunito', sans-serif`                  // 700 — attack names
  const BODY = `'Nunito', sans-serif`                  // 400 — pokédex, values, footer
  const VT = `'VT323', monospace`                      // retro — species bar only

  const height = data.height.length > 14 ? data.height.slice(0, 13) + '…' : data.height
  const speciesText = `${data.type1} HOE-KÉMON  HT: ${height}  WT: ${data.weight}`
  const speciesFontSize = speciesText.length > 80 ? 6.5 : speciesText.length > 65 ? 7.5 : speciesText.length > 50 ? 8.5 : 10
  const weaknessFontSize = data.weakness.length > 30 ? 8.5 : data.weakness.length > 22 ? 9.5 : 11
  const pokedexFontSize = data.pokedexEntry.length > 200 ? 9 : data.pokedexEntry.length > 150 ? 10 : 11.5

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

      {/* ── HEADER — name + HP. Orange frame runs display y=25–89, header sits in it ── */}
      <div style={{
        position: 'absolute', top: 36, left: 61, right: 88,
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

      {/* ── ILLUSTRATION BOX — pixel-measured from fire template ── */}
      {/* native x=58–417 → display x=61–440. native y=84–338 → display y=89–357. */}
      <div style={{
        position: 'absolute',
        top: 89, left: 61, right: 60,
        height: 268,
        overflow: 'hidden',
        borderRadius: 3,
        background: `radial-gradient(ellipse at 50% 55%, ${lighten(typeColour, 0.88)} 0%, ${lighten(typeColour, 0.65)} 50%, ${lighten(typeColour, 0.38)} 100%)`,
        boxShadow: 'inset 0 0 0 2.5px rgba(0,0,0,0.45)',
      }}>
        {spriteUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/sprite/image?url=${encodeURIComponent(spriteUrl)}`}
            alt={data.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'contain',
              mixBlendMode: 'multiply',
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

      {/* ── SPECIES BAR — gold info strip: native y=353–373 → display y=372–393 ── */}
      <div style={{
        position: 'absolute',
        top: 374, left: 61, right: 60,
        height: 19,
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: VT, fontSize: speciesFontSize, fontStyle: 'italic',
          color: '#3a2800',
          whiteSpace: 'nowrap',
          display: 'inline-block',
          transform: 'scaleX(0.82)',
          transformOrigin: 'center center',
        }}>
          {data.type1} HOE-KÉMON&nbsp;&nbsp;HT: {height}&nbsp;&nbsp;WT: {data.weight}
        </span>
      </div>

      {/* ── ATTACKS ── */}
      {/* Content area starts after gold strip ~y=386 */}
      <div style={{ position: 'absolute', top: 396, left: 61, right: 60 }}>
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
                fontFamily: CARD, fontSize: 16, fontWeight: 700,
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
          maxHeight: 108,
          overflow: 'hidden',
        }}>
          <span style={{
            fontFamily: BODY, fontSize: pokedexFontSize, fontStyle: 'italic', fontWeight: 400,
            color: '#2a2a2a', lineHeight: 1.45, display: 'block',
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
        top: 590, left: 61, right: 60,
        display: 'flex', alignItems: 'center',
        height: 20,
      }}>
        {/* Weakness */}
        <div style={{ flex: 2, overflow: 'hidden' }}>
          <span style={{
            fontFamily: BODY, fontSize: weaknessFontSize, fontWeight: 400, color: '#111',
            whiteSpace: 'nowrap',
          }}>{data.weakness}</span>
        </div>
        {/* Resistance */}
        <div style={{ flex: 0.8, textAlign: 'center' }}>
          <span style={{ fontFamily: BODY, fontSize: 11, fontWeight: 400, color: '#111' }}>—</span>
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
        top: 624, left: 61, right: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: BODY, fontSize: 8.5, fontWeight: 400, color: 'rgba(0,0,0,0.4)' }}>Illus. Prof. Oak</span>
        <span style={{ fontFamily: BODY, fontSize: 8.5, fontWeight: 400, color: 'rgba(0,0,0,0.35)' }}>LV.{data.level} #069</span>
        <span style={{ fontFamily: BODY, fontSize: 8.5, fontWeight: 400, color: 'rgba(0,0,0,0.4)' }}>69/069 ✦</span>
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
