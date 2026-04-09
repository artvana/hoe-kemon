import { TYPE_COLOURS, TYPE_TEXT_COLOURS } from '@/lib/typeColours'

interface TypeBadgeProps {
  type: string
}

export default function TypeBadge({ type }: TypeBadgeProps) {
  const bg = TYPE_COLOURS[type] ?? '#A8A878'
  const color = TYPE_TEXT_COLOURS[type] ?? '#000'

  return (
    <span
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 5,
        background: bg,
        color,
        padding: '2px 6px',
        display: 'inline-block',
        lineHeight: 1.8,
        letterSpacing: '0.05em',
      }}
    >
      {type.toUpperCase()}
    </span>
  )
}
