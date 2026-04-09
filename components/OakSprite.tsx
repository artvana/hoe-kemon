'use client'

interface OakSpriteProps {
  style?: React.CSSProperties
}

export default function OakSprite({ style }: OakSpriteProps) {
  return (
    <div
      className="animate-idle-bounce"
      style={{
        position: 'absolute',
        bottom: 160,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 80,
        height: 120,
        ...style,
      }}
    >
      {/* Hair */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 10,
          right: 10,
          height: 12,
          background: '#3B2A1A',
          borderRadius: '4px 4px 0 0',
        }}
      />
      {/* Head */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          width: 36,
          height: 30,
          background: '#F0C88A',
          border: '2px solid #C8A060',
          borderRadius: 6,
        }}
      >
        {/* Eyes */}
        <div style={{ position: 'absolute', top: 10, left: 6, width: 5, height: 5, background: '#3B2A1A', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: 10, right: 6, width: 5, height: 5, background: '#3B2A1A', borderRadius: '50%' }} />
        {/* Mouth */}
        <div style={{ position: 'absolute', bottom: 6, left: 9, width: 12, height: 2, background: '#8B6040', borderRadius: 2 }} />
      </div>
      {/* Lab coat body */}
      <div
        style={{
          position: 'absolute',
          top: 38,
          left: 0,
          width: 52,
          height: 56,
          background: '#F0F0F0',
          border: '2px solid #C0C0C0',
          borderRadius: '4px 4px 0 0',
        }}
      >
        {/* Coat lapels */}
        <div style={{ position: 'absolute', top: 4, left: 12, width: 2, height: 20, background: '#D0D0D0' }} />
        <div style={{ position: 'absolute', top: 4, right: 12, width: 2, height: 20, background: '#D0D0D0' }} />
        {/* Pocket */}
        <div style={{ position: 'absolute', bottom: 10, left: 8, width: 10, height: 10, border: '1px solid #C0C0C0' }} />
      </div>
      {/* Left arm */}
      <div
        style={{
          position: 'absolute',
          top: 42,
          left: -10,
          width: 12,
          height: 36,
          background: '#F0F0F0',
          border: '2px solid #C0C0C0',
          borderRadius: 4,
          transform: 'rotate(8deg)',
        }}
      />
      {/* Right arm */}
      <div
        style={{
          position: 'absolute',
          top: 42,
          right: -6,
          width: 12,
          height: 36,
          background: '#F0F0F0',
          border: '2px solid #C0C0C0',
          borderRadius: 4,
          transform: 'rotate(-8deg)',
        }}
      />
    </div>
  )
}
