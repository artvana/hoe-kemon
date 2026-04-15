'use client'

import HoekemonCard from '@/components/HoekemonCard'
import { HoekemonData } from '@/lib/types'

const EXAMPLE: HoekemonData = {
  name: 'POPKENTURA',
  type1: 'Electric',
  type2: 'Normal',
  level: 42,
  hp: 69,
  visualDescription:
    'A round glossy Electric-type orb creature with chrome-yellow and black scales, one enormous mirrored reflective lens fused permanently to its front where eyes should be. A rhinestone-studded corset wraps its creature midsection and chunky platform boots grip its two stubby clawed feet. A feather boa of crackling yellow sparks coils around its neck.',
  stats: {
    charisma: 78,
    uniqueness: 88,
    nerve: 95,
    talent: 82,
    avoidance: 41,
  },
  attacks: [
    { name: 'Pop(ken)Slap', power: 65, type: 'Electric', superEffective: false },
    { name: 'Satin Comeback', power: 89, type: 'Fire', superEffective: true },
  ],
  weakness: 'Natural Lighting',
  catchPhrase: "The audacity of @popken429 to call himself 'the new queen with that platinum sound' in his bio and then go book BCC Mainstage. Respect, actually.",
  backstory:
    "Philip W. Popken arrived in Brooklyn already wearing the sunglasses. Scientists believe he was born in them. He maintains two Instagram accounts — @popkenculture and @digiiimic — because one platform cannot contain the audacity of a man whose bio is a mission statement and whose show is a pun. He follows 1,548 people, which is suspiciously close to his follower count, suggesting a deep philosophical commitment to the concept of mutual surveillance. His 2,117 followers have all agreed, in their hearts, to show up to BCC Mainstage on a Tuesday. That is devotion. That is the platinum sound working.",
  pokedexEntry:
    'Adores dark venues. Its reflective lenses have never been removed in any documented photograph. Posts show flyers when threatened.',
  height: 'Bar height',
  weight: 'none of ur business',
  basePokemon: 'electrode',
}

const TEST_SPRITE: string | null = 'https://replicate.delivery/xezq/jvq37piRvVIMBR5c91YYhbgKqa6iZkNJeDtH2O0UpQb0eZbWA/out-0.png'

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
        fontFamily: "'Pokemon GB', monospace",
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
