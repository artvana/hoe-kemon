'use client'

interface HPBarProps {
  current: number
  max: number
  label?: string
}

export default function HPBar({ current, max, label }: HPBarProps) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100))
  const colour =
    pct > 50 ? 'var(--hp-green)' : pct > 20 ? 'var(--hp-yellow)' : 'var(--hp-red)'

  return (
    <div className="hp-bar-container">
      {label && <span className="hp-bar-label">{label}</span>}
      <div className="hp-bar-track">
        <div className="hp-bar-fill" style={{ width: `${pct}%`, background: colour }} />
      </div>
    </div>
  )
}
