import Replicate from 'replicate'
import { getOfficialArtworkUrl } from './pokemonIds'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

const NEGATIVE_PROMPT =
  'human, person, text, watermark, multiple creatures, background, scenery, ' +
  'realistic, photograph, 3d render, ugly, deformed'

// ── img2img sprite generation ─────────────────────────────────────────────────
// Uses PokeAPI official artwork as init_image so the creature inherits the base
// Pokémon's silhouette and feel, then the prompt drives the drag transformation.
export async function startSpriteGeneration(
  visualDescription: string,
  name: string = '',
  type: string = '',
  basePokemon: string = ''
): Promise<string> {
  const initImageUrl = getOfficialArtworkUrl(basePokemon)

  // Transformation-focused prompt — the init image handles the base shape,
  // so the prompt just describes how it diverges from the original.
  const prompt = [
    'official gen 1 Pokemon art style',
    name ? `${name} the ${type} type Pokemon` : `a ${type} type Pokemon`,
    visualDescription.slice(0, 200),
    'Ken Sugimori watercolour illustration',
    'centered on white background',
    'no text, no humans, no background scenery',
  ].filter(Boolean).join(', ')

  const input: Record<string, unknown> = {
    prompt,
    negative_prompt: NEGATIVE_PROMPT,
    num_outputs: 1,
    num_inference_steps: 20,
    guidance_scale: 7.5,
    output_format: 'png',
  }

  if (initImageUrl) {
    // img2img — init image provides the base Pokémon silhouette
    input.init_image = initImageUrl
    input.strength = 0.65   // 65% prompt influence, 35% base image preserved
  }

  const prediction = await replicate.predictions.create({
    model: 'fofr/pokemon-sdxl',
    input,
  })
  return prediction.id
}

export async function getSpriteStatus(
  id: string
): Promise<{ status: string; url?: string }> {
  const prediction = await replicate.predictions.get(id)
  if (prediction.status === 'succeeded' && prediction.output) {
    const url = Array.isArray(prediction.output)
      ? prediction.output[0]
      : prediction.output
    return { status: 'ready', url: url as string }
  }
  if (prediction.status === 'failed' || prediction.status === 'canceled') {
    return { status: 'failed' }
  }
  return { status: 'loading' }
}
