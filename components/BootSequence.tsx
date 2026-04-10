'use client'

import { useState, useEffect } from 'react'
import { playBootChime } from '@/lib/audio'

interface BootSequenceProps {
  onComplete: () => void
}

// ── Steps ──────────────────────────────────────────────────────────────────────
// 0   black (instant)
// 1   copyright — white bg, small pixel text
// 2   HOE FREAK — white + letterbox bars, creature appears
// 3   HOE FREAK — "HOE  FREAK" text + stars appear
// 4   HOE FREAK — fades out to white flash
// 5   HOE-KEMON title — dark bg, logo slams in
// 6   subtitle appears
// 7   two silhouettes slide in
// 8   PRESS START blinking (clickable)
// ──────────────────────────────────────────────────────────────────────────────

// GB palette
const GB_WHITE  = '#F0EFE7'   // warm off-white, like the original screen
const GB_BLACK  = '#000000'
const HOE_PINK  = '#FF2D78'

// Pappy-style creature drawn in CSS — small, centred, does a hop
function Pappy({ hop }: { hop: boolean }) {
  return (
    <div style={{
      width: 48, height: 56, position: 'relative',
      transform: hop ? 'translateY(-10px)' : 'translateY(0)',
      transition: 'transform 0.18s ease-in-out',
      filter: 'drop-shadow(0 2px 0 rgba(0,0,0,0.18))',
    }}>
      {/* head */}
      <div style={{ position: 'absolute', left: '30%', top: 0, width: '40%', height: '32%', borderRadius: '50% 50% 40% 40%', background: GB_BLACK }} />
      {/* body */}
      <div style={{ position: 'absolute', left: '20%', top: '28%', width: '60%', height: '36%', borderRadius: '8px 8px 16px 16px', background: GB_BLACK }} />
      {/* left arm */}
      <div style={{ position: 'absolute', left: '4%', top: '30%', width: '18%', height: '26%', borderRadius: '50%', background: GB_BLACK, transform: 'rotate(-25deg)' }} />
      {/* right arm */}
      <div style={{ position: 'absolute', right: '4%', top: '30%', width: '18%', height: '26%', borderRadius: '50%', background: GB_BLACK, transform: 'rotate(25deg)' }} />
      {/* left leg */}
      <div style={{ position: 'absolute', left: '22%', top: '60%', width: '20%', height: '34%', borderRadius: '4px 4px 8px 8px', background: GB_BLACK }} />
      {/* right leg */}
      <div style={{ position: 'absolute', right: '22%', top: '60%', width: '20%', height: '34%', borderRadius: '4px 4px 8px 8px', background: GB_BLACK }} />
      {/* eyes (white dots) */}
      <div style={{ position: 'absolute', left: '36%', top: '6%', width: '9%', height: '9%', borderRadius: '50%', background: GB_WHITE }} />
      <div style={{ position: 'absolute', right: '36%', top: '6%', width: '9%', height: '9%', borderRadius: '50%', background: GB_WHITE }} />
    </div>
  )
}

// Silhouette used in the title screen battle (left faces right, right is mirrored)
function TitleSilhouette({ mirrored = false, offset = 0 }: { mirrored?: boolean; offset?: number }) {
  return (
    <div style={{
      width: 96, height: 96, position: 'relative', flexShrink: 0,
      transform: `translateX(${offset}px)${mirrored ? ' scaleX(-1)' : ''}`,
      transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }}>
      {/* head */}
      <div style={{ position: 'absolute', left: '28%', top: '4%', width: '42%', height: '30%', borderRadius: '50% 50% 38% 38%', background: GB_BLACK }} />
      {/* ear/spike */}
      <div style={{ position: 'absolute', left: '58%', top: '0%', width: '16%', height: '20%', borderRadius: '50% 0 50% 50%', background: GB_BLACK, transform: 'rotate(20deg)' }} />
      {/* body */}
      <div style={{ position: 'absolute', left: '18%', top: '28%', width: '62%', height: '40%', borderRadius: '10px 10px 22px 22px', background: GB_BLACK }} />
      {/* arm */}
      <div style={{ position: 'absolute', left: '6%', top: '30%', width: '16%', height: '30%', borderRadius: '50%', background: GB_BLACK, transform: 'rotate(-18deg)' }} />
      {/* tail */}
      <div style={{ position: 'absolute', right: '4%', top: '50%', width: '18%', height: '26%', borderRadius: '50%', background: GB_BLACK, transform: 'rotate(30deg)' }} />
      {/* legs */}
      <div style={{ position: 'absolute', left: '20%', top: '64%', width: '22%', height: '30%', borderRadius: '5px 5px 10px 10px', background: GB_BLACK }} />
      <div style={{ position: 'absolute', right: '20%', top: '64%', width: '22%', height: '30%', borderRadius: '5px 5px 10px 10px', background: GB_BLACK }} />
    </div>
  )
}

// Stars row — like the scattered stars under "GAME FREAK"
function Stars() {
  const row1 = [8, 22, 38, 52, 66, 80, 92]
  const row2 = [14, 30, 46, 60, 74, 88]
  return (
    <div style={{ position: 'relative', width: 220, height: 28, marginTop: 6 }}>
      {row1.map((x, i) => (
        <span key={`a${i}`} style={{ position: 'absolute', left: `${x}%`, top: 2, fontSize: 9, color: '#888', fontFamily: 'monospace' }}>★</span>
      ))}
      {row2.map((x, i) => (
        <span key={`b${i}`} style={{ position: 'absolute', left: `${x}%`, top: 14, fontSize: 9, color: '#888', fontFamily: 'monospace' }}>★</span>
      ))}
    </div>
  )
}

