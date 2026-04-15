// Gen 1 Pokémon IDs for official-artwork from PokeAPI CDN.
// Used as base image for img2img — deliberately NON-humanoid so output stays creature-shaped.
// Removed: Jynx, Mr. Mime, Alakazam, Hypno, Machamp, Hitmonlee, Hitmonchan,
//          Nidoking, Nidoqueen, Electabuzz, Magmar, Rhydon, Lickitung, Marowak
export const POKEMON_IDS: Record<string, number> = {
  // starters
  bulbasaur: 1, ivysaur: 2, venusaur: 3,
  charmander: 4, charmeleon: 5, charizard: 6,
  squirtle: 7, wartortle: 8, blastoise: 9,
  // bugs
  butterfree: 12, beedrill: 15,
  // birds
  pidgeot: 18, fearow: 22, dodrio: 85,
  // snakes / beasts
  arbok: 24, arcanine: 59,
  // rodents
  pikachu: 25, raichu: 26,
  // fairies
  clefairy: 35, clefable: 36,
  // foxes
  vulpix: 37, ninetales: 38,
  // pop stars (round bois)
  jigglypuff: 39, wigglytuff: 40,
  // grass
  vileplume: 45, victreebel: 71, tangela: 114,
  // bugs 2
  venomoth: 49, scyther: 123, pinsir: 127,
  // cats
  persian: 53,
  // ducks (non-humanoid enough)
  psyduck: 54,
  // dogs / horses
  growlithe: 58, rapidash: 78,
  // frogs
  poliwag: 60, poliwhirl: 61, poliwrath: 62,
  // sea creatures
  tentacool: 72, tentacruel: 73,
  // slow bois
  slowpoke: 79, slowbro: 80,
  // electric
  magneton: 82, voltorb: 100, electrode: 101,
  // ghosts
  gastly: 92, haunter: 93, gengar: 94,
  // poison blobs
  grimer: 88, muk: 89, koffing: 109, weezing: 110,
  // onix
  onix: 95,
  // crabs
  krabby: 98, kingler: 99,
  // eggs / trees
  exeggcute: 102, exeggutor: 103,
  // ground
  golem: 76, geodude: 74, dugtrio: 51,
  // ice
  dewgong: 87, cloyster: 91, articuno: 144,
  // water 2
  staryu: 120, starmie: 121,
  // water 3
  goldeen: 118, seaking: 119, horsea: 116, seadra: 117,
  // eeveelutions
  eevee: 133, vaporeon: 134, jolteon: 135, flareon: 136,
  // misc beasts
  snorlax: 143, lapras: 131, kangaskhan: 115, tauros: 128,
  // fossils
  omanyte: 138, omastar: 139, kabuto: 140, kabutops: 141, aerodactyl: 142,
  // dragons
  dratini: 147, dragonair: 148, dragonite: 149,
  // legends
  zapdos: 145, moltres: 146,
  mewtwo: 150, mew: 151,
  // rock
  sandslash: 28,
  // cute
  chansey: 113,
}

export function getOfficialArtworkUrl(pokemonName: string): string | null {
  const key = pokemonName.toLowerCase().replace(/[^a-z0-9_]/g, '_')
  const id = POKEMON_IDS[key] ?? POKEMON_IDS[pokemonName.toLowerCase()]
  if (!id) return null
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

// Pools: creature-shaped Pokémon only — no bipedal humanoids
const TYPE_POOL: Record<string, string[]> = {
  Fire:     ['charizard', 'ninetales', 'rapidash', 'arcanine', 'flareon', 'moltres', 'charmeleon'],
  Water:    ['vaporeon', 'gyarados', 'lapras', 'starmie', 'tentacruel', 'blastoise', 'seaking', 'dewgong', 'wartortle'],
  Grass:    ['venusaur', 'vileplume', 'victreebel', 'tangela', 'ivysaur', 'exeggutor'],
  Electric: ['raichu', 'jolteon', 'magneton', 'zapdos', 'electrode', 'pikachu'],
  Psychic:  ['starmie', 'slowbro', 'mewtwo', 'mew', 'exeggutor', 'slowpoke'],
  Ghost:    ['gengar', 'haunter', 'gastly'],
  Normal:   ['clefable', 'wigglytuff', 'snorlax', 'persian', 'jigglypuff', 'kangaskhan', 'tauros', 'eevee', 'chansey'],
  Flying:   ['pidgeot', 'fearow', 'aerodactyl', 'charizard', 'moltres', 'dodrio'],
  Fighting: ['poliwrath', 'arcanine', 'tauros', 'kangaskhan'],
  Ground:   ['golem', 'sandslash', 'dugtrio', 'onix', 'geodude'],
  Poison:   ['gengar', 'muk', 'weezing', 'arbok', 'tentacruel', 'koffing', 'vileplume'],
  Ice:      ['articuno', 'lapras', 'dewgong', 'cloyster', 'vaporeon'],
  Rock:     ['golem', 'omastar', 'kabutops', 'aerodactyl', 'onix'],
  Bug:      ['butterfree', 'venomoth', 'scyther', 'pinsir', 'beedrill'],
  Dragon:   ['dragonair', 'dragonite', 'charizard', 'aerodactyl', 'gyarados'],
}

export function pickBasePokemon(type1: string): string {
  const pool = TYPE_POOL[type1] ?? TYPE_POOL['Normal']
  return pool[Math.floor(Math.random() * pool.length)]
}
