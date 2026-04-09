'use client'

import { useRef, useState } from 'react'
import { HoekemonData } from '@/lib/types'
import HoekemonCard from './HoekemonCard'
import { captureCard } from '@/lib/cardCapture'

export default function ShareButton({
  hoekemon,
  spriteUrl,
}: {
  hoekemon: HoekemonData
  spriteUrl: string | null
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('SHARE THIS BEAST')

  async function handleShare(e: React.MouseEvent) {
    e.stopPropagation()
    if (!cardRef.current) return
    await captureCard(cardRef.current)
    setLabel('SAVED ✓')
    setTimeout(() => setLabel('SHARE THIS BEAST'), 2000)
  }

  return (
    <>
      {/* Hidden full-res card for capture */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
        <div ref={cardRef}>
          <HoekemonCard data={hoekemon} spriteUrl={spriteUrl} forCapture />
        </div>
      </div>
      <button
        className="pixel-btn pixel-btn-pink"
        onClick={handleShare}
      >
        ▶ {label}
      </button>
    </>
  )
}
