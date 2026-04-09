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

  const beatText = useMemo(() => {
    switch (beat) {
      case 1:
        return `HOE-KDEX — No.069\n\n${data.name.toUpperCase()}\n${data.type1.toUpperCase()} TYPE Pokémon\n\nHT: ${data.height}\nWT: none of ur business`
      case 2:
        return `━━━━━━━━━━━━━━━━\n  SPECIES ORIGIN\n━━━━━━━━━━━━━━━━\n\n${data.backstory}`
      case 3:
        return `━━━━━━━━━━━━━━━━\n  FIELD NOTES\n━━━━━━━━━━━━━━━━\n\n${data.pokedexEntry}`
      default:
        return ''
    }
  }, [beat, data])

  const beatTextRef = useRef(beatText)
  beatTextRef.current = beatText

  // Start typing when beat/text changes
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

  // Click handler
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
      style={{ background: '#0a0a0a', cursor: 'pointer' }}
    >
      <div
        className="pokedex-screen"
        style={{
          display: 'flex',
          width: '90vw',
          maxWidth: 680,
          height: '70vh',
          maxHeight: 480,
          border: '6px solid #8B0000',
          borderRadius: 8,
        }}
      >
        {/* Left panel — sprite display */}
        <div
          style={{
            width: '40%',
            background: 'var(--gb-red)',
            borderRight: '4px solid #8B0000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 16,
            gap: 12,
          }}
        >
          {/* Camera circle */}
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: '#111',
              border: '3px solid #333',
              alignSelf: 'flex-start',
            }}
          />
          {/* Sprite screen */}
          <div
            style={{
              background: 'var(--gb-screen-dark)',
              border: '4px solid #000',
              width: '100%',
              aspectRatio: '1 / 1',
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
                  width: '80%',
                  height: '80%',
                  objectFit: 'contain',
                  imageRendering: 'pixelated',
                }}
              />
            ) : (
              <div
                style={{
                  width: '70%',
                  height: '70%',
                  background: type1Colour,
                  clipPath:
                    'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                  opacity: 0.5,
                  animation: 'silhouette-pulse 1.5s ease-in-out infinite',
                }}
              />
            )}
          </div>
          {/* Lights */}
          <div style={{ display: 'flex', gap: 6, alignSelf: 'flex-start' }}>
            {['#CC0000', '#F0A000', '#00A000'].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
          </div>
        </div>

        {/* Right panel — text display */}
        <div
          style={{
            flex: 1,
            background: 'var(--gb-screen-dark)',
            padding: 16,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: 18,
              color: 'var(--gb-screen-green)',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              height: '100%',
            }}
          >
            {displayed}
            {typing && (
              <span style={{ animation: 'blink 0.5s step-end infinite' }}>_</span>
            )}
          </div>
        </div>
      </div>

      <p
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 7,
          color: '#555',
          marginTop: 20,
          animation: 'blink 0.8s step-end infinite',
        }}
      >
        {typing ? '...' : `${beat}/3  ▼ CLICK TO CONTINUE`}
      </p>
    </div>
  )
}
