'use client'

import { useState } from 'react'

interface PokeballTableProps {
  onSelect: (index: number) => void
  selectedIndex: number | null
  enabled?: boolean
}

function Pokeball({
  index,
  selected,
  onSelect,
}: {
  index: number
  selected: boolean
  onSelect: (i: number) => void
}) {
  const [hovering, setHovering] = useState(false)

  return (
    <div
      className={`pokeball ${selected ? 'selected' : ''}`}
      style={{
        animation: hovering && !selected ? 'wobble 0.4s ease-in-out infinite' : undefined,
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={(e) => {
        e.stopPropagation()
        if (!selected) onSelect(index)
      }}
    >
      <div className="pokeball-top" />
      <div className="pokeball-band" />
      <div className="pokeball-bottom" />
      <div className="pokeball-centre" />
    </div>
  )
}

export default function PokeballTable({ onSelect, selectedIndex, enabled = true }: PokeballTableProps) {
  const [localSelected, setLocalSelected] = useState<number | null>(selectedIndex)

  function handleSelect(i: number) {
    if (!enabled) return
    setLocalSelected(i)
    setTimeout(() => onSelect(i), 450)
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 212,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 48,
        alignItems: 'center',
      }}
    >
      {[0, 1, 2].map((i) => (
        <Pokeball
          key={i}
          index={i}
          selected={localSelected === i}
          onSelect={handleSelect}
        />
      ))}
    </div>
  )
}
