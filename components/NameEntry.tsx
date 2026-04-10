'use client'

import { useState } from 'react'

interface NameEntryProps {
  onSubmit: (name: string) => void
}

export default function NameEntry({ onSubmit }: NameEntryProps) {
  const [value, setValue] = useState('')

  function handleSubmit() {
    const clean = value.trim().replace(/^@/, '')
    if (clean) onSubmit(clean)
  }

  return (
    <div
      className="screen"
      style={{ background: '#F0EFE7' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{
        background: '#F0EFE7',
        border: '4px solid #000',
        boxShadow: 'inset 0 0 0 2px #F0EFE7, inset 0 0 0 4px #000',
        padding: '28px 32px',
        minWidth: 280,
        maxWidth: 340,
        width: '90%',
      }}>
        <p style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 9,
          color: '#000',
          marginBottom: 22,
          lineHeight: 1.8,
        }}>
          YOUR NAME?
        </p>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
          placeholder="INSTAGRAM HANDLE"
          maxLength={20}
          autoFocus
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: 26,
            color: '#000',
            background: '#fff',
            border: '3px solid #000',
            padding: '6px 10px',
            width: '100%',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            boxSizing: 'border-box',
          }}
        />

        <div style={{ marginTop: 18 }}>
          <button
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 9,
              color: '#000',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 0',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
            onClick={handleSubmit}
          >
            <span style={{ animation: 'blink 0.8s step-end infinite' }}>▶</span>
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
