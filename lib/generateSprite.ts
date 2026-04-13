import Replicate from 'replicate'
import { getOfficialArtworkUrl } from './pokemonIds'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

// flux-schnell: fast (4 steps), supports image input for img2img
const MODEL = 'black-forest-labs/flux-schnell'

export async function startSpriteGeneration(
  visualDescription: string,
  name: string = '',
  type: string = '',
  basePokemon: string = ''
): Promise<string> {
  const baseImageUrl = getOfficialArtworkUrl(basePokemon)

  const prompt = [
    'Gen 1 Pokemon TCG official artwork by Ken Sugimori',
    'vibrant watercolor illustration on pure white background',
    'fierce dynamic action pose, powerful stance, expressive glowing eyes, dramatic energy aura',
    name ? `${name} a fierce ${type}-type Pokemon creature` : `a fierce ${type}-type Pokemon creature`,
    visualDescription.slice(0, 200),
    `${type}-type energy effects, vivid saturated colors, dramatic lighting, full of personality`,
    'no humans, no text, no background scenery, no ground, floating centered',
  ].filter(Boolean).join(', ')

  const input: Record<string, unknown> = {
    prompt,
    num_inference_steps: 4,
    output_format: 'png',
    aspect_ratio: '1:1',
  }

  if (baseImageUrl) {
    // img2img: start from the official Pokémon artwork so the creature
    // inherits its silhouette and the Ken Sugimori art style for free
    input.image = baseImageUrl
    input.prompt_strength = 0.85  // 85% new content, 15% base image preserved
    console.log('[Replicate] Using base Pokémon artwork:', basePokemon, baseImageUrl)
  }

  const prediction = await replicate.predictions.create({ model: MODEL, input })
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

// Fire-and-forget warmup: starts a minimal generation to heat the GPU.
export async function warmupModel(): Promise<void> {
  try {
    await replicate.predictions.create({
      model: MODEL,
      input: {
        prompt: 'a fire type pokemon cartoon creature, white background',
        num_inference_steps: 4,
      },
    })
  } catch {
    // Non-fatal — best-effort warmup
  }
}
