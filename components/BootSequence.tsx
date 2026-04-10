'use client'

import { useState, useEffect } from 'react'
import { playBootChime } from '@/lib/audio'

interface BootSequenceProps {
  onComplete: () => void
}

const HOE_PINK = '#FF2D78'
const GB_WHITE = '#F0EFE7'
const GB_BLACK = '#000000'

const LOGO_SHADOW = [
  '-4px -4px 0 #1a0030', ' 4px -4px 0 #1a0030',
  '-4px  4px 0 #1a0030', ' 4px  4px 0 #1a0030',
  '-4px  0   0 #1a0030', ' 4px  0   0 #1a0030',
  ' 0   -4px 0 #1a0030', ' 0    4px 0 #1a0030',
  ' 6px  6px 0 #1a0030',
].join(',')

// Wrapper that maintains the exact 400:360 (10:9) Game Boy aspect ratio
// The frame images are exactly 400×360 so objectFit: fill maps perfectly
function GBFrame({ src, children, onClick }: {
  src: string
  children?: React.ReactNode
  onClick?: () => void
}) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: GB_BLACK,
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <div style={{
        position: 'relative',
        // 10:9 aspect ratio container — matches frame dimensions exactly
        width: 'min(100vw, calc(100vh * 400 / 360))',
        height: 'min(100vh, calc(100vw * 360 / 400))',
        overflow: 'hidden',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          style={{
            position: 'absolute', width: '100%', height: '100%',
            objectFit: 'fill',
          }}
        />
        {children}
      </div>
    </div>
  )
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 80)     // copyright
    const t2 = setTimeout(() => setStep(2), 1600)   // HOE FREAK frame appears
    const t3 = setTimeout(() => setStep(3), 3800)   // HOE FREAK fades
    const t4 = setTimeout(() => {
      try { playBootChime() } catch {}
      setStep(4)
    }, 4200)                                         // title screen + logo slam
    const t5 = setTimeout(() => setStep(5), 4900)   // subtitle
    const t6 = setTimeout(() => setStep(6), 5600)   // PRESS START
    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout)
  }, [])

  // ── Step 0: instant black ──────────────────────────────────────────────────
  if (step === 0) {
    return <div style={{ position: 'fixed', inset: 0, background: GB_BLACK }} />
  }

  // ── Step 1: copyright screen ───────────────────────────────────────────────
  if (step === 1) {
    return (
      <GBFrame src="/frames/frame_001.jpg">
        {/* Cream overlay covers the original copyright text */}
        <div style={{
          position: 'absolute', inset: 0,
          background: GB_WHITE,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3%' }}>
            {[
              ['©2024', 'HOE-KEMON inc.'],
              ['©2024', 'Hoe Entertainment'],
              ['©2024', 'Prof. Oak & Assoc.'],
            ].map(([copy, name]) => (
              <div key={name} style={{ display: 'flex', gap: '8%', alignItems: 'baseline' }}>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'max(6px, 1.8vw)', color: GB_BLACK }}>{copy}</span>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'max(6px, 1.8vw)', color: GB_BLACK }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </GBFrame>
    )
  }

  // ── Steps 2–3: HOE FREAK intro ─────────────────────────────────────────────
  // frame_003 already has: black letterboxes + white middle + Pappy creature
  // We overlay cream covers over "GAME FREAK" text + stars, then render "HOE FREAK"
  if (step === 2 || step === 3) {
    const fading = step === 3
    return (
      <GBFrame src="/frames/frame_003.jpg">
        {/* Cover "GAME FREAK" text (sits at ~51-57% from top) */}
        <div style={{
          position: 'absolute',
          top: '49%', left: '4%', right: '4%', height: '10%',
          background: GB_WHITE,
          opacity: fading ? 0 : 1,
          transition: fading ? 'opacity 0.25s ease' : 'none',
        }} />
        {/* HOE FREAK replacement text */}
        <div style={{
          position: 'absolute',
          top: '49.5%',
          left: 0, right: 0,
          display: 'flex', justifyContent: 'center', alignItems: 'baseline',
          gap: '5%',
          opacity: fading ? 0 : 1,
          transition: fading ? 'opacity 0.25s ease' : 'none',
        }}>
          <span style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'max(18px, 5.5vw)',
            fontWeight: 900, fontStyle: 'italic',
            color: HOE_PINK,
          }}>HOE</span>
          <span style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'max(18px, 5.5vw)',
            fontWeight: 900, fontStyle: 'italic',
            color: GB_BLACK,
          }}>FREAK</span>
        </div>
        {/* Cover stars + "inc." (58–72%) */}
        <div style={{
          position: 'absolute',
          top: '58%', left: '2%', right: '2%', height: '16%',
          background: GB_WHITE,
          opacity: fading ? 0 : 1,
          transition: fading ? 'opacity 0.25s ease' : 'none',
        }} />
        {/* Our styled stars */}
        <div style={{
          position: 'absolute',
          top: '59%', left: 0, right: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5%',
          opacity: fading ? 0 : 1,
          transition: fading ? 'opacity 0.25s ease' : 'none',
        }}>
          {/* Row 1: 7 stars */}
          <div style={{ display: 'flex', gap: 'max(6px, 2vw)' }}>
            {[...Array(7)].map((_, i) => (
              <span key={i} style={{ fontSize: 'max(8px, 2.2vw)', color: '#888', fontFamily: 'monospace' }}>★</span>
            ))}
          </div>
          {/* Row 2: 6 stars, offset */}
          <div style={{ display: 'flex', gap: 'max(6px, 2vw)', marginLeft: 'max(4px, 1.1vw)' }}>
            {[...Array(6)].map((_, i) => (
              <span key={i} style={{ fontSize: 'max(8px, 2.2vw)', color: '#888', fontFamily: 'monospace' }}>★</span>
            ))}
          </div>
          {/* "inc." */}
          <span style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'max(4px, 1.2vw)',
            color: '#888',
            marginTop: '1%',
          }}>inc.</span>
        </div>
      </GBFrame>
    )
  }

  // ── Steps 4–6: Title screen ────────────────────────────────────────────────
  // frame_006: battle scene (Gengar vs Nidorino) with black letterboxes
  // Top letterbox: 0–22% | White battle area: 22–82% | Bottom letterbox: 82–100%
  return (
    <GBFrame src="/frames/frame_006.jpg" onClick={step >= 6 ? onComplete : undefined}>
      {/* HOE-KEMON logo in the top black letterbox area */}
      {step >= 4 && (
        <div style={{
          position: 'absolute',
          top: '2%', left: 0, right: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1%',
        }}>
          <h1
            className="animate-logo-slam"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'max(20px, 6vw)',
              color: HOE_PINK,
              textShadow: LOGO_SHADOW,
              lineHeight: 1.15, margin: 0, whiteSpace: 'nowrap',
            }}
          >
            HOE-KEMON
          </h1>
          {step >= 5 && (
            <p className="animate-slide-up" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'max(5px, 1.6vw)',
              color: '#FFFFFF', letterSpacing: '0.12em', margin: 0,
            }}>
              THIRST VERSION
            </p>
          )}
        </div>
      )}

      {/* PRESS START + copyright in the bottom black letterbox area */}
      {step >= 6 && (
        <div style={{
          position: 'absolute',
          bottom: '1%', left: 0, right: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5%',
        }}>
          <p style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'max(7px, 1.8vw)',
            color: 'white',
            animation: 'blink 0.8s step-end infinite',
            margin: 0,
          }}>
            PRESS START
          </p>
          <p style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'max(4px, 1.1vw)',
            color: '#555', lineHeight: 1.8, textAlign: 'center', margin: 0,
          }}>
            ©2024 HOE-KEMON inc.<br />PROF. OAK &amp; ASSOCIATES
          </p>
        </div>
      )}
    </GBFrame>
  )
}
