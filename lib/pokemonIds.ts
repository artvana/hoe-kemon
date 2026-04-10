// Base Pokémon IDs for official-artwork from PokeAPI CDN.
// Used as init_image for img2img sprite generation.
export const POKEMON_IDS: Record<string, number> = {
  bulbasaur: 1, ivysaur: 2, venusaur: 3,
  charmander: 4, charmeleon: 5, charizard: 6,
  squirtle: 7, blastoise: 9,
  pikachu: 25, raichu: 26,
  clefairy: 35, clefable: 36,
  vulpix: 37, jigglypuff: 39,
  meowth: 52, psyduck: 54,
  growlithe: 58, arcanine: 59,
  gengar: 94,
  eevee: 133, vaporeon: 134, jolteon: 135, flareon: 136,
  snorlax: 143, mewtwo: 150,
}

export function getOfficialArtworkUrl(pokemonName: string): string | null {
  const id = POKEMON_IDS[pokemonName.toLowerCase()]
  if (!id) return null
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}
