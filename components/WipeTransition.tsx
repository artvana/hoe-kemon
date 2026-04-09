'use client'

interface WipeTransitionProps {
  active: boolean
  onComplete: () => void
}

export default function WipeTransition({ active }: WipeTransitionProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        pointerEvents: active ? 'all' : 'none',
      }}
    >
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${i * 5}vh`,
            height: '5vh',
            background: '#0a0a0a',
            transformOrigin: 'top',
            transform: active ? 'scaleY(1)' : 'scaleY(0)',
            transition: active
              ? `transform 0.25s ease ${i * 18}ms`
              : `transform 0.25s ease ${(19 - i) * 18}ms`,
          }}
        />
      ))}
    </div>
  )
}
