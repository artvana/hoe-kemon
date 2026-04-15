export type Scene =
  | 'boot'
  | 'oak-intro'
  | 'name-entry'
  | 'connect-instagram'
  | 'lab'
  | 'battle-loading'
  | 'pokedex-species'
  | 'pokedex-backstory'
  | 'pokedex-entry'
  | 'sprite-wait'
  | 'card-reveal'
  | 'oak-outro'

export type Gen1Type =
  | 'Normal' | 'Fire' | 'Water' | 'Grass' | 'Electric'
  | 'Ice' | 'Fighting' | 'Poison' | 'Ground' | 'Flying'
  | 'Psychic' | 'Bug' | 'Rock' | 'Ghost' | 'Dragon'

export interface HoekemonAttack {
  name: string
  power: number
  type: Gen1Type
  superEffective: boolean
}

export interface HoekemonData {
  name: string
  type1: Gen1Type
  type2: Gen1Type | null
  level: number
  hp: number
  visualDescription: string
  stats: {
    charisma: number    // C — engagement magnetism
    uniqueness: number  // U — distinctiveness of aesthetic
    nerve: number       // N — boldness / posting frequency
    talent: number      // T — actual skill on display
    avoidance: number   // how much they ghost their own audience
  }
  attacks: HoekemonAttack[]
  weakness: string
  catchPhrase: string
  backstory: string
  pokedexEntry: string
  height: string
  weight: string
  gender?: 'male' | 'female' | 'nonbinary'  // inferred from Instagram data
  basePokemon?: string   // base Pokémon for img2img — selected randomly at generation time
  spriteUrl?: string
}

export interface AppState {
  scene: Scene
  playerName: string
  hoekemon: HoekemonData | null
  spriteUrl: string | null
  spriteLoading: boolean
  connectionId: string | null
}
