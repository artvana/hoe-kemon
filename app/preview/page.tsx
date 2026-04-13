'use client'

import HoekemonCard from '@/components/HoekemonCard'
import { HoekemonData } from '@/lib/types'

const EXAMPLE: HoekemonData = {
  name: 'DRAGKWEEN',
  type1: 'Fire',
  type2: 'Psychic',
  level: 69,
  hp: 99,
  visualDescription:
    'A serpentine Fire-type creature towering on 9-inch chrome platform thigh-high boots, wearing a floor-length sequined scarlet mermaid gown with a thigh-high slit. Her makeup features razor-sharp cat-eye liner extending to her temples with rhinestone teardrops, and a two-toned ombre lip in molten gold and crimson. She wears a boa made entirely of crumpled DM notifications and unread receipts, and her talon-length acrylic nails are shaped like tiny flame emojis. Color palette: overexposed drag-show spotlights, deep crimson, and influencer-gold.',
  stats: {
    charisma: 91,
    uniqueness: 78,
    nerve: 85,
    talent: 74,
    avoidance: 62,
  },
  attacks: [
    { name: 'Snatchgaze', power: 45, type: 'Psychic', superEffective: false },
    { name: 'Runwaylash', power: 85, type: 'Fire', superEffective: true },
  ],
  weakness: 'Natural Lighting',
  catchPhrase: "If you can't love yourself, how in the hell are you gonna post a mirror selfie at this hour, baby?",
  backstory:
    "Deep in the wild habitat of the curated grid, DRAGKWEEN first emerged during a Mercury retrograde — documented entirely in Stories that have since expired. Scientists believe she migrated from a smaller account, shedding followers like dead skin as she ascended. Her bio has contained the phrase 'era of accountability' since 2021. It has not yet begun.",
  pokedexEntry:
    "Obviously prefers ring-lit environments. When natural lighting occurs, posting ceases entirely.",
  height: "Taller in heels",
  weight: "none of ur business",
  basePokemon: 'charizard',
}

const TEST_SPRITE: string | null = 'https://replicate.delivery/xezq/rYZBQ2IkImaGPZheZlRgNL1Wph7QoQBEXpvIHyRp2B2G0UNLA/out-0.png'

export default function PreviewPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a0a2e 0%, #0d0519 50%, #1a0008 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      padding: 40,
    }}>
      <p style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 8,
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: 2,
        textTransform: 'uppercase',
      }}>
        Card Preview — dev only
      </p>
      <HoekemonCard data={EXAMPLE} spriteUrl={TEST_SPRITE} />
      <p style={{
        fontFamily: "'VT323', monospace",
        fontSize: 14,
        color: 'rgba(255,255,255,0.25)',
      }}>
        Sprite slot is {TEST_SPRITE ? 'filled' : 'empty — showing placeholder'}
      </p>
    </div>
  )
}
