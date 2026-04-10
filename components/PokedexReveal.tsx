'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { HoekemonData } from '@/lib/types'
import { TYPE_COLOURS } from '@/lib/typeColours'

interface PokedexRevealProps {
  data: HoekemonData
  spriteUrl: string | null
  initialBeat?: number
  onComplete: () => void
  onBeatAdvance?: (beat: number) => void
}

// Gen 1 species labels — the right-column "LIZARD POKéMON" equivalent
const SPECIES: Record<string, string> = {
  Normal: 'VERSATILE', Fire: 'PAGEANT', Water: 'CLUB KID',
  Grass: 'ARTSY', Electric: 'COMEDY', Ice: 'ICE QUEEN',
  Fighting: 'WERK ROOM', Poison: 'DRAMA', Ground: 'EARTHY REALNESS',
  Flying: 'FASHION', Psychic: 'MYSTIQUE', Bug: 'GLOW-UP',
  Rock: 'VETERAN', Ghost: 'CAMP', Dragon: 'ICONIC',
}

export default function PokedexReveal({
  data,
  spriteUrl,
  initialBeat = 1,
  onComplete,
  onBeatAdvance,
}: PokedexRevealProps) {
  const [beat, setBeat] = useState(initialBeat)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(false)

  const beatRef = useRef(beat)
  beatRef.current = beat
  const typingRef = useRef(false)
  typingRef.current = typing
  const intervalRef = useRef<ReturnType<typeof setInterval>>()
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const onBeatAdvanceRef = useRef(onBeatAdvance)
  onBeatAdvanceRef.current = onBeatAdvance

  const species = SPECIES[data.type1] ?? data.type1.toUpperCase()

  // What types in the scrolling description area for each beat
  const beatText = useMemo(() => {
    switch (beat) {
      case 1: return data.pokedexEntry
      case 2: return data.backstory
      case 3: return `Lv.${data.level}  HP ${data.hp}\n\n${data.catchPhrase}`
      default: return ''
    }
  }, [beat, data])

  const beatTextRef = useRef(beatText)
  beatTextRef.current = beatText

  // Type out the beat text
  useEffect(() => {
    clearInterval(intervalRef.current)
    let i = 0
    setDisplayed('')
    setTyping(true)
    intervalRef.current = setInterval(() => {
      i++
      setDisplayed(beatText.slice(0, i))
      if (i >= beatText.length) {
        clearInterval(intervalRef.current)
        setTyping(false)
      }
    }, 22)
    return () => clearInterval(intervalRef.current)
  }, [beatText])

  // Click to skip typing / advance beats
  useEffect(() => {
    function onClick() {
      if (typingRef.current) {
        clearInterval(intervalRef.current)
        setDisplayed(beatTextRef.current)
        setTyping(false)
        return
      }
      const next = beatRef.current + 1
      if (next > 3) {
        onCompleteRef.current()
      } else {
        onBeatAdvanceRef.current?.(next)
        setBeat(next)
      }
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  const type1Colour = TYPE_COLOURS[data.type1] ?? '#A8A878'

  // Scanline overlay — reused in both panels
  const Scanlines = () => (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
    }} />
  )

  return (
    // Full-screen cream background — layout fills from top
    <div
      className="screen"
      style={{
        background: '#F0EFE7',
        cursor: 'pointer',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        padding: 0,
        gap: 0,
        overflow: 'hidden',
      }}
    >
      {/* ── HOE-KDEX header bar ── */}
      <div style={{
        background: '#0F380F',
        padding: '6px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'max(7px, 1.8vw)', color: '#9BBC0F', letterSpacing: 2,
        }}>HOE-KDEX</span>
        <span style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'max(6px, 1.5vw)', color: '#9BBC0F',
        }}>{beat}/3</span>
      </div>

      {/* ── Main data panel — left: sprite+No., right: stats ── */}
      {/* Exactly matches frame_106 layout: 42% left / 58% right */}
      <div style={{
        display: 'flex',
        borderBottom: '4px solid #0F380F',
        background: '#9BBC0F',
        flexShrink: 0,
      }}>

        {/* LEFT: sprite + No. */}
        <div style={{
          width: '42%',
          flexShrink: 0,
          borderRight: '4px solid #0F380F',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 6px 6px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Scanlines />
          {/* Sprite box */}
          <div style={{
            width: '100%',
            aspectRatio: '1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            {spriteUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={spriteUrl}
                alt={data.name}
                style={{
                  width: '88%', height: '88%',
                  objectFit: 'contain',
                  imageRendering: 'pixelated',
                  position: 'relative',
                }}
              />
            ) : (
              <div style={{
                width: '55%', height: '55%',
                background: type1Colour,
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                opacity: 0.7,
                animation: 'silhouette-pulse 1.5s ease-in-out infinite',
              }} />
            )}
          </div>

          {/* No. label — bottom-left exactly like frame_106 */}
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'max(5px, 1.5vw)',
            color: '#0F380F',
            alignSelf: 'flex-start',
            marginTop: 4,
            position: 'relative',
          }}>No.069</div>
        </div>

        {/* RIGHT: name, species, HT, WT */}
        <div style={{
          flex: 1,
          padding: '10px 12px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          background: '#9BBC0F',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Scanlines />
          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: 'max(20px, 5vw)',
            color: '#0F380F',
            fontWeight: 'bold',
            lineHeight: 1.1,
            position: 'relative',
          }}>{data.name.toUpperCase()}</div>

          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: 'max(16px, 4vw)',
            color: '#0F380F',
            position: 'relative',
          }}>{species}</div>

          <div style={{ height: 6 }} />

          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: 'max(16px, 4vw)',
            color: '#0F380F',
            display: 'flex', gap: 6,
            position: 'relative',
          }}>
            <span>HT</span>
            <span style={{ fontWeight: 'bold' }}>{data.height}</span>
          </div>

          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: 'max(16px, 4vw)',
            color: '#0F380F',
            display: 'flex', gap: 6,
            position: 'relative',
          }}>
            <span>WT</span>
            <span style={{ fontWeight: 'bold' }}>{data.weight}</span>
          </div>
        </div>
      </div>

      {/* ── Decorative divider — small squares pattern matching frame_106 ── */}
      <div style={{
        background: '#9BBC0F',
        borderBottom: '4px solid #0F380F',
        padding: '3px 8px',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'max(5px, 1.3vw)',
          color: '#0F380F',
          letterSpacing: 2,
          whiteSpace: 'nowrap',
        }}>
          {'■□'.repeat(30)}
        </div>
      </div>

      {/* ── Scrolling description area — typing animation ── */}
      <div style={{
        flex: 1,
        background: '#9BBC0F',
        padding: '10px 14px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 80,
      }}>
        <Scanlines />
        <div style={{
          fontFamily: "'VT323', monospace",
          fontSize: 'max(18px, 4.5vw)',
          color: '#0F380F',
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          position: 'relative',
        }}>
          {displayed}
          {typing && (
            <span style={{ animation: 'blink 0.5s step-end infinite' }}>█</span>
          )}
        </div>
      </div>

      {/* ── Footer: tap hint ── */}
      <div style={{
        background: '#0F380F',
        padding: '5px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'max(5px, 1.3vw)',
          color: '#9BBC0F',
          animation: typing ? 'none' : 'blink 0.8s step-end infinite',
          opacity: typing ? 0.4 : 1,
        }}>
          {typing ? '...' : '▼ TAP TO CONTINUE'}
        </span>
      </div>
    </div>
  )
}
