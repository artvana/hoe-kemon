'use client'

interface OakSpriteProps {
  style?: React.CSSProperties
}

export default function OakSprite({ style }: OakSpriteProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 148,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 96,
        height: 192,
        ...style,
      }}
    >
      {/* ── White hair top ── */}
      <div style={{
        position: 'absolute', top: 0, left: 18, width: 54, height: 22,
        background: '#DDDDD0', border: '2px solid #888880', borderRadius: '10px 10px 0 0',
      }} />
      {/* Hair sides */}
      <div style={{ position: 'absolute', top: 10, left: 10, width: 14, height: 20, background: '#DDDDD0', border: '2px solid #888880', borderRadius: '6px 0 0 10px' }} />
      <div style={{ position: 'absolute', top: 10, right: 10, width: 14, height: 20, background: '#DDDDD0', border: '2px solid #888880', borderRadius: '0 6px 10px 0' }} />

      {/* ── Face ── */}
      <div style={{
        position: 'absolute', top: 16, left: 16, width: 60, height: 46,
        background: '#F0C07A', border: '2px solid #B88040', borderRadius: 8,
      }}>
        {/* Glasses left */}
        <div style={{ position: 'absolute', top: 12, left: 4, width: 22, height: 16, border: '2.5px solid #5A5A5A', borderRadius: 4, background: 'rgba(200,220,240,0.25)' }} />
        {/* Glasses right */}
        <div style={{ position: 'absolute', top: 12, right: 4, width: 22, height: 16, border: '2.5px solid #5A5A5A', borderRadius: 4, background: 'rgba(200,220,240,0.25)' }} />
        {/* Glasses bridge */}
        <div style={{ position: 'absolute', top: 19, left: 26, width: 6, height: 2, background: '#5A5A5A' }} />
        {/* Eyes (behind glass) */}
        <div style={{ position: 'absolute', top: 16, left: 10, width: 7, height: 7, background: '#2A1A0A', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: 16, right: 10, width: 7, height: 7, background: '#2A1A0A', borderRadius: '50%' }} />
        {/* Nose */}
        <div style={{ position: 'absolute', top: 28, left: 24, width: 9, height: 5, background: '#D09050', borderRadius: 3 }} />
        {/* Mouth (friendly) */}
        <div style={{ position: 'absolute', bottom: 7, left: 14, width: 20, height: 4, background: '#A07050', borderRadius: '0 0 4px 4px' }} />
        <div style={{ position: 'absolute', bottom: 9, left: 14, width: 20, height: 2, background: '#A07050' }} />
      </div>

      {/* ── Neck ── */}
      <div style={{ position: 'absolute', top: 58, left: 34, width: 22, height: 12, background: '#F0C07A', border: '1px solid #B88040' }} />

      {/* ── Lab coat body ── */}
      <div style={{
        position: 'absolute', top: 66, left: 6, width: 82, height: 96,
        background: '#F6F6F2', border: '2px solid #B0B0A8', borderRadius: '3px 3px 0 0',
      }}>
        {/* Inner blue shirt/collar */}
        <div style={{ position: 'absolute', top: 0, left: 26, width: 28, height: 16, background: '#5570B0', borderRadius: '0 0 6px 6px', border: '1px solid #3A4F8A' }} />
        {/* Coat lapel left */}
        <div style={{
          position: 'absolute', top: 4, left: 0, width: 28, height: 20,
          background: '#F6F6F2', borderRight: '2px solid #C8C8C0',
          transform: 'skewY(-20deg)', transformOrigin: 'top right',
        }} />
        {/* Coat lapel right */}
        <div style={{
          position: 'absolute', top: 4, right: 0, width: 28, height: 20,
          background: '#F6F6F2', borderLeft: '2px solid #C8C8C0',
          transform: 'skewY(20deg)', transformOrigin: 'top left',
        }} />
        {/* Centre seam */}
        <div style={{ position: 'absolute', top: 22, bottom: 0, left: '50%', width: 1, background: '#C8C8C0' }} />
        {/* Buttons */}
        <div style={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)', width: 5, height: 5, background: '#999990', borderRadius: '50%', border: '1px solid #777' }} />
        <div style={{ position: 'absolute', top: 38, left: '50%', transform: 'translateX(-50%)', width: 5, height: 5, background: '#999990', borderRadius: '50%', border: '1px solid #777' }} />
        <div style={{ position: 'absolute', top: 52, left: '50%', transform: 'translateX(-50%)', width: 5, height: 5, background: '#999990', borderRadius: '50%', border: '1px solid #777' }} />
        {/* Chest pocket */}
        <div style={{ position: 'absolute', top: 14, left: 8, width: 18, height: 16, border: '1.5px solid #B0B0A8', borderRadius: 2 }} />
        {/* Pocket flap */}
        <div style={{ position: 'absolute', top: 12, left: 7, width: 20, height: 5, background: '#EBEBE7', border: '1.5px solid #B0B0A8', borderRadius: '2px 2px 0 0' }} />
      </div>

      {/* ── Left arm ── */}
      <div style={{
        position: 'absolute', top: 70, left: -6, width: 16, height: 70,
        background: '#F6F6F2', border: '2px solid #B0B0A8', borderRadius: '3px 3px 8px 8px',
        transform: 'rotate(5deg)', transformOrigin: 'top center',
      }} />
      {/* ── Right arm ── */}
      <div style={{
        position: 'absolute', top: 70, right: -6, width: 16, height: 70,
        background: '#F6F6F2', border: '2px solid #B0B0A8', borderRadius: '3px 3px 8px 8px',
        transform: 'rotate(-5deg)', transformOrigin: 'top center',
      }} />
      {/* ── Left hand ── */}
      <div style={{ position: 'absolute', top: 132, left: -10, width: 18, height: 14, background: '#F0C07A', border: '2px solid #B88040', borderRadius: '4px 4px 8px 8px' }} />
      {/* ── Right hand ── */}
      <div style={{ position: 'absolute', top: 132, right: -10, width: 18, height: 14, background: '#F0C07A', border: '2px solid #B88040', borderRadius: '4px 4px 8px 8px' }} />

      {/* ── Trousers left leg ── */}
      <div style={{
        position: 'absolute', top: 158, left: 14, width: 28, height: 32,
        background: '#3A506A', border: '2px solid #2A3A52', borderRadius: '0 0 4px 4px',
      }} />
      {/* ── Trousers right leg ── */}
      <div style={{
        position: 'absolute', top: 158, right: 14, width: 28, height: 32,
        background: '#3A506A', border: '2px solid #2A3A52', borderRadius: '0 0 4px 4px',
      }} />
      {/* ── Left shoe ── */}
      <div style={{ position: 'absolute', top: 184, left: 10, width: 34, height: 10, background: '#2A2828', border: '1.5px solid #1A1818', borderRadius: '2px 4px 4px 2px' }} />
      {/* ── Right shoe ── */}
      <div style={{ position: 'absolute', top: 184, right: 10, width: 34, height: 10, background: '#2A2828', border: '1.5px solid #1A1818', borderRadius: '4px 2px 2px 4px' }} />
    </div>
  )
}