// Heavy outline for the HOE-KEMON logo
const LOGO_SHADOW = [
  '-4px -4px 0 #1a0030', ' 4px -4px 0 #1a0030',
  '-4px  4px 0 #1a0030', ' 4px  4px 0 #1a0030',
  '-4px  0   0 #1a0030', ' 4px  0   0 #1a0030',
  ' 0   -4px 0 #1a0030', ' 0    4px 0 #1a0030',
  ' 6px  6px 0 #1a0030',
].join(',')

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [step, setStep]    = useState(0)
  const [hop, setHop]      = useState(false)
  const [slideIn, setSlideIn] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 80)
    const t2 = setTimeout(() => setStep(2), 1600)  // copyright → HOE FREAK
    const t3 = setTimeout(() => setStep(3), 2000)  // creature → text + stars
    const t4 = setTimeout(() => setStep(4), 3800)  // HOE FREAK fades
    const t5 = setTimeout(() => { try { playBootChime() } catch {} setStep(5) }, 4200) // title
    const t6 = setTimeout(() => setStep(6), 4800)  // subtitle
    const t7 = setTimeout(() => { setStep(7); setSlideIn(true) }, 5300) // silhouettes slide in
    const t8 = setTimeout(() => setStep(8), 6200)  // PRESS START
    return () => {
      [t1,t2,t3,t4,t5,t6,t7,t8].forEach(clearTimeout)
    }
  }, [])

  // Pappy hop loop during HOE FREAK screen
  useEffect(() => {
    if (step < 2 || step > 4) return
    const interval = setInterval(() => setHop(h => !h), 380)
    return () => clearInterval(interval)
  }, [step])

  // ── Backgrounds ──────────────────────────────────────────────────────────────
  const bg =
    step === 0 ? GB_BLACK :
    step <= 4  ? GB_WHITE :
    GB_BLACK

  return (
    <div
      className="screen"
      style={{
        background: bg,
        transition: step === 5 ? 'background 0.3s' : step === 4 ? 'background 0.25s' : 'none',
        cursor: step >= 8 ? 'pointer' : 'default',
        userSelect: 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        overflow: 'hidden',
      }}
      onClick={step >= 8 ? onComplete : undefined}
    >

      {/* ── COPYRIGHT SCREEN (step 1) ── */}
      {step === 1 && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 12,
          opacity: 1,
        }}>
          {[
            ['©2024', 'HOE-KEMON inc.'],
            ['©2024', 'Hoe Entertainment'],
            ['©2024', 'Prof. Oak & Assoc.'],
          ].map(([copy, name]) => (
            <div key={name} style={{ display: 'flex', gap: 24, alignItems: 'baseline' }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: GB_BLACK }}>{copy}</span>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: GB_BLACK }}>{name}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── HOE FREAK SCREEN (steps 2-4) ── */}
      {step >= 2 && step <= 4 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          opacity: step === 4 ? 0 : 1,
          transition: step === 4 ? 'opacity 0.25s ease' : 'none',
        }}>
          {/* Top letterbox bar */}
          <div style={{ height: '22%', background: GB_BLACK, flexShrink: 0 }} />

          {/* Middle content */}
          <div style={{
            flex: 1,
            background: GB_WHITE,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 10,
          }}>
            <Pappy hop={hop} />

            {step >= 3 && (
              <>
                {/* "HOE  FREAK" — chunky serif, matching Game Freak logo weight */}
                <div style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 28, fontWeight: 900, fontStyle: 'italic',
                  letterSpacing: '0.04em',
                  color: GB_BLACK,
                  display: 'flex', gap: 18, alignItems: 'baseline',
                }}>
                  <span style={{ color: HOE_PINK }}>HOE</span>
                  <span>FREAK</span>
                </div>
                <Stars />
                <span style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 6, color: '#888', marginTop: 2,
                }}>inc.</span>
              </>
            )}
          </div>

          {/* Bottom letterbox bar */}
          <div style={{ height: '20%', background: GB_BLACK, flexShrink: 0 }} />
        </div>
      )}

      {/* ── HOE-KEMON TITLE (steps 5+) ── */}
      {step >= 5 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '28px 20px 18px',
          opacity: step === 5 ? 0 : 1,
          transition: step === 5 ? 'none' : 'opacity 0.4s ease',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center' }}>
            <h1
              className="animate-logo-slam"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'clamp(26px, 7.5vw, 56px)',
                color: HOE_PINK,
                textShadow: LOGO_SHADOW,
                lineHeight: 1.2, margin: 0, whiteSpace: 'nowrap',
              }}
            >
              HOE-KEMON
            </h1>
            {step >= 6 && (
              <p className="animate-slide-up" style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'clamp(7px, 1.8vw, 11px)',
                color: '#FFFFFF', marginTop: 12, letterSpacing: '0.12em',
              }}>
                THIRST VERSION
              </p>
            )}
          </div>

          {/* Battle scene — two silhouettes face off */}
          {step >= 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32 }}>
                <TitleSilhouette offset={slideIn ? 0 : -180} />
                <TitleSilhouette mirrored offset={slideIn ? 0 : 180} />
              </div>
              <div style={{ width: 240, height: 2, background: HOE_PINK, borderRadius: 2, marginTop: 6, opacity: 0.5 }} />
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign: 'center' }}>
            {step >= 8 && (
              <p style={{
                fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                color: 'white', marginBottom: 10,
                animation: 'blink 0.8s step-end infinite',
              }}>PRESS START</p>
            )}
            <p style={{
              fontFamily: "'Press Start 2P', monospace", fontSize: 5,
              color: '#444', lineHeight: 2,
            }}>
              ©2024 HOE-KEMON inc.<br />PROF. OAK &amp; ASSOCIATES
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
