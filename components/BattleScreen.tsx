'use client'

import { useState } from 'react'
import DialogueBox from './DialogueBox'
import HPBar from './HPBar'
import OakSprite from './OakSprite'

const BATTLE_LINES = [
  'A wild HOE-KEMON\nappeared!',
  'OAK used DATA SCANNER!',
  'Scanning posting frequency...',
  'Analysing thirst levels...',
  'Cross-referencing the ratio...',
  'What? Something is happening...',
  "OAK's HP dropped to 0.",
  'OAK fainted.',
  '...but the data was retrieved.',
]

interface BattleScreenProps {
  playerName?: string
  onComplete: () => void
}

export default function BattleScreen({ onComplete }: BattleScreenProps) {
  const [flashing, setFlashing] = useState(false)

  function handleDialogueComplete() {
    setFlashing(true)
    setTimeout(() => {
      setFlashing(false)
      onComplete()
    }, 950)
  }

  return (
    <div className="screen battle-bg">
      {/* Enemy platform + silhouette */}
      <div className="battle-platform-enemy" />
      <div
        className={flashing ? 'animate-flash-white' : 'animate-silhouette-pulse'}
        style={{
          position: 'absolute',
          top: 30,
          right: 60,
          width: 110,
          height: 130,
          background: 'var(--neon-pink)',
          borderRadius: '50% 50% 40% 40%',
        }}
      />

      {/* Enemy HUD */}
      <div className="battle-hud battle-hud-enemy">
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, marginBottom: 6 }}>???</div>
        <HPBar current={100} max={100} label="HP" />
      </div>

      {/* Player platform + Oak */}
      <div className="battle-platform-player" />
      <OakSprite />

      {/* Player HUD */}
      <div className="battle-hud battle-hud-player">
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, marginBottom: 6 }}>
          OAK
        </div>
        <HPBar current={1} max={999} label="HP" />
      </div>

      <DialogueBox lines={BATTLE_LINES} onComplete={handleDialogueComplete} />
    </div>
  )
}
