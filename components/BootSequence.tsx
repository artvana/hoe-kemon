'use client'

import { useState, useEffect } from 'react'
import { playBootChime } from '@/lib/audio'

interface BootSequenceProps {
  onComplete: () => void
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 500)
    const t2 = setTimeout(() => {
      try { playBootChime() } catch {}
      setStep(2)
    }, 2100)
    const t3 = setTimeout(() => setStep(3), 2600)
    const t4 = setTimeout(() => setStep(4), 3200)
    const t5 = setTimeout(() => setStep(5), 3700)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5) }
  }, [])

  return (
    <div
      className="screen"
      style={{
        background: '#0a0a0a',
        cursor: step >= 5 ? 'pointer' : 'default',
        userSelect: 'none',
      }}
      onClick={step >= 5 ? onComplete : undefined}
    >
      {/* Step 1–2: GAME BOY */}
      {step >= 1 && step < 3 && (
        <p
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 12,
            color: '#888',
            letterSpacing: '0.25em',
            opacity: step === 1 ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          GAME BOY
        </p>
      )}

      {/* Steps 3+: Logo screen */}
      {step >= 3 && (
        <div style={{ textAlign: 'center', padding: '0 20px' }}>
          <h1
            className="animate-logo-slam"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(28px, 6vw, 48px)',
              color: 'var(--gb-yellow)',
              textShadow: '4px 4px 0 var(--gb-blue)',
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            HOE-KEMON
          </h1>

          {step >= 4 && (
            <p
              className="animate-slide-up"
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: 28,
                color: 'white',
                marginTop: 12,
              }}
            >
              ✦ THIRST VERSION ✦
            </p>
          )}

          {/* Mock battle sprites */}
          {step >= 4 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                gap: 80,
                marginTop: 40,
                height: 80,
              }}
            >
              <div
                className="animate-idle-bounce"
                style={{
                  width: 56,
                  height: 68,
                  background: 'var(--neon-pink)',
                  clipPath:
                    'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                }}
              />
              <div
                className="animate-idle-bounce"
                style={{
                  width: 56,
                  height: 68,
                  background: 'var(--neon-purple)',
                  clipPath:
                    'polygon(50% 0%, 100% 30%, 85% 100%, 15% 100%, 0% 30%)',
                  animationDelay: '0.5s',
                }}
              />
            </div>
          )}

          {step >= 5 && (
            <p
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: 'white',
                marginTop: 48,
                animation: 'blink 0.8s step-end infinite',
              }}
            >
              PRESS START
            </p>
          )}
        </div>
      )}
    </div>
  )
}
