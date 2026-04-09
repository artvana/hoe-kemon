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
        return `HOE-KDEX No.069\n\n${data.name.toUpperCase()}\n${data.type1.toUpperCase()} TYPE\n\nHT  ${data.height}\nWT  none of ur business\n\nLv. ${data.level}`
      case 2:
        return `SPECIES ORIGIN\n\n${data.backstory}`
      case 3:
        return `FIELD NOTES\n\n${data.pokedexEntry}`
      default:
        return ''
    }
  }, [beat, data])

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
    <div className="screen" style={{ background: '#1a0000', cursor: 'pointer', flexDirection: 'column', gap: 16 }}>

      {/* ─── POKÉDEX DEVICE ─── */}
      <div
        style={{
          display: 'flex',
          width: '92vw',
          maxWidth: 660,
          background: '#CC1111',
          borderRadius: '12px 12px 8px 8px',
          border: '4px solid #880000',
          boxShadow: '0 8px 32px rgba(0,0,0,0.7), inset 0 2px 0 rgba(255,100,100,0.3)',
          overflow: 'hidden',
        }}
      >
        {/* ─── LEFT PANEL ─── */}
        <div
          style={{
            width: 200,
            flexShrink: 0,
            background: '#CC1111',
            borderRight: '4px solid #880000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '12px 10px',
            gap: 10,
          }}
        >
          {/* Camera lens */}
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 6, alignItems: 'center' }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #6699ff, #223388)',
                border: '3px solid #111',
                boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.4)',
              }}
            />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffcc00', border: '2px solid #886600' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00cc44', border: '2px solid #006622' }} />
          </div>

          {/* Sprite screen */}
          <div
            style={{
              background: '#9BBC0F',
              border: '4px solid #111',
              borderRadius: 4,
              width: 160,
              height: 160,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Screen tint overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)',
                pointerEvents: 'none',
              }}
            />
            {spriteUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={spriteUrl}
                alt={data.name}
                style={{
                  width: '90%',
                  height: '90%',
                  objectFit: 'contain',
                  imageRendering: 'pixelated',
                  mixBlendMode: 'multiply',
                }}
              />
            ) : (
              <div
                style={{
                  width: '65%',
                  height: '65%',
                  background: type1Colour,
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                  opacity: 0.6,
                  animation: 'silhouette-pulse 1.5s ease-in-out infinite',
                }}
              />
            )}
          </div>

          {/* Screen label */}
          <div
            style={{
              background: '#880000',
              borderRadius: 3,
              padding: '3px 10px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: '#ffaaaa' }}>
              HOE-KDEX
            </span>
          </div>

          {/* D-pad area */}
          <div style={{ position: 'relative', width: 60, height: 60, marginTop: 4 }}>
            {/* Horizontal bar */}
            <div style={{ position: 'absolute', top: '33%', left: 0, right: 0, height: '33%', background: '#880000', borderRadius: 2 }} />
            {/* Vertical bar */}
            <div style={{ position: 'absolute', left: '33%', top: 0, bottom: 0, width: '33%', background: '#880000', borderRadius: 2 }} />
            {/* Center dot */}
            <div style={{ position: 'absolute', top: '33%', left: '33%', width: '33%', height: '33%', background: '#770000', borderRadius: 1 }} />
          </div>
        </div>

        {/* ─── RIGHT PANEL (text screen) ─── */}
        <div
          style={{
            flex: 1,
            background: '#0F380F',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Screen header bar */}
          <div
            style={{
              background: '#880000',
              padding: '6px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: '#ffaaaa' }}>
              {data.name.toUpperCase()}
            </span>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: '#ffaaaa' }}>
              {beat}/3
            </span>
          </div>

          {/* Text area — GB screen green */}
          <div
            style={{
              flex: 1,
              padding: '14px 16px',
              background: '#9BBC0F',
              margin: 8,
              borderRadius: 3,
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Screen scanlines */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: 18,
                color: '#0F380F',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                position: 'relative',
              }}
            >
              {displayed}
              {typing && (
                <span style={{ animation: 'blink 0.5s step-end infinite' }}>█</span>
              )}
            </div>
          </div>

          {/* Bottom buttons */}
          <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#AA0000', border: '2px solid #660000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5, color: '#ffaaaa' }}>B</span>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#AA0000', border: '2px solid #660000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5, color: '#ffaaaa' }}>A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tap hint */}
      <p
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 7,
          color: '#884444',
          animation: typing ? 'none' : 'blink 0.8s step-end infinite',
        }}
      >
        {typing ? '...' : '▼ TAP TO CONTINUE'}
      </p>
    </div>
  )
}
