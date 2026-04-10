'use client'

interface WipeTransitionProps {
  active: boolean
  onComplete: () => void
}

export default function WipeTransition({ active }: WipeTransitionProps) {
  // Inside GameBoy display = position: absolute (relative to the display div)
  // Inside card outer = also absolute (relative to screen-card-outer which is fixed)
  // Using position: absolute works in both contexts.
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1000,
        pointerEvents: active ? 'all' : 'none',
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${i * 10}%`,
            height: '10%',
            background: '#0a0a0a',
            transformOrigin: 'top',
            transform: active ? 'scaleY(1)' : 'scaleY(0)',
            transition: active
              ? `transform 0.25s ease ${i * 30}ms`
              : `transform 0.25s ease ${(9 - i) * 30}ms`,
          }}
        />
      ))}
    </div>
  )
}
