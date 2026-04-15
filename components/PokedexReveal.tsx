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

// Split text into screen-sized chunks at word boundaries (~120 chars fits ~3-4 lines)
function chunkText(text: string, maxChars = 120): string[] {
  if (text.length <= maxChars) return [text]
  const chunks: string[] = []
  let remaining = text
  while (remaining.length > maxChars) {
    let cut = remaining.lastIndexOf(' ', maxChars)
    const cutN = remaining.lastIndexOf('\n', maxChars)
    if (cutN > cut) cut = cutN
    if (cut <= 0) cut = maxChars
    chunks.push(remaining.slice(0, cut).trimEnd())
    remaining = remaining.slice(cut).trimStart()
  }
  if (remaining.trim()) chunks.push(remaining)
  return chunks
}

export default function PokedexReveal({
  data,
  spriteUrl,
  initialBeat = 1,
  onComplete,
  onBeatAdvance,
}: PokedexRevealProps) {
  const [beat, setBeat] = useState(initialBeat)
  const [chunk, setChunk] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(false)

  const beatRef = useRef(beat)
  beatRef.current = beat
  const chunkRef = useRef(chunk)
  chunkRef.current = chunk
  const typingRef = useRef(false)
  typingRef.current = typing
  const intervalRef = useRef<ReturnType<typeof setInterval>>()
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const onBeatAdvanceRef = useRef(onBeatAdvance)
  onBeatAdvanceRef.current = onBeatAdvance

  const species = SPECIES[data.type1] ?? data.type1.toUpperCase()

  // Pre-compute all chunks for all beats
  const allChunks = useMemo(() => [
    chunkText(data.pokedexEntry),
    chunkText(data.backstory),
    chunkText(`Lv.${data.level}  HP ${data.hp}\n\n${data.catchPhrase}`),
  ], [data])

  const allChunksRef = useRef(allChunks)
  allChunksRef.current = allChunks

  const currentText = allChunks[beat - 1]?.[chunk] ?? ''
  const currentTextRef = useRef(currentText)
  currentTextRef.current = currentText

  // Type out the current chunk
  useEffect(() => {
    clearInterval(intervalRef.current)
    let i = 0
    setDisplayed('')
    setTyping(true)
    intervalRef.current = setInterval(() => {
      i++
      setDisplayed(currentText.slice(0, i))
      if (i >= currentText.length) {
        clearInterval(intervalRef.current)
        setTyping(false)
      }
    }, 22)
    return () => clearInterval(intervalRef.current)
  }, [currentText])

  // Click to skip typing / advance chunk / advance beat
  useEffect(() => {
    function onClick() {
      if (typingRef.current) {
        clearInterval(intervalRef.current)
        setDisplayed(currentTextRef.current)
        setTyping(false)
        return
      }
      const beatChunks = allChunksRef.current[beatRef.current - 1] ?? []
      if (chunkRef.current < beatChunks.length - 1) {
        setChunk(c => c + 1)
        return
      }
      const next = beatRef.current + 1
      if (next > 3) {
        onCompleteRef.current()
      } else {
        onBeatAdvanceRef.current?.(next)
        setBeat(next)
        setChunk(0)
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
        padding: '5px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: "'Pokemon GB', monospace", fontSize: 8, color: '#9BBC0F', letterSpacing: 2 }}>
          HOE-KDEX
        </span>
        <span style={{ fontFamily: "'Pokemon GB', monospace", fontSize: 7, color: '#9BBC0F' }}>
          {beat}/3
          {allChunks[beat - 1].length > 1 ? ` ${chunk + 1}/${allChunks[beat - 1].length}` : ''}
        </span>
      </div>

      {/* ── Main data panel — left: sprite+No., right: name+stats ── */}
      <div style={{
        display: 'flex',
        height: 100,
        borderBottom: '3px solid #0F380F',
        background: '#9BBC0F',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        {/* LEFT: sprite */}
        <div style={{
          width: '42%',
          flexShrink: 0,
          borderRight: '3px solid #0F380F',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Scanlines />
          <div style={{
            width: '80%', height: '80%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            {spriteUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/sprite/image?url=${encodeURIComponent(spriteUrl)}`}
                alt={data.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }}
              />
            ) : (
              <div style={{
                width: '70%', height: '70%',
                background: type1Colour,
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                opacity: 0.7,
                animation: 'silhouette-pulse 1.5s ease-in-out infinite',
              }} />
            )}
          </div>
          <div style={{
            fontFamily: "'Pokemon GB', monospace",
            fontSize: 5,
            color: '#0F380F',
            position: 'absolute',
            bottom: 5, left: 7,
          }}>No.069</div>
        </div>

        {/* RIGHT: name, species, HT, WT */}
        <div style={{
          flex: 1,
          padding: '8px 10px 6px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Scanlines />
          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: 18,
            color: '#0F380F',
            fontWeight: 'bold',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            position: 'relative',
          }}>{data.name.toUpperCase()}</div>

          <div style={{ fontFamily: "'VT323', monospace", fontSize: 13, color: '#0F380F', position: 'relative' }}>
            {species}
          </div>

          <div style={{ height: 4 }} />

          <div style={{ fontFamily: "'VT323', monospace", fontSize: 13, color: '#0F380F', display: 'flex', gap: 4, position: 'relative' }}>
            <span>HT</span><span style={{ fontWeight: 'bold' }}>{data.height}</span>
          </div>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: 13, color: '#0F380F', display: 'flex', gap: 4, position: 'relative' }}>
            <span>WT</span><span style={{ fontWeight: 'bold' }}>{data.weight}</span>
          </div>
        </div>
      </div>

      {/* ── Decorative divider ── */}
      <div style={{
        background: '#9BBC0F',
        borderBottom: '3px solid #0F380F',
        padding: '2px 8px',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: "'Pokemon GB', monospace",
          fontSize: 5,
          color: '#0F380F',
          letterSpacing: 2,
          whiteSpace: 'nowrap',
        }}>
          {'■□'.repeat(40)}
        </div>
      </div>

      {/* ── Scrolling description area ── */}
      <div style={{
        flex: 1,
        background: '#9BBC0F',
        padding: '8px 12px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Scanlines />
        <div style={{
          fontFamily: "'VT323', monospace",
          fontSize: 16,
          color: '#0F380F',
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          position: 'relative',
        }}>
          {displayed}
          {typing && <span style={{ animation: 'blink 0.5s step-end infinite' }}>█</span>}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        background: '#0F380F',
        padding: '4px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "'Pokemon GB', monospace",
          fontSize: 5,
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
