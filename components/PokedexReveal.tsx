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

  // Map type to drag-species label — like "FLAME POKéMON" in the real game
  const SPECIES: Record<string, string> = {
    Normal: 'VERSATILE', Fire: 'PAGEANT', Water: 'CLUB KID',
    Grass: 'ARTSY', Electric: 'COMEDY', Ice: 'ICE QUEEN',
    Fighting: 'WERK ROOM', Poison: 'DRAMA', Ground: 'EARTHY REALNESS',
    Flying: 'FASHION', Psychic: 'MYSTIQUE', Bug: 'GLOW-UP',
    Rock: 'VETERAN', Ghost: 'CAMP', Dragon: 'ICONIC',
  }
  const species = SPECIES[data.type1] ?? data.type1.toUpperCase()

  const beatText = useMemo(() => {
    switch (beat) {
      // ── Beat 1: exact Gen 1 Pokédex registration screen ──────────────────
      case 1:
        return `No.069\n${data.name.toUpperCase()}\n\n${species} POKéMON\n\nHT  ${data.height}\nWT  ${data.weight}\n\nLv.${data.level}`

      // ── Beat 2: origin lore — no header, just scrolling text like the real game ──
      case 2:
        return data.backstory

      // ── Beat 3: Pokédex entry — clean, dry, clinical. Exactly Gen 1 style ─
      case 3:
        return data.pokedexEntry

      default:
        return ''
    }
  }, [beat, data, species])

  const beatTextRef = useRef(beatText)
  beatTextRef.current = beatText

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

  return (
    <div
      className="screen"
      style={{
        background: '#F0EFE7',
        cursor: 'pointer',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {/* ─── HOE-KDEX LABEL ─── */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 8,
        color: '#000',
        letterSpacing: 2,
      }}>
        HOE-KDEX
      </div>

      {/* ─── TWO-COLUMN DISPLAY ─── */}
      <div style={{
        display: 'flex',
        gap: 12,
        width: '92vw',
        maxWidth: 540,
        alignItems: 'stretch',
      }}>
        {/* ─── LEFT: Sprite screen ─── */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'center',
        }}>
          <div style={{
            background: '#9BBC0F',
            border: '4px solid #000',
            width: 148,
            height: 148,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Scanlines */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
              pointerEvents: 'none',
            }} />
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
                  position: 'relative',
                }}
              />
            ) : (
              <div style={{
                width: '60%',
                height: '60%',
                background: type1Colour,
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                opacity: 0.6,
                animation: 'silhouette-pulse 1.5s ease-in-out infinite',
                position: 'relative',
              }} />
            )}
          </div>

          {/* Beat indicator */}
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 6,
            color: '#000',
            border: '2px solid #000',
            padding: '3px 8px',
            background: '#F0EFE7',
          }}>
            {beat}/3
          </div>
        </div>

        {/* ─── RIGHT: Text screen ─── */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Name header */}
          <div style={{
            background: '#000',
            padding: '4px 10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 6,
              color: '#F0EFE7',
            }}>
              {data.name.toUpperCase()}
            </span>
          </div>

          {/* GB green text area */}
          <div style={{
            flex: 1,
            background: '#9BBC0F',
            border: '3px solid #000',
            borderTop: 'none',
            padding: '12px 14px',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 148,
          }}>
            {/* Scanlines */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
              pointerEvents: 'none',
            }} />
            <div style={{
              fontFamily: "'VT323', monospace",
              fontSize: 20,
              color: '#0F380F',
              lineHeight: 1.55,
              whiteSpace: 'pre-wrap',
              position: 'relative',
            }}>
              {displayed}
              {typing && (
                <span style={{ animation: 'blink 0.5s step-end infinite' }}>█</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Tap hint ─── */}
      <p style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 7,
        color: '#000',
        animation: typing ? 'none' : 'blink 0.8s step-end infinite',
        opacity: typing ? 0.3 : 1,
      }}>
        {typing ? '...' : '▼ TAP TO CONTINUE'}
      </p>
    </div>
  )
}
