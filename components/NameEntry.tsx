'use client'

import { useState, useEffect, useRef } from 'react'

interface NameEntryProps {
  onSubmit: (name: string) => void
}

const PRESETS = ['Ash', 'Hoebart', 'Brittany']
const OPTIONS = ['NEW NAME', ...PRESETS]

export default function NameEntry({ onSubmit }: NameEntryProps) {
  const [cursor, setCursor] = useState(0)
  const [mode, setMode] = useState<'select' | 'type'>('select')
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Focus container for keyboard nav, then input when in type mode
  useEffect(() => {
    if (mode === 'select') containerRef.current?.focus()
    else inputRef.current?.focus()
  }, [mode])

  function select(index: number) {
    if (index === 0) {
      setMode('type')
    } else {
      onSubmit(PRESETS[index - 1])
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (mode !== 'select') return
    if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(c => Math.max(0, c - 1)) }
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(OPTIONS.length - 1, c + 1)) }
    if (e.key === 'Enter') { e.preventDefault(); select(cursor) }
  }

  function handleSubmit() {
    const clean = value.trim().replace(/^@/, '')
    if (clean) onSubmit(clean)
  }

  const PS2 = "'Press Start 2P', monospace"
  const VT = "'VT323', monospace"

  // ── Type mode: text entry ─────────────────────────────────────────────────
  if (mode === 'type') {
    return (
      <div style={{
        position: 'absolute', inset: 0, background: '#F0EFE7',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Top: input box */}
        <div style={{ flex: 1, padding: '8px', display: 'flex' }}>
          <div style={{
            position: 'relative',
            flex: 1,
            border: '3px solid #000',
            boxShadow: 'inset 0 0 0 1px #F0EFE7, inset 0 0 0 3px #000',
            background: '#F0EFE7',
            padding: '6px 8px',
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            {/* Corner squares */}
            {[{ top: -2, left: -2 }, { top: -2, right: -2 }, { bottom: -2, left: -2 }, { bottom: -2, right: -2 }].map((pos, i) => (
              <div key={i} style={{ position: 'absolute', ...pos, width: 5, height: 5, background: '#F0EFE7', zIndex: 1 }} />
            ))}
            <div style={{ fontFamily: PS2, fontSize: 6, color: '#000', lineHeight: 1.8 }}>YOUR NAME?</div>
            <div style={{
              border: '2px solid #000',
              boxShadow: 'inset 0 0 0 1px #F0EFE7, inset 0 0 0 3px #000',
              background: '#F0EFE7', padding: '3px 5px',
            }}>
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
                placeholder="@handle"
                maxLength={20}
                style={{
                  fontFamily: VT, fontSize: 16, color: '#000',
                  background: 'transparent', border: 'none', outline: 'none',
                  width: '100%', appearance: 'none', WebkitAppearance: 'none',
                  boxSizing: 'border-box', padding: 0,
                }}
              />
            </div>
            <button
              onClick={handleSubmit}
              style={{
                fontFamily: PS2, fontSize: 6, color: '#000',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '2px 0', display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <span style={{ animation: 'blink 0.8s step-end infinite' }}>▶</span>
              OK
            </button>
          </div>
        </div>

        {/* Bottom: dialogue */}
        <div style={{
          height: '40%',
          borderTop: '3px solid #000',
          boxShadow: 'inset 0 0 0 2px #F0EFE7, inset 0 0 0 4px #000',
          padding: '8px 10px',
          background: '#F0EFE7',
        }}>
          <span style={{ fontFamily: VT, fontSize: 18, color: '#000', lineHeight: 1.35 }}>
            {'First, what is\nyour name?'}
          </span>
        </div>
      </div>
    )
  }

  // ── Select mode: Gen 1 name menu ─────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        position: 'absolute', inset: 0, background: '#F0EFE7',
        display: 'flex', flexDirection: 'column',
        outline: 'none',
      }}
    >
      {/* Top section */}
      <div style={{ flex: 1, padding: '8px', display: 'flex', gap: 6 }}>
        {/* Name selection box */}
        <div style={{
          position: 'relative',
          width: '62%',
          border: '3px solid #000',
          boxShadow: 'inset 0 0 0 1px #F0EFE7, inset 0 0 0 3px #000',
          background: '#F0EFE7',
          padding: '5px 7px',
          display: 'flex', flexDirection: 'column', gap: 1,
        }}>
          {/* Corner squares */}
          {[{ top: -2, left: -2 }, { top: -2, right: -2 }, { bottom: -2, left: -2 }, { bottom: -2, right: -2 }].map((pos, i) => (
            <div key={i} style={{ position: 'absolute', ...pos, width: 5, height: 5, background: '#F0EFE7', zIndex: 1 }} />
          ))}

          {/* "NAME" title */}
          <div style={{
            textAlign: 'center',
            fontFamily: PS2, fontSize: 6, color: '#000',
            borderBottom: '2px solid #000',
            paddingBottom: 3, marginBottom: 2,
          }}>
            ━NAME━
          </div>

          {OPTIONS.map((opt, i) => (
            <div
              key={i}
              onClick={() => { setCursor(i); select(i) }}
              onMouseEnter={() => setCursor(i)}
              style={{
                fontFamily: PS2, fontSize: 6.5, color: '#000',
                padding: '3px 2px',
                display: 'flex', alignItems: 'center', gap: 4,
                cursor: 'pointer',
              }}
            >
              <span style={{
                width: 8, flexShrink: 0, lineHeight: 1,
                color: cursor === i ? '#000' : 'transparent',
              }}>▶</span>
              <span>{opt}</span>
            </div>
          ))}
        </div>

        {/* Right side: empty space (player sprite would go here) */}
        <div style={{ flex: 1 }} />
      </div>

      {/* Bottom: dialogue */}
      <div style={{
        height: '40%',
        borderTop: '3px solid #000',
        boxShadow: 'inset 0 0 0 2px #F0EFE7, inset 0 0 0 4px #000',
        padding: '8px 10px',
        background: '#F0EFE7',
      }}>
        <span style={{ fontFamily: VT, fontSize: 18, color: '#000', lineHeight: 1.35 }}>
          {'First, what is\nyour name?'}
        </span>
      </div>
    </div>
  )
}
