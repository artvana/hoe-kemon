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
      style={{ background: '#2038A0' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          background: 'var(--gb-cream)',
          border: '4px solid var(--gb-black)',
          boxShadow: '6px 6px 0 var(--gb-black)',
          padding: '24px 28px',
          minWidth: 280,
          maxWidth: 340,
          width: '90%',
        }}
      >
        <p
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10,
            color: 'var(--gb-black)',
            marginBottom: 20,
            lineHeight: 1.6,
          }}
        >
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
            fontSize: 24,
            color: 'var(--gb-black)',
            background: 'white',
            border: '3px solid var(--gb-black)',
            padding: '6px 10px',
            width: '100%',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            boxSizing: 'border-box',
          }}
        />

        <div style={{ marginTop: 16 }}>
          <button
            className="menu-option"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            onClick={handleSubmit}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
