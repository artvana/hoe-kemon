'use client'

import { useState, useEffect, useRef } from 'react'
import { playBootChime } from '@/lib/audio'

interface BootSequenceProps {
  onComplete: () => void
}

// Calculate integer scale so the 192×144 composition fills the GameBoy display div.
// Measures the wrapper element (the actual .gb-wrapper div) not the viewport,
// so it works correctly when embedded inside the GameBoy shell.
function useGBScale(wrapperRef: React.RefObject<HTMLDivElement>) {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    function update() {
      const el = wrapperRef.current
      if (!el) return
      const w = el.clientWidth  || el.offsetWidth
      const h = el.clientHeight || el.offsetHeight
      const sx = Math.floor(w / 192)
      const sy = Math.floor(h / 144)
      setScale(Math.max(1, Math.min(sx, sy)))
    }
    update()
    const ro = new ResizeObserver(update)
    if (wrapperRef.current) ro.observe(wrapperRef.current)
    return () => ro.disconnect()
  }, [wrapperRef])
  return scale
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const scale = useGBScale(wrapperRef)

  // Play chime and trigger onComplete at end of scene 3 animation
  useEffect(() => {
    const t1 = setTimeout(() => {
      try { playBootChime() } catch {}
    }, 4200)
    return () => clearTimeout(t1)
  }, [])

  // Allow click anywhere to skip straight to onComplete once title is visible
  // The CSS animation gets to scene 3 at ~14.2s; allow skip after scene 2 visible (~5s)
  const [canSkip, setCanSkip] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setCanSkip(true), 5000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="gb-wrapper"
      onClick={canSkip ? onComplete : undefined}
      style={{ cursor: canSkip ? 'pointer' : 'default' }}
    >
      <div
        className="gb-composition"
        style={{ transform: `scale(${scale})` }}
      >
        {/* ── Black letterbox bars — top and bottom 20px ────────────────── */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 20, background: '#000', zIndex: 10 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 20, background: '#000', zIndex: 10 }} />

        {/* ══ SCENE 1: HOE FREAK ════════════════════════════════════════════ */}
        <div className="gb-scene scene--1">
          {/* Shooting star pixel art */}
          <div className="shooting-star"><div /></div>

          {/* Game Freak creature logo (Pappy/Clefairy silhouette) */}
          <div className="gamefreak-logo"><div /></div>

          {/* Original GAME FREAK text sprite — hidden, replaced by our text */}
          <div className="gamefreak"><div /></div>

          {/* HOE FREAK text overlay at same position */}
          <div className="hoe-freak-text">HOE FREAK</div>

          {/* Falling stars */}
          <div className="star-shower-mask">
            <div className="star-shower--light"><div /></div>
            <div className="star-shower--dark"><div /></div>
          </div>
        </div>

        {/* ══ SCENE 2: BATTLE (Gengar vs Jigglypuff) ════════════════════════ */}
        <div className="gb-scene scene--2">
          {/* Gengar — enters from right, attacks */}
          <div className="gengar-wrapper">
            <div className="gengar"><div /></div>
            <div className="gengar--scratch1"><div /></div>
            <div className="gengar--scratch2"><div /></div>
          </div>

          {/* Opponent (Jigglypuff — blue version) */}
          <div className="opponent">
            <div className="jigglypuff-wrapper">
              <div className="jigglypuff"><div /></div>
              <div className="jigglypuff--flinch"><div /></div>
              <div className="jigglypuff--tackle"><div /></div>
            </div>
          </div>
        </div>

        {/* ══ SCENE 3: HOE-KEMON TITLE ══════════════════════════════════════ */}
        <div className="gb-scene scene--3">
          <div className="logo-wrapper">
            <div className="hoe-kemon-logo">
              HOE-KEMON
            </div>
            <span className="version-text">THIRST VERSION</span>
          </div>
          <div className="press-start">PRESS START</div>
        </div>
      </div>
    </div>
  )
}
